import { Link } from '@shared/ui';
import { useSiteConfig } from '../../shared/api/useSiteConfig';
import { FaTwitter, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';

const FOOTER_COLUMNS = [
    {
        title: 'Explore',
        links: [
            { label: 'Browse Articles', href: '/search' },
            { label: 'Browse Journals', href: '/journals' },
            { label: 'Special Collections', href: '/collections' },
            { label: 'Trending Research', href: '/search?sort=trending' },
            { label: 'Open Access', href: '/open-access' },
        ],
    },
    {
        title: 'For Authors',
        links: [
            { label: 'Submit Manuscript', href: '/publish' },
            { label: 'Author Guidelines', href: '/authors' },
            { label: 'Journal Finder', href: '/journals' },
            { label: 'Track Submission', href: '/account' },
            { label: 'APC & Pricing', href: '/open-access' },
        ],
    },
    {
        title: 'Institutions',
        links: [
            { label: 'Institutional Access', href: '/institutions' },
            { label: 'Library Partnerships', href: '/librarians' },
            { label: 'Licensing Options', href: '/licensing' },
            { label: 'Usage Statistics', href: '/stats' },
            { label: 'Site Licenses', href: '/licenses' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Editorial Board', href: '/editors' },
            { label: 'Careers', href: '/careers' },
            { label: 'News & Press', href: '/news' },
            { label: 'Contact', href: '/contact' },
        ],
    },
];

const BOTTOM_LINKS = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Settings', href: '/cookies' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Sitemap', href: '/sitemap' },
];

export function GlobalFooter() {
    const { data: config } = useSiteConfig();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-lumex-border bg-lumex-bg-deep pt-14 pb-7">
            <div className="mx-auto w-full max-w-container px-6">
                {/* 5-column grid: brand + 4 link columns */}
                <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand column */}
                    <div className="lg:col-span-1">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-lumex-blue">
                                <span className="font-serif text-sm font-bold italic text-white">
                                    L
                                </span>
                            </div>
                            <span className="font-serif text-base font-semibold text-lumex-text">
                                Lumex Research
                            </span>
                        </div>
                        <p className="mb-4 max-w-[240px] text-sm leading-relaxed text-lumex-muted">
                            Advancing human knowledge through rigorous, open, and accessible
                            academic publishing.
                        </p>
                        <div className="flex gap-2.5" aria-label="Social media links">
                            {config?.socialLinks && (
                                <>
                                    <a
                                        href={config.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Twitter"
                                        className="flex h-[32px] w-[32px] items-center justify-center rounded-md border border-lumex-border text-lumex-muted transition-colors hover:border-lumex-blue hover:text-lumex-blue bg-lumex-bg-white hover:bg-lumex-blue-soft shadow-sm"
                                    >
                                        <FaTwitter size={14} />
                                    </a>
                                    <a
                                        href={config.socialLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                        className="flex h-[32px] w-[32px] items-center justify-center rounded-md border border-lumex-border text-lumex-muted transition-colors hover:border-lumex-blue hover:text-lumex-blue bg-lumex-bg-white hover:bg-lumex-blue-soft shadow-sm"
                                    >
                                        <FaFacebook size={14} />
                                    </a>
                                    <a
                                        href={config.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                        className="flex h-[32px] w-[32px] items-center justify-center rounded-md border border-lumex-border text-lumex-muted transition-colors hover:border-lumex-blue hover:text-lumex-blue bg-lumex-bg-white hover:bg-lumex-blue-soft shadow-sm"
                                    >
                                        <FaLinkedin size={14} />
                                    </a>
                                    <a
                                        href={config.socialLinks.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="YouTube"
                                        className="flex h-[32px] w-[32px] items-center justify-center rounded-md border border-lumex-border text-lumex-muted transition-colors hover:border-lumex-blue hover:text-lumex-blue bg-lumex-bg-white hover:bg-lumex-blue-soft shadow-sm"
                                    >
                                        <FaYoutube size={14} />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Link columns */}
                    {FOOTER_COLUMNS.map(col => (
                        <nav key={col.title} aria-label={`${col.title} links`}>
                            <p className="mb-3.5 text-[0.69rem] font-semibold uppercase tracking-[0.1em] text-lumex-muted">
                                {col.title}
                            </p>
                            <ul className="space-y-2">
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-lumex-sub transition-colors hover:text-lumex-blue hover:no-underline"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-lumex-border pt-5">
                    <span className="text-xs text-lumex-sub">
                        © {currentYear} Lumex Research Ltd. Registered in England & Wales. All
                        rights reserved.
                    </span>
                    <nav aria-label="Legal links" className="flex flex-wrap gap-5 text-xs text-lumex-sub">
                        {BOTTOM_LINKS.map(link => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="transition-colors hover:text-lumex-blue"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
