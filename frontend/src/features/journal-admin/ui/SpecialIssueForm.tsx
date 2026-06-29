import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@shared/ui';
import { useCreateSpecialIssue, useUpdateSpecialIssue } from '../../../entities/journal/api/journalAdminQueries';
import type { SpecialIssue, SpecialIssueStatus, SpecialIssueGuestEditor } from '../../../entities/journal/model/types';

interface SpecialIssueFormProps {
    mode: 'create' | 'edit';
    journalSlug: string;
    journalTitle: string;
    initialData?: Partial<SpecialIssue>;
    onSuccess?: () => void;
}

type Draft = Omit<SpecialIssue, 'id' | 'createdAt' | 'updatedAt'>;

const EMPTY: Draft = {
    journalSlug: '',
    title: '',
    description: '',
    guestEditors: [],
    status: 'call-for-papers',
    callForPapersDeadline: '',
    expectedPublicationDate: '',
    publishedDate: '',
    volume: undefined,
    issueNumber: '',
    coverImageUrl: '',
    topics: [],
    articleCount: 0,
    articles: [],
};

const STATUS_OPTIONS: { value: SpecialIssueStatus; label: string }[] = [
    { value: 'call-for-papers', label: 'Call for Papers' },
    { value: 'submissions-closed', label: 'Submissions Closed' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'published', label: 'Published' },
];

