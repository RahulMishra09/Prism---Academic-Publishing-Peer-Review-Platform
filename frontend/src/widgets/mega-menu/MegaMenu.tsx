import { Link } from '@shared/ui';

interface MegaMenuCategory {
    title: string;
    links: { label: string; href: string }[];
}

const MEGA_MENU_DATA: MegaMenuCategory[] = [
    {
        title: 'Biomedical Sciences',
        links: [
            { label: 'Cancer Research', href: '/subject/cancer' },
            { label: 'Genetics & Genomics', href: '/subject/genetics' },
            { label: 'Neuroscience', href: '/subject/neuroscience' },
            { label: 'Pharmacology', href: '/subject/pharmacology' },
        ],
    },
    {
        title: 'Computer Science',
        links: [
            { label: 'Artificial Intelligence', href: '/subject/ai' },
            { label: 'Software Engineering', href: '/subject/software' },
            { label: 'Data Science', href: '/subject/data' },
            { label: 'Cybersecurity', href: '/subject/cybersecurity' },
        ],
    },
    {
        title: 'Earth Sciences',
        links: [
            { label: 'Climate Studies', href: '/subject/climate' },
            { label: 'Geology', href: '/subject/geology' },
            { label: 'Oceanography', href: '/subject/oceanography' },
            { label: 'Atmospheric Science', href: '/subject/atmospheric' },
        ],
    },
    {
        title: 'Social Sciences',
        links: [
            { label: 'Economics', href: '/subject/economics' },
            { label: 'Psychology', href: '/subject/psychology' },
            { label: 'Political Science', href: '/subject/politics' },
            { label: 'Sociology', href: '/subject/sociology' },
        ],
    },
    {
        title: 'Physical Sciences',
        links: [
            { label: 'Physics', href: '/subject/physics' },
            { label: 'Chemistry', href: '/subject/chemistry' },
            { label: 'Mathematics', href: '/subject/mathematics' },
            { label: 'Materials Science', href: '/subject/materials' },
        ],
    },
    {
        title: 'Humanities',
        links: [
            { label: 'History', href: '/subject/history' },
            { label: 'Philosophy', href: '/subject/philosophy' },
            { label: 'Linguistics', href: '/subject/linguistics' },
            { label: 'Literature', href: '/subject/literature' },
        ],
    },
];

const ChevronRightIcon = () => (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="absolute left-0 top-full z-50 w-full animate-slide-down">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-lumex-text/25 backdrop-blur-[2px]"
                style={{ top: 'var(--header-height, 112px)' }}
                aria-hidden="true"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative border-t border-lumex-border bg-lumex-bg-white shadow-2xl">
                <div className="mx-auto w-full max-w-container">
                    <div className="flex flex-col xl:flex-row">

                        {/* Left sidebar — discipline list */}
                        <div className="w-full border-b border-lumex-border bg-lumex-bg-deep/40 py-5 xl:w-72 xl:min-h-[400px] xl:border-b-0 xl:border-r xl:py-6">
                            {/* Mobile main nav links */}
                            <nav className="mb-4 border-b border-lumex-border pb-4 xl:hidden" aria-label="Mobile navigation">
                                {['/', '/journals', '/about'].map((href, i) => {
                                    const labels = ['Home', 'Journals', 'About'];
                                    return (
                                        <Link
                                            key={href}
                                            to={href}
                                            onClick={onClose}
                                            className="flex items-center px-6 py-2.5 text-[0.95rem] font-semibold text-lumex-text transition-colors hover:bg-lumex-bg-white hover:text-lumex-blue"
                                        >
                                            {labels[i]}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <p className="px-6 pb-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-lumex-sub">
                                Browse by discipline
                            </p>
                            <ul role="list">
                                {MEGA_MENU_DATA.map(cat => (
                                    <li key={cat.title}>
                                        <button className="group flex w-full items-center justify-between px-6 py-2.5 text-left text-[0.88rem] font-medium text-lumex-text transition-colors hover:bg-lumex-bg-white hover:text-lumex-blue focus:outline-none focus-visible:bg-lumex-bg-white">
                                            <span>{cat.title}</span>
                                            <span className="text-lumex-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-lumex-blue">
                                                <ChevronRightIcon />
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 px-6">
                                <Link
                                    to="/disciplines"
                                    onClick={onClose}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-lumex-blue transition-colors hover:text-lumex-blue-dark"
                                >
                                    All disciplines <ChevronRightIcon />
                                </Link>
                            </div>
                        </div>

                        {/* Right — 3-column subcategory grid (desktop only) */}
                        <div className="hidden flex-1 bg-lumex-bg-white p-8 xl:block">
                            <p className="mb-6 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-lumex-sub">
                                Featured subjects
                            </p>
                            <div className="grid grid-cols-3 gap-x-10 gap-y-8">
                                {MEGA_MENU_DATA.map(cat => (
                                    <div key={cat.title}>
                                        <h4 className="mb-3 border-b border-lumex-border pb-2 text-[0.82rem] font-bold text-lumex-text">
                                            {cat.title}
                                        </h4>
                                        <ul className="space-y-2" role="list">
                                            {cat.links.map(link => (
                                                <li key={link.label}>
                                                    <Link
                                                        to={link.href}
                                                        onClick={onClose}
                                                        className="block text-[0.85rem] text-lumex-muted transition-colors hover:text-lumex-blue"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Footer strip */}
                            <div className="mt-8 flex items-center justify-between border-t border-lumex-border pt-5">
                                <Link
                                    to="/disciplines"
                                    onClick={onClose}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-lumex-blue transition-colors hover:text-lumex-blue-dark"
                                >
                                    Browse all publications <ChevronRightIcon />
                                </Link>
                                <Link
                                    to="/search"
                                    onClick={onClose}
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-lumex-muted transition-colors hover:text-lumex-blue"
                                >
                                    Advanced search <ChevronRightIcon />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
