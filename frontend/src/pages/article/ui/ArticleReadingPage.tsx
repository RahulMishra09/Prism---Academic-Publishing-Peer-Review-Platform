import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticle } from '../../../entities/article/api/articleQueries';
import { Button, Stack, Skeleton } from '../../../shared/ui';
import { FaTimes, FaDownload, FaShareAlt, FaList, FaImages, FaQuoteRight, FaMinus, FaPlus } from 'react-icons/fa';
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
                        className="p-2 hover:bg-lumex-bg-deep rounded-full transition-colors text-lumex-muted"
                        title="Close Reader"
                    >
                        <FaTimes />
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
                            className="p-1.5 hover:text-lumex-blue transition-colors"
                        >
                            <FaMinus size={12} />
                        </button>
                        <span className="text-xs font-mono w-10 text-center">{zoom}%</span>
                        <button
                            onClick={() => setZoom(z => Math.min(200, z + 10))}
                            className="p-1.5 hover:text-lumex-blue transition-colors"
                        >
                            <FaPlus size={12} />
                        </button>
                    </div>

                    <Stack direction="row" gap="sm">
                        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                            <FaDownload size={12} /> <span className="hidden lg:inline">PDF</span>
                        </Button>
                        <Button variant="primary" size="sm" className="items-center gap-2">
                            <FaShareAlt size={12} /> <span className="hidden sm:inline">Cite</span>
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
                                    icon={<FaList />}
                                    label="Outline"
                                />
                                <SidebarTab
                                    active={sidebarTab === 'figures'}
                                    onClick={() => setSidebarTab('figures')}
                                    icon={<FaImages />}
                                    label="Figures"
                                />
                                <SidebarTab
                                    active={sidebarTab === 'refs'}
                                    onClick={() => setSidebarTab('refs')}
                                    icon={<FaQuoteRight />}
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
                                            <div className="aspect-video bg-lumex-bg-deep rounded border border-lumex-border mb-2 overflow-hidden flex items-center justify-center">
                                                <FaImages className="text-lumex-sub text-3xl group-hover:scale-110 transition-transform" />
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
                    <div className="md:hidden flex flex-col items-center py-6 gap-6">
                        <button
                            className={`p-2 rounded-lg ${sidebarTab === 'outline' ? 'bg-lumex-blue text-white' : 'text-lumex-muted'}`}
                            onClick={() => setSidebarTab('outline')}
                        >
                            <FaList />
                        </button>
                        <button
                            className={`p-2 rounded-lg ${sidebarTab === 'figures' ? 'bg-lumex-blue text-white' : 'text-lumex-muted'}`}
                            onClick={() => setSidebarTab('figures')}
                        >
                            <FaImages />
                        </button>
                        <button
                            className={`p-2 rounded-lg ${sidebarTab === 'refs' ? 'bg-lumex-blue text-white' : 'text-lumex-muted'}`}
                            onClick={() => setSidebarTab('refs')}
                        >
                            <FaQuoteRight />
                        </button>
                    </div>
                </aside>

                {/* PDF Viewer Canvas */}
                <main className="flex-1 bg-lumex-bg h-full overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center">
                    <div
                        className="bg-white dark:bg-gray-100 shadow-2xl transition-all duration-300 origin-top h-fit"
                        style={{ width: `${600 * (zoom / 100)}px`, minWidth: '320px', padding: '10% 8%' }}
                    >
                        {/* Simulated Document Content */}
                        <div className="text-black text-left">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-8 border-b pb-2">
                                Lumex Research | DOI: {article.doi}
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
                                <h3 className="text-sm font-bold uppercase mt-8 border-b border-gray-200 pb-1">Abstract</h3>
                                <div className="italic bg-gray-50 p-4 border-l-2 border-black space-y-2">
                                    {article.abstract.map((section) => (
                                        <p key={section.text.substring(0, 20)}>{section.text}</p>
                                    ))}
                                </div>

                                <h3 className="text-sm font-bold uppercase mt-8 border-b border-gray-200 pb-1">1. Introduction</h3>
                                <p>
                                    Scientific communication is evolving at an unprecedented pace. The digital transition has not only changed how researchers access information but also how they interact with it. In this paper, we explore the integration of interactive reading environments...
                                </p>
                                <p>
                                    Lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <div className="py-8 my-4 bg-gray-50 border border-dashed border-gray-300 flex flex-col items-center justify-center italic text-gray-400 text-xs">
                                    <FaImages size={32} className="mb-2 opacity-50" />
                                    [Placeholder for Figure 1]
                                </div>
                                <p>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>

                                <h3 className="text-sm font-bold uppercase mt-8 border-b border-gray-200 pb-1">2. Methods</h3>
                                <p>
                                    Our experimental framework relies on a multi-stage data processing pipeline. First, we collected metadata from over 1 million open-access articles. Second, we applied...
                                </p>
                            </div>

                            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                                <span>© 2024 Lumex Research Group</span>
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