export const SpecialIssueForm: React.FC<SpecialIssueFormProps> = ({
    mode, journalSlug, journalTitle, initialData, onSuccess,
}) => {
    const navigate = useNavigate();
    const [draft, setDraft] = useState<Draft>({
        ...EMPTY,
        journalSlug,
        ...initialData,
    });
    const [topicInput, setTopicInput] = useState('');
    const [newEditor, setNewEditor] = useState<SpecialIssueGuestEditor>({ name: '', affiliation: '', email: '' });
    const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
    const [coverPreview, setCoverPreview] = useState(initialData?.coverImageUrl ?? '');
    const fileRef = useRef<HTMLInputElement>(null);

    const createSI = useCreateSpecialIssue();
    const updateSI = useUpdateSpecialIssue();
    const isPending = createSI.isPending || updateSI.isPending;

    const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
        setDraft(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: undefined }));
    };

    const addTopic = () => {
        const val = topicInput.trim();
        if (!val || draft.topics.includes(val)) return;
        set('topics', [...draft.topics, val]);
        setTopicInput('');
    };

    const removeTopic = (t: string) => set('topics', draft.topics.filter(x => x !== t));

    const addEditor = () => {
        if (!newEditor.name.trim() || !newEditor.affiliation.trim()) return;
        set('guestEditors', [...draft.guestEditors, { ...newEditor }]);
        setNewEditor({ name: '', affiliation: '', email: '' });
    };

    const removeEditor = (i: number) =>
        set('guestEditors', draft.guestEditors.filter((_, idx) => idx !== i));

    const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setCoverPreview(url);
        set('coverImageUrl', url);
    };

    const validate = () => {
        const errs: Partial<Record<keyof Draft, string>> = {};
        if (!draft.title.trim()) errs.title = 'Title is required';
        if (!draft.description.trim()) errs.description = 'Description is required';
        if (draft.guestEditors.length === 0) errs.guestEditors = 'Add at least one guest editor';
        if (draft.topics.length === 0) errs.topics = 'Add at least one topic';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        if (mode === 'create') {
            await createSI.mutateAsync(draft);
        } else if (initialData?.id) {
            await updateSI.mutateAsync({ journalSlug, issueId: initialData.id, updates: draft });
        }
        onSuccess?.();
        void navigate(`/editor/journals/${journalSlug}/special-issues`);
    };

    const FieldGroup: React.FC<{ label: string; error?: string; required?: boolean; children: React.ReactNode }> = ({
        label, error, required, children
    }) => (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-lumex-text flex gap-1">
                {label}{required && <span className="text-red-400">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-xs text-lumex-muted mb-1">{journalTitle}</p>
                    <h1 className="text-2xl font-serif font-bold text-lumex-text">
                        {mode === 'create' ? 'Create Special Issue' : 'Edit Special Issue'}
                    </h1>
                </div>
                <Button variant="outline" onClick={() => void navigate(`/editor/journals/${journalSlug}/special-issues`)}>
                    ← Back
                </Button>
            </div>

            <div className="bg-lumex-card border border-lumex-border rounded-xl p-8 shadow-sm space-y-8">
                {/* Basic */}
                <section>
                    <h2 className="text-sm font-bold text-lumex-muted uppercase tracking-wider mb-4">Basic Information</h2>
                    <div className="space-y-5">
                        <FieldGroup label="Special Issue Title" required error={errors.title}>
                            <Input
                                placeholder="e.g. AI in Precision Medicine"
                                value={draft.title}
                                onChange={e => set('title', e.target.value)}
                            />
                        </FieldGroup>
                        <FieldGroup label="Description" required error={errors.description}>
                            <textarea
                                rows={5}
                                placeholder="Describe the scope and aims of this special issue…"
                                value={draft.description}
                                onChange={e => set('description', e.target.value)}
                                className="w-full rounded-lg border border-lumex-border bg-lumex-bg-deep px-3 py-2 text-sm text-lumex-text placeholder:text-lumex-muted focus:border-lumex-blue focus:outline-none resize-y"
                            />
                        </FieldGroup>
                        <FieldGroup label="Status">
                            <select
                                value={draft.status}
                                onChange={e => set('status', e.target.value as SpecialIssueStatus)}
                                className="w-full rounded-lg border border-lumex-border bg-lumex-bg-deep px-3 py-2 text-sm text-lumex-text focus:border-lumex-blue focus:outline-none"
                            >
                                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FieldGroup>
                    </div>
                </section>

                {/* Guest Editors */}
                <section>
                    <h2 className="text-sm font-bold text-lumex-muted uppercase tracking-wider mb-4">
                        Guest Editors
                        {errors.guestEditors && <span className="text-red-400 ml-2 normal-case text-xs font-normal">{errors.guestEditors}</span>}
                    </h2>
                    <div className="space-y-2 mb-4">
                        {draft.guestEditors.map((ge, i) => (
                            <div key={i} className="flex items-center gap-2 bg-lumex-bg-deep rounded-lg px-3 py-2 border border-lumex-border">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-lumex-text">{ge.name}</p>
                                    <p className="text-xs text-lumex-muted">{ge.affiliation}{ge.email ? ` · ${ge.email}` : ''}</p>
                                </div>
                                <button onClick={() => removeEditor(i)} className="text-lumex-muted hover:text-red-400">×</button>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Name *" value={newEditor.name} onChange={e => setNewEditor(p => ({ ...p, name: e.target.value }))} />
                        <Input placeholder="Affiliation *" value={newEditor.affiliation} onChange={e => setNewEditor(p => ({ ...p, affiliation: e.target.value }))} />
                        <Input placeholder="Email" type="email" value={newEditor.email ?? ''} onChange={e => setNewEditor(p => ({ ...p, email: e.target.value }))} />
                        <Button variant="outline" onClick={addEditor} disabled={!newEditor.name.trim() || !newEditor.affiliation.trim()}>
                            + Add Editor
                        </Button>
                    </div>
                </section>

                {/* Topics */}
                <section>
                    <h2 className="text-sm font-bold text-lumex-muted uppercase tracking-wider mb-4">
                        Topics
                        {errors.topics && <span className="text-red-400 ml-2 normal-case text-xs font-normal">{errors.topics}</span>}
                    </h2>
                    <div className="flex gap-2 mb-3">
                        <Input
                            placeholder="e.g. Machine Learning, Drug Discovery…"
                            value={topicInput}
                            onChange={e => setTopicInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addTopic(); }}
                        />
                        <Button variant="outline" onClick={addTopic}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {draft.topics.map(t => (
                            <span key={t} className="flex items-center gap-1 text-xs bg-lumex-bg-deep border border-lumex-border text-lumex-muted rounded-full px-2.5 py-0.5">
                                {t}
                                <button onClick={() => removeTopic(t)} className="hover:text-red-400">×</button>
                            </span>
                        ))}
                    </div>
                </section>

                {/* Dates & Volume */}
                <section>
                    <h2 className="text-sm font-bold text-lumex-muted uppercase tracking-wider mb-4">Dates & Publication</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <FieldGroup label="CFP Deadline">
                            <Input type="date" value={draft.callForPapersDeadline ?? ''} onChange={e => set('callForPapersDeadline', e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Expected Publication">
                            <Input type="date" value={draft.expectedPublicationDate ?? ''} onChange={e => set('expectedPublicationDate', e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Volume">
                            <Input type="number" placeholder="e.g. 8" value={draft.volume?.toString() ?? ''} onChange={e => set('volume', e.target.value ? Number(e.target.value) : undefined)} />
                        </FieldGroup>
                        <FieldGroup label="Issue Number">
                            <Input placeholder="e.g. S1" value={draft.issueNumber ?? ''} onChange={e => set('issueNumber', e.target.value)} />
                        </FieldGroup>
                    </div>
                </section>

                {/* Cover Image */}
                <section>
                    <h2 className="text-sm font-bold text-lumex-muted uppercase tracking-wider mb-4">Cover Image</h2>
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                            {coverPreview ? (
                                <img src={coverPreview} alt="Cover preview" className="w-24 h-16 object-cover rounded-lg border border-lumex-border" />
                            ) : (
                                <div className="w-24 h-16 rounded-lg border-2 border-dashed border-lumex-border flex items-center justify-center bg-lumex-bg-deep">
                                    <span className="text-lumex-muted text-xs">No cover</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="px-4 py-2 rounded-lg border border-lumex-border text-sm text-lumex-text hover:border-lumex-blue transition-colors"
                            >
                                📁 Upload File
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFile} />
                            <Input
                                placeholder="Or paste image URL…"
                                value={draft.coverImageUrl ?? ''}
                                onChange={e => { set('coverImageUrl', e.target.value); setCoverPreview(e.target.value); }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => void navigate(`/editor/journals/${journalSlug}/special-issues`)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => void handleSubmit()} disabled={isPending}>
                    {isPending ? 'Saving…' : mode === 'create' ? 'Create Special Issue' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};
