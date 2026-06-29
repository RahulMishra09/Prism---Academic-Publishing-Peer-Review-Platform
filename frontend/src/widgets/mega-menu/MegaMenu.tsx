import { useState } from 'react';
import { Link } from '@shared/ui';
import { FaChevronRight } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

interface MegaMenuCategory {
    title: string;
    icon: string;
    color: string;
    articleCount: string;
    links: { label: string; href: string; icon: string }[];
}

const MEGA_MENU_DATA: MegaMenuCategory[] = [
    {
        title: 'Biomedical Sciences',
        icon: '🧬',
        color: '#0ea5e9',
        articleCount: '130k+',
        links: [
            { label: 'Cancer Research', href: '/subject/cancer', icon: '🔬' },
            { label: 'Genetics', href: '/subject/genetics', icon: '🧬' },
            { label: 'Neuroscience', href: '/subject/neuroscience', icon: '🧠' },
            { label: 'Pharmacology', href: '/subject/pharmacology', icon: '💊' },
        ],
    },
    {
        title: 'Computer Science',
        icon: '💻',
        color: '#6366f1',
        articleCount: '71.4k+',
        links: [
            { label: 'Artificial Intelligence', href: '/subject/ai', icon: '🤖' },
            { label: 'Software Engineering', href: '/subject/software', icon: '💻' },
            { label: 'Data Structures', href: '/subject/data', icon: '🗄️' },
            { label: 'Cybersecurity', href: '/subject/cybersecurity', icon: '🔒' },
        ],
    },
    {
        title: 'Earth Sciences',
        icon: '🌍',
        color: '#14b8a6',
        articleCount: '43.8k+',
        links: [
            { label: 'Climate Studies', href: '/subject/climate', icon: '🌡️' },
            { label: 'Geology', href: '/subject/geology', icon: '🌋' },
            { label: 'Oceanography', href: '/subject/oceanography', icon: '🌊' },
        ],
    },
    {
        title: 'Physics & Astronomy',
        icon: '⚛️',
        color: '#5b7cf6',
        articleCount: '62.1k+',
        links: [
            { label: 'Quantum Mechanics', href: '/subject/physics-astronomy', icon: '🔮' },
            { label: 'Astrophysics', href: '/subject/physics-astronomy', icon: '🔭' },
            { label: 'Particle Physics', href: '/subject/physics-astronomy', icon: '⚛️' },
        ],
    },
];

export interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    const [activeCategory, setActiveCategory] = useState(0);
    const activeData = MEGA_MENU_DATA[activeCategory];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="absolute left-0 top-full z-50 w-full">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-[88px] bg-lumex-text/20 backdrop-blur-sm"
                        aria-hidden="true"
                        onClick={onClose}
                    />

                    {/* Dropdown Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="relative border-t border-lumex-border bg-lumex-card shadow-2xl origin-top"
                    >
                        <div className="mx-auto w-full max-w-container xl:px-8">
                            <div className="flex flex-col xl:flex-row">
                                {/* ─── Left Sidebar ─── */}
                                <div className="w-full py-5 xl:w-72 xl:min-h-[380px] xl:border-r border-lumex-border">
                                    {/* Mobile Main Nav */}
                                    <nav className="mb-5 border-b border-lumex-border pb-4 xl:hidden" aria-label="Mobile main navigation">
                                        <ul className="flex flex-col">
                                            <li><Link to="/" onClick={onClose} className="block px-6 py-3 text-lg font-bold text-lumex-text hover:bg-lumex-card-hover hover:text-lumex-blue transition-colors">Home</Link></li>
                                            <li><Link to="/journals" onClick={onClose} className="block px-6 py-3 text-lg font-bold text-lumex-text hover:bg-lumex-card-hover hover:text-lumex-blue transition-colors">Journals</Link></li>
                                            <li><Link to="/about" onClick={onClose} className="block px-6 py-3 text-lg font-bold text-lumex-text hover:bg-lumex-card-hover hover:text-lumex-blue transition-colors">About</Link></li>
                                        </ul>
                                    </nav>

                                    <h3 className="px-5 pb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-lumex-sub">
                                        Browse by Discipline
                                    </h3>
                                    <ul className="flex flex-col gap-0.5 px-2">
                                        {MEGA_MENU_DATA.map((category, idx) => (
                                            <li key={category.title}>
                                                <button
                                                    onMouseEnter={() => setActiveCategory(idx)}
                                                    onClick={() => setActiveCategory(idx)}
                                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 group ${
                                                        activeCategory === idx
                                                            ? 'bg-lumex-blue/10 text-lumex-blue'
                                                            : 'text-lumex-text hover:bg-lumex-card-hover'
                                                    }`}
                                                >
                                                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all ${
                                                        activeCategory === idx
                                                            ? 'bg-lumex-blue/20 scale-110'
                                                            : 'bg-lumex-bg-deep group-hover:bg-lumex-bg-deep'
                                                    }`}>
                                                        {category.icon}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`block text-sm font-semibold leading-tight ${
                                                            activeCategory === idx ? 'text-lumex-blue' : ''
                                                        }`}>
                                                            {category.title}
                                                        </span>
                                                        <span className={`text-[10px] font-bold ${
                                                            activeCategory === idx ? 'text-lumex-blue/70' : 'text-lumex-sub'
                                                        }`}>
                                                            {category.articleCount} articles
                                                        </span>
                                                    </div>
                                                    <FaChevronRight className={`h-2.5 w-2.5 transition-all duration-150 ${
                                                        activeCategory === idx
                                                            ? 'text-lumex-blue translate-x-0.5'
                                                            : 'text-lumex-sub/40 group-hover:text-lumex-sub'
                                                    }`} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-4 px-5 pt-3 border-t border-lumex-border">
                                        <Link
                                            to="/disciplines"
                                            onClick={onClose}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-lumex-blue hover:text-lumex-blue-dark transition-colors"
                                        >
                                            View all disciplines
                                            <FaChevronRight className="h-2 w-2" />
                                        </Link>
                                    </div>
                                </div>

                                {/* ─── Right Content Panel ─── */}
                                <div className="hidden flex-1 xl:block">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeCategory}
                                            initial={{ opacity: 0, x: 8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }}
                                            transition={{ duration: 0.15 }}
                                            className="p-7"
                                        >
                                            {/* Category Header */}
                                            <div className="mb-6 flex items-center gap-3">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                                                    style={{ background: `${activeData.color}18` }}
                                                >
                                                    {activeData.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-lumex-text">{activeData.title}</h3>
                                                    <p className="text-[11px] font-semibold" style={{ color: activeData.color }}>
                                                        {activeData.articleCount} articles · Peer-reviewed
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/subject/${activeData.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}
                                                    onClick={onClose}
                                                    className="ml-auto rounded-lg border border-lumex-border px-3.5 py-1.5 text-xs font-semibold text-lumex-muted hover:border-lumex-blue hover:text-lumex-blue transition-all hover:no-underline"
                                                >
                                                    Browse All →
                                                </Link>
                                            </div>

                                            {/* Subcategory Grid */}
                                            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-lumex-sub">
                                                Featured Subcategories
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {activeData.links.map((link) => (
                                                    <Link
                                                        key={link.label}
                                                        to={link.href}
                                                        onClick={onClose}
                                                        className="group flex items-center gap-3 rounded-lg border border-lumex-border bg-lumex-bg-white p-3.5 transition-all hover:border-lumex-blue/30 hover:bg-lumex-blue/5 hover:shadow-sm hover:no-underline"
                                                    >
                                                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lumex-bg-deep text-base transition-transform group-hover:scale-110">
                                                            {link.icon}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="block text-sm font-semibold text-lumex-text group-hover:text-lumex-blue transition-colors">
                                                                {link.label}
                                                            </span>
                                                            <span className="text-[10px] text-lumex-sub">Browse articles →</span>
                                                        </div>
                                                        <FaChevronRight className="h-2.5 w-2.5 text-lumex-sub/30 transition-all group-hover:text-lumex-blue group-hover:translate-x-0.5" />
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Quick Actions Footer */}
                                            <div className="mt-6 flex items-center gap-4 rounded-lg bg-lumex-bg-deep p-4">
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-lumex-text mb-0.5">Ready to contribute?</p>
                                                    <p className="text-[11px] text-lumex-muted">Submit your research to a peer-reviewed journal in {activeData.title}.</p>
                                                </div>
                                                <Link
                                                    to="/publish"
                                                    onClick={onClose}
                                                    className="shrink-0 rounded-lg bg-lumex-blue px-4 py-2 text-xs font-bold text-white hover:bg-lumex-blue-dark transition-colors hover:no-underline"
                                                >
                                                    Submit Paper
                                                </Link>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
