import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle } from '../../../entities/article/api/articleQueries';
import { Button, Stack, Skeleton } from '../../../shared/ui';
// inline SVG icons — no react-icons dependency
const IconTimes = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const IconDownload = () => <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconShare = () => <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const IconList = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const IconImages = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg>;
const IconQuote = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const IconMinus = () => <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>;
const IconPlus = () => <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
import { Helmet } from 'react-helmet-async';

export const ArticleReadingPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { data: article, isLoading } = useArticle(slug || '');
    const [sidebarTab, setSidebarTab] = useState<'outline' | 'figures' | 'refs'>('outline');
    const [zoom, setZoom] = useState(100);

    if (isLoading || !article) {
        return (
            <div className="min-h-screen bg-lumex-bg-deep flex flex-col">
                <header className="h-14 bg-lumex-bg-white border-b border-lumex-border flex items-center px-6">
                    <Skeleton className="w-48 h-6" />
                </header>
                <div className="flex-1 flex overflow-hidden">
                    <aside className="w-80 bg-lumex-bg-white border-r border-lumex-border pt-8 px-6">
                        <Skeleton className="w-full h-8 mb-4" />
                        <Skeleton className="w-3/4 h-4 mb-2" />
                        <Skeleton className="w-full h-4 mb-2" />
                        <Skeleton className="w-1/2 h-4" />
                    </aside>
                    <main className="flex-1 bg-lumex-bg p-8 overflow-auto">
                        <Skeleton className="max-w-3xl mx-auto h-[1000px] w-full" />
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-lumex-bg-deep flex flex-col text-lumex-text transition-colors duration-200">
            <Helmet>
                <title>Reading: {article.title}</title>
            </Helmet>

            {/* Reading Header */}
            <header className="h-14 bg-lumex-bg-white border-b border-lumex-border flex items-center justify-between px-4 sm:px-6 shadow-sm z-30">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={() => void navigate(`/article/${encodeURIComponent(slug || '')}`)}
                        className="rounded-full p-2 text-lumex-muted transition-colors hover:bg-lumex-bg-deep"
                        title="Close Reader"
                    >
                        <IconTimes />
                    </button>
                    <div className="truncate hidden sm:block">
                        <span className="text-[10px] uppercase tracking-tighter text-lumex-muted font-bold block leading-none mb-1">
                            Reading Mode
                        </span>
                        <h1 className="text-sm font-bold truncate max-w-md">
                            {article.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden md:flex items-center gap-1 bg-lumex-bg-deep rounded-lg px-2 py-1">
                        <button
                            onClick={() => setZoom(z => Math.max(50, z - 10))}
                            className="p-1.5 transition-colors hover:text-lumex-blue"
                        >
                            <IconMinus />
                        </button>
                        <span className="w-10 text-center font-mono text-xs">{zoom}%</span>
                        <button
                            onClick={() => setZoom(z => Math.min(200, z + 10))}
                            className="p-1.5 transition-colors hover:text-lumex-blue"
                        >
                            <IconPlus />
                        </button>
                    </div>

                    <Stack direction="row" gap="sm">
                        <Button variant="outline" size="sm" className="hidden items-center gap-2 sm:flex">
                            <IconDownload /> <span className="hidden lg:inline">PDF</span>
                        </Button>
                        <Button variant="primary" size="sm" className="items-center gap-2">
                            <IconShare /> <span className="hidden sm:inline">Cite</span>
                        </Button>
                    </Stack>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Interactive Sidebar */}
                <aside className="w-16 md:w-80 bg-lumex-bg-white border-r border-lumex-border flex flex-col z-20 transition-all duration-300">
                    <div className="hidden md:flex flex-col flex-1 overflow-hidden">
                        <div className="p-4 border-b border-lumex-border">
                            <h2 className="text-lg font-serif font-bold mb-4">Article Content</h2>
                            <nav className="flex gap-2">
                                <SidebarTab
                                    active={sidebarTab === 'outline'}
                                    onClick={() => setSidebarTab('outline')}
                                    icon={<IconList />}
                                    label="Outline"
                                />
                                <SidebarTab
                                    active={sidebarTab === 'figures'}
                                    onClick={() => setSidebarTab('figures')}
                                    icon={<IconImages />}
                                    label="Figures"
                                />
                                <SidebarTab
                                    active={sidebarTab === 'refs'}
                                    onClick={() => setSidebarTab('refs')}
                                    icon={<IconQuote />}
                                    label="Refs"
                                />
                            </nav>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {sidebarTab === 'outline' && (
                                <ul className="space-y-4">
                                    <li className="text-sm font-bold text-lumex-blue cursor-pointer">Abstract</li>
                                    <li className="text-sm hover:text-lumex-blue cursor-pointer pl-2">1. Introduction</li>
                                    <li className="text-sm hover:text-lumex-blue cursor-pointer pl-2">2. Methods & Materials</li>
                                    <li className="text-sm hover:text-lumex-blue cursor-pointer pl-4 text-lumex-muted italic">2.1 Data Collection</li>
                                    <li className="text-sm hover:text-lumex-blue cursor-pointer pl-2">3. Results</li>
                                    <li className="text-sm hover:text-lumex-blue cursor-pointer pl-2">4. Discussion & Conclusion</li>
                                    <li className="text-sm hover:text-lumex-blue cursor-pointer">References</li>
                                </ul>
                            )}
                            {sidebarTab === 'figures' && (
                                <div className="space-y-6">
                                    {[1, 2].map((num) => (
                                        <div key={`fig-${num}`} className="group cursor-pointer">
                                            <div className="mb-2 flex aspect-video items-center justify-center overflow-hidden rounded border border-lumex-border bg-lumex-bg-deep">
                                                <span className="text-lumex-sub opacity-50 transition-transform group-hover:scale-110"><IconImages /></span>
                                            </div>
                                            <p className="text-[10px] font-bold uppercase text-lumex-muted">Figure {num}</p>
                                            <p className="text-[11px] line-clamp-2 italic">Detailed visualization of the experimental setup and results.</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {sidebarTab === 'refs' && (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <div key={`ref-${num}`} className="text-[11px] leading-relaxed pb-3 border-b border-lumex-border last:border-0">
                                            <span className="font-bold mr-1">[{num}]</span>
                                            Smith, J. et al. (2023). Advanced methodologies in modern research.
                                            <span className="italic block mt-1 text-lumex-blue">Journal of Excellence, 45, 123-145.</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Compact sidebar for mobile/narrow */}
                    <div className="flex flex-col items-center gap-6 py-6 md:hidden">
                        <button
                            className={`rounded-lg p-2 ${sidebarTab === 'outline' ? 'bg-lumex-blue text-white' : 'text-lumex-muted'}`}
                            onClick={() => setSidebarTab('outline')}
                        >
                            <IconList />
                        </button>
                        <button
                            className={`rounded-lg p-2 ${sidebarTab === 'figures' ? 'bg-lumex-blue text-white' : 'text-lumex-muted'}`}
                            onClick={() => setSidebarTab('figures')}
                        >
                            <IconImages />
                        </button>
                        <button
                            className={`rounded-lg p-2 ${sidebarTab === 'refs' ? 'bg-lumex-blue text-white' : 'text-lumex-muted'}`}
                            onClick={() => setSidebarTab('refs')}
                        >
                            <IconQuote />
                        </button>
                    </div>
                </aside>

                {/* PDF Viewer Canvas */}
                <main className="flex-1 bg-lumex-bg h-full overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center">
                    <div
                        className="h-fit origin-top bg-white shadow-2xl transition-all duration-300"
                        style={{ width: `${600 * (zoom / 100)}px`, minWidth: '320px', padding: '10% 8%' }}
                    >
                        {/* Simulated Document Content */}
                        <div className="text-left text-black">
                            <p className="mb-8 border-b pb-2 text-[10px] font-bold uppercase text-gray-400">
                                Prism Publishing | DOI: {article.doi}
                            </p>

                            <h2 className="text-2xl font-serif font-bold mb-4 leading-tight">
                                {article.title}
                            </h2>

                            <div className="flex gap-4 mb-6">
                                {article.authors?.slice(0, 3).map(a => (
                                    <span key={a.id} className="text-[11px] font-bold border-b border-black">
                                        {a.firstName} {a.lastName}
                                    </span>
                                ))}
                            </div>

                            <div className="text-[13px] font-serif leading-relaxed space-y-4">
                                <h3 className="mt-8 border-b border-gray-200 pb-1 text-sm font-bold uppercase">Abstract</h3>
                                <div className="space-y-2 border-l-2 border-black bg-gray-50 p-4 italic">
                                    {article.abstract.map((section) => (
                                        <p key={section.text.substring(0, 20)}>{section.text}</p>
                                    ))}
                                </div>

                                <h3 className="mt-8 border-b border-gray-200 pb-1 text-sm font-bold uppercase">1. Introduction</h3>
                                <p>
                                    Scientific communication is evolving at an unprecedented pace. The digital transition has not only changed how researchers access information but also how they interact with it. In this paper, we explore the integration of interactive reading environments...
                                </p>
                                <p>
                                    Lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <div className="my-4 flex flex-col items-center justify-center border border-dashed border-gray-300 bg-gray-50 py-8 text-xs italic text-gray-400">
                                    <IconImages />
                                    <span className="mt-2">[Placeholder for Figure 1]</span>
                                </div>
                                <p>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>

                                <h3 className="mt-8 border-b border-gray-200 pb-1 text-sm font-bold uppercase">2. Methods</h3>
                                <p>
                                    Our experimental framework relies on a multi-stage data processing pipeline. First, we collected metadata from over 1 million open-access articles. Second, we applied...
                                </p>
                            </div>

                            <div className="mt-16 flex items-center justify-between border-t border-gray-100 pt-8 text-[10px] text-gray-400">
                                <span>© 2025 Prism Academic Publishing</span>
                                <span>Page 1 of 12</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const SidebarTab = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center py-2 px-1 rounded-lg border transition-all ${active
            ? 'bg-lumex-blue text-white border-lumex-blue shadow-sm'
            : 'bg-lumex-bg-deep text-lumex-muted border-lumex-border hover:border-lumex-blue-dark'
            }`}
    >
        <span className="text-sm mb-1">{icon}</span>
        <span className="text-[9px] font-bold uppercase tracking-tight">{label}</span>
    </button>
);
