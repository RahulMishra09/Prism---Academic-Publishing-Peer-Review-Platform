import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@shared/ui';
import { useCreateJournal, useUpdateJournal } from '../../../entities/journal/api/journalAdminQueries';
import { DISCIPLINES } from '../../../shared/constants/disciplines';
import type { JournalDraft, JournalAccessType, JournalEditor, JournalStatus } from '../../../entities/journal/model/types';

interface JournalFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<JournalDraft>;
    originalSlug?: string;
    onSuccess?: (slug: string) => void;
}

const EMPTY_DRAFT: JournalDraft = {
    title: '',
    abbreviation: '',
    slug: '',
    electronicISSN: '',
    printISSN: '',
    publisher: 'Lumex Publishing',
    accessType: 'hybrid',
    discipline: [],
    subdiscipline: [],
    description: '',
    aimsAndScope: '',
    coverImageUrl: '',
    logoUrl: '',
    foundedYear: undefined,
    frequency: '',
    language: ['English'],
    indexedIn: [],
    articleProcessingCharge: undefined,
    apaCurrency: 'USD',
    openAccess: false,
    editors: [],
    status: 'active',
};

const FREQUENCY_OPTIONS = ['Weekly', 'Biweekly', 'Monthly', 'Bimonthly', 'Quarterly', 'Semiannual', 'Annual', 'Continuous'];
const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];
const INDEX_OPTIONS = ['Scopus', 'Web of Science', 'PubMed / MEDLINE', 'DOAJ', 'Embase', 'Cochrane', 'ERIC', 'PsycINFO', 'IEEE Xplore'];
const LANGUAGE_OPTIONS = ['English', 'Chinese', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese', 'Arabic'];
const ACCESS_OPTIONS: { value: JournalAccessType; label: string }[] = [
    { value: 'gold_oa', label: 'Gold Open Access' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'free', label: 'Free' },
];
const STATUS_OPTIONS: { value: JournalStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
];

const TABS = ['Basic Info', 'Identifiers', 'Access & Pricing', 'Classification', 'Details', 'Branding', 'Editorial'] as const;
type Tab = (typeof TABS)[number];

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Shared native select style
const selectCls = 'w-full rounded-lg border border-lumex-border bg-lumex-bg-deep px-3 py-2 text-sm text-lumex-text focus:border-lumex-blue focus:outline-none';

export const JournalForm: React.FC<JournalFormProps> = ({ mode, initialData, originalSlug, onSuccess }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('Basic Info');
    const [draft, setDraft] = useState<JournalDraft>({ ...EMPTY_DRAFT, ...initialData });
    const [errors, setErrors] = useState<Partial<Record<keyof JournalDraft, string>>>({});
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === 'edit');
    const [coverPreview, setCoverPreview] = useState<string>(initialData?.coverImageUrl ?? '');
    const [newEditor, setNewEditor] = useState<JournalEditor>({ name: '', role: '', affiliation: '', email: '' });
    const [tagInput, setTagInput] = useState<Record<string, string>>({ indexedIn: '', language: '', subdiscipline: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createJournal = useCreateJournal();
    const updateJournal = useUpdateJournal();
    const isPending = createJournal.isPending || updateJournal.isPending;

    const set = useCallback(<K extends keyof JournalDraft>(key: K, value: JournalDraft[K]) => {
        setDraft(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: undefined }));
    }, []);

    const handleTitleChange = (title: string) => {
        set('title', title);
        if (!slugManuallyEdited) set('slug', slugify(title));
    };

    const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setCoverPreview(url);
        set('coverImageUrl', url);
        set('coverImageFile', file);
    };

    const handleCoverUrlChange = (url: string) => {
        set('coverImageUrl', url);
        setCoverPreview(url);
    };

    const addTag = (field: 'indexedIn' | 'language' | 'subdiscipline') => {
        const val = tagInput[field]?.trim();
        if (!val) return;
        const current = (draft[field] ?? []) as string[];
        if (!current.includes(val)) set(field, [...current, val] as JournalDraft[typeof field]);
        setTagInput(prev => ({ ...prev, [field]: '' }));
    };

    const removeTag = (field: 'indexedIn' | 'language' | 'subdiscipline', val: string) => {
        const current = (draft[field] ?? []) as string[];
        set(field, current.filter(v => v !== val) as JournalDraft[typeof field]);
    };

    const toggleDiscipline = (label: string) => {
        const current = draft.discipline;
        set('discipline', current.includes(label) ? current.filter(d => d !== label) : [...current, label]);
    };

    const addEditor = () => {
        if (!newEditor.name.trim()) return;
        set('editors', [...(draft.editors ?? []), { ...newEditor }]);
        setNewEditor({ name: '', role: '', affiliation: '', email: '' });
    };

    const removeEditor = (i: number) => {
        set('editors', (draft.editors ?? []).filter((_, idx) => idx !== i));
    };

    const validate = (): boolean => {
        const errs: Partial<Record<keyof JournalDraft, string>> = {};
        if (!draft.title.trim()) errs.title = 'Title is required';
        if (!draft.slug.trim()) errs.slug = 'Slug is required';
        if (!draft.electronicISSN.trim()) errs.electronicISSN = 'Electronic ISSN is required';
        if (!draft.publisher.trim()) errs.publisher = 'Publisher is required';
        if (draft.discipline.length === 0) errs.discipline = 'Select at least one discipline';
        if (!draft.description.trim()) errs.description = 'Description is required';
        setErrors(errs);
        if (Object.keys(errs).length > 0) {
            if (errs.title || errs.description) setActiveTab('Basic Info');
            else if (errs.electronicISSN || errs.publisher) setActiveTab('Identifiers');
            else if (errs.discipline) setActiveTab('Classification');
        }
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            if (mode === 'create') {
                const journal = await createJournal.mutateAsync(draft);
                onSuccess?.(journal.slug);
                void navigate('/editor/journals');
            } else {
                await updateJournal.mutateAsync({ slug: originalSlug ?? draft.slug, draft });
                onSuccess?.(draft.slug);
                void navigate('/editor/journals');
            }
        } catch {
            // handled by mutation
        }
    };

    const TabBtn: React.FC<{ tab: Tab }> = ({ tab }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-lg transition-colors ${
                activeTab === tab
                    ? 'bg-lumex-blue text-white'
                    : 'text-lumex-muted hover:text-lumex-text hover:bg-lumex-bg-deep'
            }`}
        >
            {tab}
        </button>
    );

    const FieldGroup: React.FC<{ label: string; error?: string; required?: boolean; children: React.ReactNode }> = ({
        label, error, required, children
    }) => (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-lumex-text flex gap-1">
                {label}
                {required && <span className="text-red-400">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );

    const TagChip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
        <span className="flex items-center gap-1 text-xs bg-lumex-bg-deep border border-lumex-border text-lumex-muted rounded-full px-2.5 py-0.5">
            {label}
            <button onClick={onRemove} className="ml-1 text-lumex-muted hover:text-red-400">×</button>
        </span>
    );

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-lumex-text">
                        {mode === 'create' ? 'Create New Journal' : `Edit: ${draft.title || 'Journal'}`}
                    </h1>
                    <p className="text-lumex-muted text-sm mt-1">
                        {mode === 'create' ? 'Fill in the sections below to publish a new journal.' : 'Update journal details.'}
                    </p>
                </div>
                <Button variant="outline" onClick={() => void navigate('/editor/journals')}>← Back</Button>
            </div>

            {/* Tab Nav */}
            <div className="flex flex-wrap gap-1.5 bg-lumex-card border border-lumex-border rounded-xl p-2 mb-8">
                {TABS.map(tab => <TabBtn key={tab} tab={tab} />)}
            </div>

            {/* Tab Content */}
            <div className="bg-lumex-card border border-lumex-border rounded-xl p-8 shadow-sm">

                {/* ── Basic Info ─────────────────────────────── */}
                {activeTab === 'Basic Info' && (
                    <div className="space-y-6">
                        <FieldGroup label="Journal Title" required error={errors.title}>
                            <Input placeholder="e.g. Nature Machine Intelligence" value={draft.title} onChange={e => handleTitleChange(e.target.value)} />
                        </FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <FieldGroup label="Abbreviation">
                                <Input placeholder="e.g. Nat. Mach. Intell." value={draft.abbreviation ?? ''} onChange={e => set('abbreviation', e.target.value)} />
                            </FieldGroup>
                            <FieldGroup label="URL Slug" required error={errors.slug}>
                                <div className="flex items-center gap-1">
                                    <span className="text-lumex-muted text-sm">/journal/</span>
                                    <Input
                                        placeholder="nature-machine-intelligence"
                                        value={draft.slug}
                                        onChange={e => { setSlugManuallyEdited(true); set('slug', e.target.value); }}
                                    />
                                </div>
                            </FieldGroup>
                        </div>
                        <FieldGroup label="Short Description" required error={errors.description}>
                            <textarea
                                rows={3}
                                placeholder="A concise one-paragraph description of the journal's scope…"
                                value={draft.description}
                                onChange={e => set('description', e.target.value)}
                                className="w-full rounded-lg border border-lumex-border bg-lumex-bg-deep px-3 py-2 text-sm text-lumex-text placeholder:text-lumex-muted focus:border-lumex-blue focus:outline-none resize-none"
                            />
                        </FieldGroup>
                        <FieldGroup label="Status">
                            <select
                                value={draft.status ?? 'active'}
                                onChange={e => set('status', e.target.value as JournalStatus)}
                                className={selectCls}
                            >
                                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FieldGroup>
                    </div>
                )}

                {/* ── Identifiers ───────────────────────────── */}
                {activeTab === 'Identifiers' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FieldGroup label="Electronic ISSN" required error={errors.electronicISSN}>
                                <Input placeholder="e.g. 2522-5839" value={draft.electronicISSN} onChange={e => set('electronicISSN', e.target.value)} />
                            </FieldGroup>
                            <FieldGroup label="Print ISSN">
                                <Input placeholder="e.g. 2522-5820" value={draft.printISSN ?? ''} onChange={e => set('printISSN', e.target.value)} />
                            </FieldGroup>
                        </div>
                        <FieldGroup label="Publisher" required error={errors.publisher}>
                            <Input placeholder="e.g. Lumex Publishing" value={draft.publisher} onChange={e => set('publisher', e.target.value)} />
                        </FieldGroup>
                    </div>
                )}

                {/* ── Access & Pricing ──────────────────────── */}
                {activeTab === 'Access & Pricing' && (
                    <div className="space-y-6">
                        <FieldGroup label="Access Type">
                            <div className="grid grid-cols-2 gap-3">
                                {ACCESS_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => set('accessType', opt.value)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                                            draft.accessType === opt.value
                                                ? 'border-lumex-blue bg-lumex-blue/10 text-lumex-blue'
                                                : 'border-lumex-border text-lumex-muted hover:border-lumex-blue/40'
                                        }`}
                                    >
                                        <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${draft.accessType === opt.value ? 'border-lumex-blue bg-lumex-blue' : 'border-lumex-muted'}`} />
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </FieldGroup>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="openAccess" checked={!!draft.openAccess} onChange={e => set('openAccess', e.target.checked)} className="w-4 h-4 accent-lumex-blue" />
                            <label htmlFor="openAccess" className="text-sm font-semibold text-lumex-text">Fully Open Access</label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FieldGroup label="Article Processing Charge (APC)">
                                <Input type="number" placeholder="e.g. 3490" value={draft.articleProcessingCharge?.toString() ?? ''} onChange={e => set('articleProcessingCharge', e.target.value ? Number(e.target.value) : undefined)} />
                            </FieldGroup>
                            <FieldGroup label="Currency">
                                <select value={draft.apaCurrency ?? 'USD'} onChange={e => set('apaCurrency', e.target.value)} className={selectCls}>
                                    {CURRENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </FieldGroup>
                        </div>
                    </div>
                )}

                {/* ── Classification ────────────────────────── */}
                {activeTab === 'Classification' && (
                    <div className="space-y-6">
                        <FieldGroup label="Disciplines" required error={errors.discipline}>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                {DISCIPLINES.map(d => (
                                    <button
                                        key={d.slug}
                                        onClick={() => toggleDiscipline(d.label)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                                            draft.discipline.includes(d.label)
                                                ? 'bg-lumex-blue text-white border-lumex-blue'
                                                : 'border-lumex-border text-lumex-muted hover:border-lumex-blue/40'
                                        }`}
                                    >
                                        {d.icon} {d.label}
                                    </button>
                                ))}
                            </div>
                        </FieldGroup>
                        <FieldGroup label="Sub-disciplines">
                            <div className="flex gap-2">
                                <Input placeholder="Add sub-discipline…" value={tagInput.subdiscipline ?? ''} onChange={e => setTagInput(prev => ({ ...prev, subdiscipline: e.target.value }))} onKeyDown={e => { if (e.key === 'Enter') addTag('subdiscipline'); }} />
                                <Button variant="outline" size="sm" onClick={() => addTag('subdiscipline')}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {(draft.subdiscipline ?? []).map(s => <TagChip key={s} label={s} onRemove={() => removeTag('subdiscipline', s)} />)}
                            </div>
                        </FieldGroup>
                        <FieldGroup label="Languages">
                            <div className="flex gap-2">
                                <select value={tagInput.language ?? ''} onChange={e => setTagInput(prev => ({ ...prev, language: e.target.value }))} className={selectCls}>
                                    <option value="">Select language…</option>
                                    {LANGUAGE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                                <Button variant="outline" size="sm" onClick={() => addTag('language')}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {draft.language.map(l => <TagChip key={l} label={l} onRemove={() => removeTag('language', l)} />)}
                            </div>
                        </FieldGroup>
                    </div>
                )}

                {/* ── Details ───────────────────────────────── */}
                {activeTab === 'Details' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FieldGroup label="Founded Year">
                                <Input type="number" placeholder="e.g. 2019" value={draft.foundedYear?.toString() ?? ''} onChange={e => set('foundedYear', e.target.value ? Number(e.target.value) : undefined)} />
                            </FieldGroup>
                            <FieldGroup label="Publication Frequency">
                                <select value={draft.frequency ?? ''} onChange={e => set('frequency', e.target.value)} className={selectCls}>
                                    <option value="">Select…</option>
                                    {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </FieldGroup>
                        </div>
                        <FieldGroup label="Indexed In">
                            <div className="flex gap-2">
                                <select value={tagInput.indexedIn ?? ''} onChange={e => setTagInput(prev => ({ ...prev, indexedIn: e.target.value }))} className={selectCls}>
                                    <option value="">Select database…</option>
                                    {INDEX_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                                <Button variant="outline" size="sm" onClick={() => addTag('indexedIn')}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {(draft.indexedIn ?? []).map(idx => <TagChip key={idx} label={idx} onRemove={() => removeTag('indexedIn', idx)} />)}
                            </div>
                        </FieldGroup>
                    </div>
                )}

                {/* ── Branding ──────────────────────────────── */}
                {activeTab === 'Branding' && (
                    <div className="space-y-6">
                        <FieldGroup label="Cover Image">
                            <div className="flex gap-4 items-start">
                                <div className="flex-shrink-0">
                                    {coverPreview ? (
                                        <img src={coverPreview} alt="Cover preview" className="w-20 h-28 object-cover rounded-lg border border-lumex-border shadow-sm" />
                                    ) : (
                                        <div className="w-20 h-28 rounded-lg border-2 border-dashed border-lumex-border bg-lumex-bg-deep flex items-center justify-center">
                                            <span className="text-lumex-muted text-xs text-center">No cover</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <p className="text-xs text-lumex-muted mb-2">Upload from file</p>
                                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-lg border border-lumex-border text-sm text-lumex-text hover:border-lumex-blue transition-colors">
                                            📁 Choose File
                                        </button>
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-lumex-muted mb-2">Or paste a URL</p>
                                        <Input placeholder="https://example.com/cover.jpg" value={draft.coverImageUrl ?? ''} onChange={e => handleCoverUrlChange(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </FieldGroup>
                        <FieldGroup label="Logo URL">
                            <Input placeholder="https://example.com/logo.png" value={draft.logoUrl ?? ''} onChange={e => set('logoUrl', e.target.value)} />
                        </FieldGroup>
                    </div>
                )}

                {/* ── Editorial ─────────────────────────────── */}
                {activeTab === 'Editorial' && (
                    <div className="space-y-6">
                        <FieldGroup label="Aims & Scope">
                            <textarea
                                rows={6}
                                placeholder="Describe the journal's aims, scope, and types of research it publishes…"
                                value={draft.aimsAndScope}
                                onChange={e => set('aimsAndScope', e.target.value)}
                                className="w-full rounded-lg border border-lumex-border bg-lumex-bg-deep px-3 py-2 text-sm text-lumex-text placeholder:text-lumex-muted focus:border-lumex-blue focus:outline-none resize-y"
                            />
                        </FieldGroup>
                        <FieldGroup label="Editors">
                            <div className="space-y-3 mb-3">
                                {(draft.editors ?? []).map((ed, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-lumex-bg-deep rounded-lg px-3 py-2 border border-lumex-border">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-lumex-text">{ed.name}</p>
                                            <p className="text-xs text-lumex-muted">{[ed.role, ed.affiliation].filter(Boolean).join(' · ')}</p>
                                        </div>
                                        <button onClick={() => removeEditor(i)} className="text-lumex-muted hover:text-red-400 flex-shrink-0">×</button>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Name *" value={newEditor.name} onChange={e => setNewEditor(prev => ({ ...prev, name: e.target.value }))} />
                                <Input placeholder="Role (e.g. Editor-in-Chief)" value={newEditor.role ?? ''} onChange={e => setNewEditor(prev => ({ ...prev, role: e.target.value }))} />
                                <Input placeholder="Affiliation" value={newEditor.affiliation ?? ''} onChange={e => setNewEditor(prev => ({ ...prev, affiliation: e.target.value }))} />
                                <Input placeholder="Email" type="email" value={newEditor.email ?? ''} onChange={e => setNewEditor(prev => ({ ...prev, email: e.target.value }))} />
                            </div>
                            <Button variant="outline" size="sm" className="mt-2" onClick={addEditor} disabled={!newEditor.name.trim()}>
                                + Add Editor
                            </Button>
                        </FieldGroup>
                    </div>
                )}
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between mt-6 py-4 border-t border-lumex-border">
                <div className="flex gap-2">
                    {TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`w-2 h-2 rounded-full transition-colors ${activeTab === t ? 'bg-lumex-blue' : 'bg-lumex-border'}`}
                            title={t}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    {activeTab !== TABS[0] && (
                        <Button variant="outline" onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) - 1])}>← Previous</Button>
                    )}
                    {activeTab !== TABS[TABS.length - 1] ? (
                        <Button variant="primary" onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab) + 1])}>Next →</Button>
                    ) : (
                        <Button variant="primary" onClick={() => void handleSubmit()} disabled={isPending}>
                            {isPending ? 'Saving…' : mode === 'create' ? 'Create Journal' : 'Save Changes'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
