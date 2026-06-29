import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useArticle } from '../../../entities/article/api/articleQueries';
import { Button, Stack, Skeleton, Modal, ModalContent, ModalTitle } from '../../../shared/ui';
import { fetchClient } from '../../../shared/api/base';

export interface PaperSummary {
    title: string;
    summary: string;
    keyFindings: string[];
    methodology: string;
    conclusion: string;
    keywords: string[];
}

interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
}
import { FaTimes, FaDownload, FaShareAlt, FaList, FaImages, FaQuoteRight, FaMinus, FaPlus, FaMagic } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

export const ArticleReadingPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { data: article, isLoading } = useArticle(slug || '');
    const [sidebarTab, setSidebarTab] = useState<'outline' | 'figures' | 'refs' | 'aichat'>('outline');
    const [zoom, setZoom] = useState(100);
    const [showAISummary, setShowAISummary] = useState(false);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [summaryData, setSummaryData] = useState<PaperSummary | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const getArticleTextBlob = () => {
        if (!article) return new Blob([''], { type: 'text/plain' });
        const text = `
            Title: ${article.title}
            Abstract: ${typeof article.abstract === 'string' ? article.abstract : Array.isArray(article.abstract) ? article.abstract.map((a: any) => a.text).join(' ') : ''}
            ${article.sections ? article.sections.map((s: any) => s.title + '\n' + s.content).join('\n') : ''}
            Data: ${JSON.stringify(article)} 
        `;
        return new Blob([text], { type: 'text/plain' });
    };

    const handleGenerateSummary = async () => {
        setShowAISummary(true);
        if (summaryData) return;

        setIsGeneratingSummary(true);
        try {
            const formData = new FormData();
            formData.append('file', getArticleTextBlob(), 'article.txt');

            const response = await fetchClient<{ success: boolean; data: PaperSummary }>('/ai/summarize', {
                method: 'POST',
                body: formData,
            });

            if (response.success) {
                setSummaryData(response.data);
            }
        } catch (error) {
            console.error('Failed to generate summary:', error);
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading) return;

        const userMsg = chatInput.trim();
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', getArticleTextBlob(), 'article.txt');
            formData.append('question', userMsg);

            const response = await fetchClient<{ success: boolean; data: { question: string; answer: string } }>('/ai/ask', {
                method: 'POST',
                body: formData,
            });

            if (response.success) {
                setChatHistory(prev => [...prev, { role: 'ai', content: response.data.answer }]);
            }
        } catch (error) {
            console.error('Failed to ask question:', error);
            setChatHistory(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error while processing your request.' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

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
        <div className="h-screen w-screen overflow-hidden bg-lumex-bg-deep flex flex-col text-lumex-text transition-colors duration-200">
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
                    <Stack direction="row" gap="sm">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 border-lumex-blue text-lumex-blue hover:bg-lumex-blue/10"
                            onClick={handleGenerateSummary}
                        >
                            <FaMagic size={12} /> <span className="hidden lg:inline">AI Summary</span>
                        </Button>
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
                                <SidebarTab
                                    active={sidebarTab === 'aichat'}
                                    onClick={() => setSidebarTab('aichat')}
                                    icon={<FaMagic />}
                                    label="AI Chat"
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
                            {sidebarTab === 'aichat' && (
                                <div className="flex flex-col h-full bg-lumex-bg-deep rounded-xl border border-lumex-border overflow-hidden shadow-inner">
                                    <div className="bg-gradient-to-r from-lumex-blue/10 to-purple-500/10 p-3 border-b border-lumex-border flex items-center gap-2">
                                        <div className="p-1.5 bg-lumex-blue/20 rounded-md text-lumex-blue">
                                            <FaMagic size={12} />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-lumex-text uppercase tracking-wider">Lumex AI Assistant</h3>
                                            <p className="text-[10px] text-lumex-text-secondary">Ask questions about this paper</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-lumex-bg-white border border-lumex-border rounded-2xl rounded-tl-sm p-4 shadow-sm w-[90%]"
                                        >
                                            <p className="text-[13px] text-lumex-text-secondary leading-relaxed">
                                                Hello! I'm your AI reading assistant. I've analyzed this paper and I'm ready to answer any questions you have. You can ask me to:
                                            </p>
                                            <ul className="mt-2 space-y-1.5">
                                                <li className="text-[12px] text-lumex-muted flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-lumex-blue" /> Explain complex concepts</li>
                                                <li className="text-[12px] text-lumex-muted flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-purple-500" /> Summarize specific sections</li>
                                                <li className="text-[12px] text-lumex-muted flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-500" /> Find specific methodologies</li>
                                            </ul>
                                        </motion.div>
                                        
                                        <AnimatePresence initial={false}>
                                            {chatHistory.map((msg, idx) => (
                                                <motion.div 
                                                    key={idx} 
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                                >
                                                    <div className={`p-3.5 rounded-2xl max-w-[90%] shadow-sm ${msg.role === 'ai' ? 'bg-lumex-bg-white border border-lumex-border rounded-tl-sm' : 'bg-gradient-to-br from-lumex-blue to-blue-600 text-white rounded-tr-sm'}`}>
                                                        <p className={`text-[13px] leading-relaxed whitespace-pre-wrap ${msg.role === 'ai' ? 'text-lumex-text-secondary' : 'text-white/90'}`}>{msg.content}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        
                                        {isChatLoading && (
                                            <motion.div 
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="flex justify-start"
                                            >
                                                <div className="bg-lumex-bg-white border border-lumex-border rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-lumex-blue rounded-full animate-bounce" />
                                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                                    <div className="w-1.5 h-1.5 bg-lumex-blue rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                    
                                    <div className="p-3 bg-lumex-bg-white border-t border-lumex-border shrink-0">
                                        <form onSubmit={handleChatSubmit} className="relative flex items-center">
                                            <input 
                                                type="text" 
                                                value={chatInput}
                                                onChange={e => setChatInput(e.target.value)}
                                                placeholder="Ask about this paper..." 
                                                disabled={isChatLoading}
                                                className="w-full bg-lumex-bg-deep border border-lumex-border rounded-full pl-4 pr-12 py-2.5 text-[13px] focus:outline-none focus:border-lumex-blue focus:ring-2 focus:ring-lumex-blue/20 text-lumex-text placeholder-lumex-sub disabled:opacity-50 transition-all shadow-inner"
                                            />
                                            <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="absolute right-1.5 p-2 bg-lumex-blue text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:bg-lumex-muted flex items-center justify-center shadow-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                            </button>
                                        </form>
                                    </div>
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
                        <button
                            className={`p-2 rounded-lg ${sidebarTab === 'aichat' ? 'bg-lumex-blue text-white' : 'text-lumex-muted'}`}
                            onClick={() => setSidebarTab('aichat')}
                        >
                            <FaMagic />
                        </button>
                    </div>
                </aside>

                {/* PDF Viewer Canvas */}
                <main className="flex-1 bg-lumex-bg h-full overflow-auto custom-scrollbar p-4 md:p-8 flex justify-center">
                    <div
                        className="bg-white dark:bg-lumex-bg-deep shadow-2xl transition-all duration-300 origin-top h-fit w-full max-w-5xl mx-auto dark:border dark:border-lumex-border"
                        style={{ minWidth: '320px', padding: '10% 8%' }}
                    >
                        {/* Simulated Document Content */}
                        <div className="text-black dark:text-lumex-text text-left">
                            <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-lumex-muted mb-8 border-b border-gray-200 dark:border-lumex-border pb-2">
                                Lumex Research | DOI: {article.doi}
                            </p>

                            <h2 className="text-2xl font-serif font-bold mb-4 leading-tight">
                                {article.title}
                            </h2>

                            <div className="flex gap-4 mb-6">
                                {article.authors?.slice(0, 3).map(a => (
                                    <span key={a.id} className="text-[11px] font-bold border-b border-black dark:border-lumex-text">
                                        {a.firstName} {a.lastName}
                                    </span>
                                ))}
                            </div>

                            <div className="text-[13px] font-serif leading-relaxed space-y-4">
                                <h3 className="text-sm font-bold uppercase mt-8 border-b border-gray-200 dark:border-lumex-border pb-1">Abstract</h3>
                                <div className="italic bg-gray-50 dark:bg-lumex-bg p-4 border-l-2 border-black dark:border-lumex-text space-y-2">
                                    {typeof article.abstract === 'string' ? (
                                        <p>{article.abstract}</p>
                                    ) : Array.isArray(article.abstract) ? (
                                        article.abstract.map((section: any) => (
                                            <p key={section.text?.substring(0, 20)}>{section.text}</p>
                                        ))
                                    ) : null}
                                </div>

                                {article.sections && article.sections.length > 0 ? (
                                    article.sections.map((section) => (
                                        <div key={section.id} className="mt-8">
                                            <h3 className="text-sm font-bold uppercase border-b border-gray-200 dark:border-lumex-border pb-1 mb-4">{section.title}</h3>
                                            <div dangerouslySetInnerHTML={{ __html: section.content }} className="space-y-4 text-justify" />
                                            {section.title === "1. Introduction" && (
                                                <div className="py-8 my-6 bg-gray-50 dark:bg-lumex-bg border border-dashed border-gray-300 dark:border-lumex-border flex flex-col items-center justify-center italic text-gray-400 dark:text-lumex-muted text-xs">
                                                    <FaImages size={32} className="mb-2 opacity-50" />
                                                    [Figure 1: Map of Green Infrastructure Density in Study Areas]
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <h3 className="text-sm font-bold uppercase mt-8 border-b border-gray-200 pb-1">1. Introduction</h3>
                                        <p>Scientific communication is evolving at an unprecedented pace...</p>
                                    </>
                                )}
                            </div>

                            <div className="mt-16 pt-8 border-t border-gray-100 dark:border-lumex-border flex justify-between items-center text-[10px] text-gray-400 dark:text-lumex-muted">
                                <span>© 2024 Lumex Research Group</span>
                                <span>Page 1 of 12</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* AI Summary Modal */}
            <Modal open={showAISummary} onOpenChange={setShowAISummary}>
                <ModalContent aria-describedby={undefined} style={{ maxWidth: '56rem' }} className="max-w-4xl w-full bg-lumex-bg-deep/95 backdrop-blur-2xl border-lumex-border overflow-hidden p-0 shadow-2xl shadow-lumex-blue/10">
                    <div className="bg-gradient-to-r from-lumex-blue/10 via-purple-500/5 to-transparent p-6 border-b border-lumex-border">
                        <ModalTitle className="flex items-center gap-3 text-2xl font-serif text-lumex-text">
                            <div className="p-2 bg-gradient-to-br from-lumex-blue/20 to-purple-500/20 rounded-xl text-lumex-blue shadow-inner shadow-white/5">
                                <FaMagic size={20} />
                            </div>
                            AI Paper Insights
                        </ModalTitle>
                        <p className="text-sm text-lumex-text-secondary mt-2 font-medium">Generated by Lumex AI reading assistant</p>
                    </div>
                    
                    <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {isGeneratingSummary ? (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-[350px] gap-6"
                                >
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-lumex-blue/20 blur-2xl rounded-full animate-pulse" />
                                        <div className="relative w-16 h-16 border-4 border-lumex-blue/20 border-t-lumex-blue rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                                        <FaMagic className="absolute text-lumex-blue animate-pulse" size={20} />
                                    </div>
                                    <div className="text-center space-y-3">
                                        <p className="text-xl font-serif font-bold bg-gradient-to-r from-lumex-blue to-purple-400 bg-clip-text text-transparent animate-pulse">
                                            Analyzing Research Paper...
                                        </p>
                                        <p className="text-sm text-lumex-muted max-w-sm mx-auto">Extracting key methodologies, findings, and structural insights using advanced LLM models.</p>
                                    </div>
                                </motion.div>
                            ) : summaryData ? (
                                <motion.div 
                                    key="content"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                                    }}
                                    className="space-y-6 md:space-y-8"
                                >
                                    <motion.div 
                                        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                        className="bg-gradient-to-br from-lumex-bg-white to-transparent border border-lumex-border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                                        <h4 className="font-bold text-lg md:text-xl text-lumex-text mb-4 flex items-center gap-3">
                                            <span className="text-emerald-500 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20"><FaList size={16} /></span>
                                            Executive Summary
                                        </h4>
                                        <p className="text-lumex-text-secondary leading-relaxed text-[15px] md:text-base">
                                            {summaryData.summary}
                                        </p>
                                    </motion.div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        <motion.div 
                                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                            className="bg-lumex-bg-white border border-lumex-border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600" />
                                            <h4 className="font-bold text-lg text-lumex-text mb-5 flex items-center gap-3">
                                                <span className="text-blue-500 bg-blue-500/10 p-2 rounded-xl border border-blue-500/20"><FaQuoteRight size={16} /></span>
                                                Key Findings
                                            </h4>
                                            <ul className="space-y-4">
                                                {summaryData.keyFindings.map((finding, idx) => (
                                                    <li key={idx} className="flex gap-4 text-sm md:text-[15px] text-lumex-text-secondary group">
                                                        <span className="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-blue-500/50 group-hover:bg-blue-500 group-hover:scale-125 transition-all" />
                                                        <span className="leading-relaxed">{finding}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>

                                        <motion.div 
                                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                            className="flex flex-col gap-6 md:gap-8"
                                        >
                                            <div className="bg-lumex-bg-white border border-lumex-border rounded-2xl p-6 shadow-sm relative overflow-hidden flex-1 group hover:border-purple-500/30 transition-colors">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-purple-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <h4 className="font-bold text-lg text-lumex-text mb-3 flex items-center gap-3">
                                                    <span className="text-purple-500 bg-purple-500/10 p-2 rounded-xl border border-purple-500/20"><FaImages size={16} /></span>
                                                    Methodology
                                                </h4>
                                                <p className="text-[15px] text-lumex-text-secondary leading-relaxed">
                                                    {summaryData.methodology}
                                                </p>
                                            </div>

                                            <div className="bg-lumex-bg-white border border-lumex-border rounded-2xl p-6 shadow-sm relative overflow-hidden flex-1 group hover:border-amber-500/30 transition-colors">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <h4 className="font-bold text-lg text-lumex-text mb-3 flex items-center gap-3">
                                                    <span className="text-amber-500 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20"><FaMagic size={16} /></span>
                                                    Conclusion
                                                </h4>
                                                <p className="text-[15px] text-lumex-text-secondary leading-relaxed">
                                                    {summaryData.conclusion}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <motion.div 
                                        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                                        className="pt-6 border-t border-lumex-border/60"
                                    >
                                        <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                                            <span className="text-xs font-bold text-lumex-muted uppercase tracking-widest mr-2">Keywords</span>
                                            {summaryData.keywords.map((kw, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className="px-4 py-1.5 bg-lumex-bg-deep border border-lumex-border rounded-full text-[13px] font-medium text-lumex-text-secondary shadow-sm hover:shadow-md hover:border-lumex-blue/50 hover:text-lumex-blue hover:bg-lumex-blue/5 transition-all cursor-default"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="error"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col justify-center items-center h-[350px] text-red-500 gap-4"
                                >
                                    <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                                        <FaTimes size={32} />
                                    </div>
                                    <p className="font-bold text-lg">Failed to generate insights.</p>
                                    <p className="text-sm opacity-80 text-center max-w-xs">An error occurred while communicating with the AI service. Please check your network and try again.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </ModalContent>
            </Modal>
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
