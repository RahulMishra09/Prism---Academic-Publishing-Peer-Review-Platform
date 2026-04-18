import { Link } from '@shared/ui';
import { FaChevronRight } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

interface MegaMenuCategory {
    title: string;
    links: { label: string; href: string }[];
}

const MEGA_MENU_DATA: MegaMenuCategory[] = [
    {
        title: 'Biomedical Sciences',
        links: [
            { label: 'Cancer Research', href: '/subject/cancer' },
            { label: 'Genetics', href: '/subject/genetics' },
            { label: 'Neuroscience', href: '/subject/neuroscience' },
            { label: 'Pharmacology', href: '/subject/pharmacology' },
        ],
    },
    {
        title: 'Computer Science',
        links: [
            { label: 'Artificial Intelligence', href: '/subject/ai' },
            { label: 'Software Engineering', href: '/subject/software' },
            { label: 'Data Structures', href: '/subject/data' },
            { label: 'Cybersecurity', href: '/subject/cybersecurity' },
        ],
    },
    {
        title: 'Earth Sciences',
        links: [
            { label: 'Climate Studies', href: '/subject/climate' },
            { label: 'Geology', href: '/subject/geology' },
            { label: 'Oceanography', href: '/subject/oceanography' },
        ],
    },
    // Additional realistic categories are omitted for brevity
];

export interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
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
                        className="fixed inset-0 top-[88px] bg-lumex-text/20 backdrop-blur-sm lg:top-[88px] xl:top-[88px]"
                        aria-hidden="true"
                        onClick={onClose}
                    />

                    {/* Dropdown Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative border-t border-lumex-border bg-lumex-bg-white shadow-2xl xl:shadow-xl origin-top"
                    >
                        <div className="mx-auto w-full max-w-container xl:px-8">
                            <div className="flex flex-col xl:flex-row">
                                <div className="w-full bg-lumex-bg-light/50 py-6 xl:w-80 xl:min-h-[420px] xl:border-r border-lumex-border">
                                    {/* Mobile Main Nav (Hidden on Desktop) */}
                                    <nav className="mb-6 border-b border-lumex-border pb-4 xl:hidden" aria-label="Mobile main navigation">
                                        <ul className="flex flex-col">
                                            <li>
                                                <Link to="/" onClick={onClose} className="block px-6 py-3 text-lg font-bold text-lumex-text hover:bg-lumex-bg-white hover:text-lumex-blue transition-colors">Home</Link>
                                            </li>
                                            <li>
                                                <Link to="/journals" onClick={onClose} className="block px-6 py-3 text-lg font-bold text-lumex-text hover:bg-lumex-bg-white hover:text-lumex-blue transition-colors">Journals</Link>
                                            </li>
                                            <li>
                                                <Link to="/about" onClick={onClose} className="block px-6 py-3 text-lg font-bold text-lumex-text hover:bg-lumex-bg-white hover:text-lumex-blue transition-colors">About</Link>
                                            </li>
                                        </ul>
                                    </nav>

                                    <h3 className="px-6 pb-3 text-xs font-bold uppercase tracking-[0.1em] text-lumex-sub">
                                        Browse by discipline
                                    </h3>
                                    <ul className="flex flex-col">
                                        {MEGA_MENU_DATA.map(category => (
                                            <li key={category.title}>
                                                <button className="flex w-full items-center justify-between px-6 py-3 text-left font-semibold text-lumex-text transition-colors hover:bg-lumex-bg-white hover:text-lumex-blue focus:outline-none focus:bg-lumex-bg-white rounded-r-full mr-4 xl:mr-0 xl:rounded-none group">
                                                    <span>{category.title}</span>
                                                    <FaChevronRight className="h-3 w-3 text-lumex-muted group-hover:text-lumex-blue xl:hidden transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-6 px-6 xl:hidden">
                                        <Link to="/disciplines" onClick={onClose} className="inline-flex items-center gap-2 text-sm font-bold text-lumex-blue hover:underline">
                                            See all disciplines <FaChevronRight className="h-2.5 w-2.5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Subcategory View - Mobile: Hidden (handled via drill down logic), Desktop: visible mapped column */}
                                <div className="hidden flex-1 bg-lumex-bg-white p-8 xl:block">
                                    <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.1em] text-lumex-sub">
                                        Featured Subcategories
                                    </h3>
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-10">
                                        {MEGA_MENU_DATA.map(category => (
                                            <div key={`sub-${category.title}`}>
                                                <h4 className="mb-4 font-bold text-lumex-text border-b border-lumex-border-light pb-2">
                                                    {category.title}
                                                </h4>
                                                <ul className="space-y-2.5">
                                                    {category.links.map(link => (
                                                        <li key={link.label}>
                                                            <Link
                                                                to={link.href}
                                                                onClick={onClose}
                                                                className="text-[0.9rem] text-lumex-muted hover:text-lumex-blue hover:underline transition-colors block"
                                                            >
                                                                {link.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-10 border-t border-lumex-border bg-lumex-bg-deep/50 -mx-8 -mb-8 px-8 py-5">
                                        <Link to="/disciplines" onClick={onClose} className="inline-flex items-center gap-2 text-sm font-bold text-lumex-blue hover:text-lumex-blue-dark transition-colors">
                                            Browse all publications{' '}
                                            <FaChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
