import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@shared/ui';
import { fetchClient } from '../../../shared/api/base';

interface SiteConfigEntry {
    key: string;
    value: string;
}

interface HomepageSection {
    section: string;
    content: unknown;
}

// Well-known site config keys with labels
const SITE_FIELDS = [
    { key: 'siteName', label: 'Site Name', type: 'text' },
    { key: 'siteDescription', label: 'Site Description', type: 'textarea' },
    { key: 'footerText', label: 'Footer Text', type: 'text' },
    { key: 'contactEmail', label: 'Contact Email', type: 'text' },
    { key: 'socialTwitter', label: 'Twitter / X URL', type: 'text' },
    { key: 'socialLinkedin', label: 'LinkedIn URL', type: 'text' },
    { key: 'socialGithub', label: 'GitHub URL', type: 'text' },
    { key: 'socialFacebook', label: 'Facebook URL', type: 'text' },
] as const;

export const SiteSettings: React.FC = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'form' | 'config' | 'homepage'>('form');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    // Site config
    const { data: configData, isLoading: configLoading } = useQuery({
        queryKey: ['admin', 'site-config'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Record<string, string> | SiteConfigEntry[] }>('/site-config');
                const d = res.data;
                if (Array.isArray(d)) return d;
                return Object.entries(d).map(([key, value]) => ({ key, value: typeof value === 'string' ? value : JSON.stringify(value) }));
            } catch {
                return [] as SiteConfigEntry[];
            }
        },
    });

    // Homepage sections
    const { data: homepageData, isLoading: homepageLoading } = useQuery({
        queryKey: ['admin', 'homepage'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Record<string, unknown> | HomepageSection[] }>('/homepage');
                const d = res.data;
                if (Array.isArray(d)) return d;
                return Object.entries(d).map(([section, content]) => ({ section, content }));
            } catch {
                return [] as HomepageSection[];
            }
        },
    });

    const updateConfigMutation = useMutation({
        mutationFn: async ({ key, value }: { key: string; value: string }) => {
            await fetchClient(`/site-config/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin', 'site-config'] });
            setEditingKey(null);
            setNewKey('');
            setNewValue('');
        },
    });

    const updateSectionMutation = useMutation({
        mutationFn: async ({ section, content }: { section: string; content: string }) => {
            let parsed: unknown;
            try { parsed = JSON.parse(content); } catch { parsed = content; }
            await fetchClient(`/homepage/sections/${section}`, { method: 'PUT', body: JSON.stringify({ content: parsed }) });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin', 'homepage'] });
            setEditingKey(null);
        },
    });

    const deleteSectionMutation = useMutation({
        mutationFn: async (section: string) => {
            await fetchClient(`/homepage/sections/${section}`, { method: 'DELETE' });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin', 'homepage'] });
        },
    });

    const configs = configData ?? [];
    const sections = homepageData ?? [];

    // Helpers for the structured form
    const getConfigValue = (key: string) => configs.find(c => c.key === key)?.value ?? '';

    const handleFormSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const promises: Promise<void>[] = [];
        for (const field of SITE_FIELDS) {
            const val = fd.get(field.key)?.toString() ?? '';
            if (val !== getConfigValue(field.key)) {
                promises.push(
                    fetchClient(`/site-config/${field.key}`, { method: 'PUT', body: JSON.stringify({ value: val }) })
                        .then(() => undefined)
                );
            }
        }
        if (promises.length === 0) return;
        Promise.all(promises).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['admin', 'site-config'] });
        });
    };

    // Reorder section — swap with neighbor by re-saving with updated order metadata
    const moveSectionOrder = async (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const swapIdx = direction === 'up' ? index - 1 : index + 1;
        if (swapIdx < 0 || swapIdx >= newSections.length) return;
        [newSections[index], newSections[swapIdx]] = [newSections[swapIdx], newSections[index]];
        // Re-save both sections with an order field
        for (let i = 0; i < newSections.length; i++) {
            const sec = newSections[i];
            const content = typeof sec.content === 'object' && sec.content !== null
                ? { ...(sec.content as Record<string, unknown>), _order: i }
                : { value: sec.content, _order: i };
            await fetchClient(`/homepage/sections/${sec.section}`, {
                method: 'PUT',
                body: JSON.stringify({ content }),
            });
        }
        void queryClient.invalidateQueries({ queryKey: ['admin', 'homepage'] });
    };

    return (
        <div>
            <h1 className="text-2xl font-serif font-bold text-lumex-text mb-1">Site Settings</h1>
            <p className="text-sm text-lumex-muted mb-6">Manage site configuration and homepage sections</p>

            <div className="flex gap-1 border-b border-lumex-border mb-6">
                {[
                    { key: 'form' as const, label: 'Site Settings' },
                    { key: 'config' as const, label: 'All Config' },
                    { key: 'homepage' as const, label: 'Homepage Sections' },
                ].map(t => (
                    <button
                        key={t.key}
                        onClick={() => { setActiveTab(t.key); setEditingKey(null); }}
                        className={`px-4 pb-2 text-sm font-bold relative ${activeTab === t.key ? 'text-lumex-blue' : 'text-lumex-sub'}`}
                    >
                        {t.label}
                        {activeTab === t.key && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-lumex-blue" />}
                    </button>
                ))}
            </div>

            {/* Structured site settings form */}
            {activeTab === 'form' && (
                configLoading ? (
                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" /></div>
                ) : (
                    <form onSubmit={handleFormSave} className="bg-lumex-card border border-lumex-border rounded-lg p-6 shadow-sm space-y-5">
                        <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider pb-2 border-b border-lumex-border">General</h3>
                        {SITE_FIELDS.slice(0, 4).map(field => (
                            <div key={field.key}>
                                <label className="block text-sm font-bold text-lumex-text mb-1">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        name={field.key}
                                        defaultValue={getConfigValue(field.key)}
                                        className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue min-h-[80px]"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={field.key}
                                        defaultValue={getConfigValue(field.key)}
                                        className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue"
                                    />
                                )}
                            </div>
                        ))}

                        <h3 className="text-sm font-bold text-lumex-text uppercase tracking-wider pb-2 border-b border-lumex-border pt-4">Social Links</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {SITE_FIELDS.slice(4).map(field => (
                                <div key={field.key}>
                                    <label className="block text-sm font-bold text-lumex-text mb-1">{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.key}
                                        defaultValue={getConfigValue(field.key)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-lumex-border">
                            <Button type="submit" variant="primary" disabled={updateConfigMutation.isPending}>
                                {updateConfigMutation.isPending ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </form>
                )
            )}

            {/* Raw key-value config editor */}
            {activeTab === 'config' && (
                <>
                    {configLoading ? (
                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" /></div>
                    ) : (
                        <div className="space-y-3">
                            {configs.map(entry => (
                                <div key={entry.key} className="bg-lumex-card border border-lumex-border rounded-lg px-5 py-4">
                                    {editingKey === entry.key ? (
                                        <div>
                                            <p className="text-xs font-bold text-lumex-muted uppercase mb-2">{entry.key}</p>
                                            <textarea
                                                value={editValue}
                                                onChange={e => setEditValue(e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue min-h-[80px] font-mono"
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <Button size="sm" variant="outline" onClick={() => setEditingKey(null)}>Cancel</Button>
                                                <Button size="sm" variant="primary"
                                                    disabled={updateConfigMutation.isPending}
                                                    onClick={() => updateConfigMutation.mutate({ key: entry.key, value: editValue })}
                                                >
                                                    {updateConfigMutation.isPending ? 'Saving...' : 'Save'}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-lumex-muted uppercase mb-1">{entry.key}</p>
                                                <p className="text-sm text-lumex-text font-mono break-all">{entry.value.length > 200 ? entry.value.slice(0, 200) + '...' : entry.value}</p>
                                            </div>
                                            <Button size="sm" variant="outline" className="ml-4 shrink-0"
                                                onClick={() => { setEditingKey(entry.key); setEditValue(entry.value); }}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {configs.length === 0 && (
                                <div className="text-center py-8 text-sm text-lumex-muted">No configuration entries found</div>
                            )}

                            {/* Add new config */}
                            <div className="bg-lumex-bg-deep border border-dashed border-lumex-border rounded-lg p-5 mt-4">
                                <p className="text-xs font-bold text-lumex-muted uppercase mb-3">Add New Config</p>
                                <div className="flex gap-3">
                                    <input
                                        placeholder="Key"
                                        value={newKey}
                                        onChange={e => setNewKey(e.target.value)}
                                        className="px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue flex-1"
                                    />
                                    <input
                                        placeholder="Value"
                                        value={newValue}
                                        onChange={e => setNewValue(e.target.value)}
                                        className="px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue flex-[2]"
                                    />
                                    <Button size="sm" variant="primary"
                                        disabled={!newKey || !newValue || updateConfigMutation.isPending}
                                        onClick={() => updateConfigMutation.mutate({ key: newKey, value: newValue })}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Homepage sections with reorder */}
            {activeTab === 'homepage' && (
                <>
                    {homepageLoading ? (
                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" /></div>
                    ) : (
                        <div className="space-y-3">
                            {sections.map((sec, idx) => (
                                <div key={sec.section} className="bg-lumex-card border border-lumex-border rounded-lg px-5 py-4">
                                    {editingKey === sec.section ? (
                                        <div>
                                            <p className="text-xs font-bold text-lumex-muted uppercase mb-2">{sec.section}</p>
                                            <textarea
                                                defaultValue={JSON.stringify(sec.content, null, 2)}
                                                id={`section-${sec.section}`}
                                                className="w-full px-3 py-2 text-sm border border-lumex-border rounded-lg outline-none focus:border-lumex-blue min-h-[150px] font-mono"
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <Button size="sm" variant="outline" onClick={() => setEditingKey(null)}>Cancel</Button>
                                                <Button size="sm" variant="primary"
                                                    disabled={updateSectionMutation.isPending}
                                                    onClick={() => {
                                                        const el = document.getElementById(`section-${sec.section}`) as HTMLTextAreaElement;
                                                        updateSectionMutation.mutate({ section: sec.section, content: el.value });
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                {/* Reorder buttons */}
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        disabled={idx === 0}
                                                        onClick={() => void moveSectionOrder(idx, 'up')}
                                                        className="text-lumex-muted hover:text-lumex-blue disabled:opacity-30 text-xs leading-none"
                                                        title="Move up"
                                                    >
                                                        &#9650;
                                                    </button>
                                                    <button
                                                        disabled={idx === sections.length - 1}
                                                        onClick={() => void moveSectionOrder(idx, 'down')}
                                                        className="text-lumex-muted hover:text-lumex-blue disabled:opacity-30 text-xs leading-none"
                                                        title="Move down"
                                                    >
                                                        &#9660;
                                                    </button>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-lumex-muted uppercase mb-1">{sec.section}</p>
                                                    <p className="text-xs text-lumex-sub font-mono truncate">
                                                        {JSON.stringify(sec.content).slice(0, 100)}...
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4 shrink-0">
                                                <Button size="sm" variant="outline" onClick={() => setEditingKey(sec.section)}>Edit</Button>
                                                <Button size="sm" variant="outline"
                                                    className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                                                    onClick={() => deleteSectionMutation.mutate(sec.section)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {sections.length === 0 && (
                                <div className="text-center py-8 text-sm text-lumex-muted">No homepage sections found</div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
