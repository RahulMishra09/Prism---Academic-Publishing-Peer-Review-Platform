import { Link } from '@shared/ui';
import { useSiteConfig } from '../../shared/api/useSiteConfig';

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
            { label: 'About Prism', href: '/about' },
            { label: 'Editorial Board', href: '/editors' },
            { label: 'Careers', href: '/careers' },
            { label: 'News & Press', href: '/news' },
            { label: 'Contact Us', href: '/contact' },
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

const PrismLogoMark = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polygon points="16,3 29,27 3,27" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="16" cy="3" r="1.5" fill="white" opacity="0.9" />
        <line x1="29" y1="27" x2="33" y2="23" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="27" x2="33" y2="27" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="27" x2="32" y2="31" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const TwitterIcon = () => (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const YoutubeIcon = () => (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
);

export function GlobalFooter() {
    const { data: config } = useSiteConfig();
    const currentYear = new Date().getFullYear();

    const socialLinks = config?.socialLinks
        ? [
              { href: config.socialLinks.twitter, label: 'Twitter / X', Icon: TwitterIcon },
              { href: config.socialLinks.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
              { href: config.socialLinks.facebook, label: 'Facebook', Icon: FacebookIcon },
              { href: config.socialLinks.youtube, label: 'YouTube', Icon: YoutubeIcon },
          ]
        : [];

    return (
        <footer className="border-t border-lumex-border bg-lumex-bg-deep">
            {/* Top decorative strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-lumex-blue via-prism-violet to-prism-teal opacity-60" />

            <div className="mx-auto w-full max-w-container px-6 pt-14 pb-8">
                {/* 5-column grid */}
                <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand column */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="mb-4 flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-lumex-blue to-prism-violet shadow-sm">
                                <PrismLogoMark />
                            </div>
                            <span className="font-serif text-[1rem] font-semibold text-lumex-text">
                                Prism
                            </span>
                        </Link>
                        <p className="mb-5 max-w-[220px] text-sm leading-relaxed text-lumex-muted">
                            Advancing human knowledge through rigorous, open, and accessible academic publishing.
                        </p>

                        {socialLinks.length > 0 && (
                            <div className="flex gap-2" aria-label="Social media">
                                {socialLinks.map(({ href, label, Icon }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-lumex-border bg-lumex-bg-white/5 text-lumex-muted shadow-sm transition-all hover:border-lumex-blue/40 hover:bg-lumex-blue/10 hover:text-lumex-blue"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Link columns */}
                    {FOOTER_COLUMNS.map(col => (
                        <nav key={col.title} aria-label={`${col.title} links`}>
                            <p className="mb-4 text-[0.67rem] font-bold uppercase tracking-[0.13em] text-lumex-muted/60">
                                {col.title}
                            </p>
                            <ul className="space-y-2.5" role="list">
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-[0.88rem] text-lumex-sub transition-colors hover:text-lumex-blue"
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
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-lumex-border/50 pt-6">
                    <span className="text-xs text-lumex-sub/60">
                        © {currentYear} Prism Academic Publishing Ltd. All rights reserved.
                    </span>
                    <nav aria-label="Legal links" className="flex flex-wrap gap-x-5 gap-y-1">
                        {BOTTOM_LINKS.map(link => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="text-xs text-lumex-sub/60 transition-colors hover:text-lumex-blue"
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
