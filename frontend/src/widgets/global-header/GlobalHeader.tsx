import { useState, useEffect, useRef } from 'react';
import { Link } from '@shared/ui';
import { useNavigate } from 'react-router-dom';
import { MegaMenu } from '../mega-menu/MegaMenu';
import { useAuthStore } from '../../app/store/useAuthStore';
import { useThemeStore } from '../../entities/theme/model/useThemeStore';

const PrismIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polygon points="16,3 29,27 3,27" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="16" y1="3" x2="16" y2="27" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
        <line x1="16" y1="3" x2="29" y2="27" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        <circle cx="16" cy="3" r="1.5" fill="white" opacity="0.9" />
        <line x1="29" y1="27" x2="33" y2="23" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="27" x2="33" y2="27" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="27" x2="32" y2="31" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const SearchIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
);

const UserIcon = () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const SunIcon = () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="5" /><path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const MoonIcon = () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

const BarsIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const XIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const NAV_ITEMS = [
    { id: '/', label: 'Home' },
    { id: '/journals', label: 'Journals' },
    { id: '/about', label: 'About' },
];

export function GlobalHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleSearch = (e: React.KeyboardEvent | React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            void navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchExpanded(false);
            setIsMobileMenuOpen(false);
        }
    };

    const expandSearch = () => {
        setIsSearchExpanded(true);
        setTimeout(() => searchRef.current?.focus(), 50);
    };

    const closeMenus = () => {
        setIsMobileMenuOpen(false);
        setIsExploreOpen(false);
    };

    return (
        <header
            className={[
                'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
                isScrolled
                    ? 'bg-lumex-bg-white/90 backdrop-blur-md border-b border-lumex-border shadow-sm dark:bg-lumex-bg-deep/90'
                    : 'bg-lumex-bg-white border-b border-lumex-border/60',
            ].join(' ')}
        >
            {/* Utility bar — desktop only */}
            <div className="hidden border-b border-lumex-border/40 lg:block">
                <div className="mx-auto flex w-full max-w-container justify-end px-6">
                    <nav
                        aria-label="Utility navigation"
                        className="flex items-center gap-5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-widest text-lumex-muted"
                    >
                        {isAuthenticated && user ? (
                            <>
                                <span className="flex items-center gap-1.5 text-lumex-text">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lumex-blue/10 text-lumex-blue">
                                        <UserIcon />
                                    </span>
                                    <span className="opacity-60">Hi,</span>&nbsp;{user.firstName}
                                </span>
                                <Link to="/account" className="transition-colors hover:text-lumex-blue">
                                    My Account
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="flex items-center gap-1 transition-colors hover:text-lumex-blue"
                                >
                                    <LogoutIcon /> Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center gap-1 transition-colors hover:text-lumex-blue">
                                    <UserIcon /> Log in
                                </Link>
                                <Link to="/register" className="transition-colors hover:text-lumex-blue">
                                    Register
                                </Link>
                            </>
                        )}
                        <div className="border-l border-lumex-border pl-4">
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-lumex-bg-deep text-lumex-muted transition-all hover:bg-lumex-blue/10 hover:text-lumex-blue"
                            >
                                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main nav bar */}
            <div className="mx-auto w-full max-w-container px-6">
                <div className="flex h-[68px] items-center justify-between gap-6">
                    {/* Logo */}
                    <Link to="/" onClick={closeMenus} className="group flex shrink-0 items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lumex-blue to-prism-violet shadow-md shadow-lumex-blue/25 transition-transform duration-200 group-hover:scale-105">
                            <PrismIcon />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-serif text-[1.15rem] font-bold tracking-tight text-lumex-text">
                                Prism
                            </span>
                            <span className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-lumex-blue/70">
                                Publishing
                            </span>
                        </div>
                    </Link>

                    {/* Desktop nav links */}
                    <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
                        <button
                            onClick={() => setIsExploreOpen(!isExploreOpen)}
                            aria-expanded={isExploreOpen}
                            className={[
                                'rounded-lg px-4 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.07em] transition-all duration-150',
                                isExploreOpen
                                    ? 'bg-lumex-blue text-white shadow-sm shadow-lumex-blue/20'
                                    : 'text-lumex-muted hover:bg-lumex-blue/5 hover:text-lumex-blue',
                            ].join(' ')}
                        >
                            Explore
                        </button>
                        {NAV_ITEMS.map(item => (
                            <Link
                                key={item.id}
                                to={item.id}
                                className="rounded-lg px-4 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.07em] text-lumex-muted transition-all duration-150 hover:bg-lumex-blue/5 hover:text-lumex-blue"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right cluster: search + CTA */}
                    <div className="flex items-center gap-3">
                        {/* Expanding search — desktop */}
                        <div className="hidden xl:block">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    ref={searchRef}
                                    type="search"
                                    placeholder="Search articles, journals…"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
                                    onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                                    className={[
                                        'rounded-xl border border-lumex-border bg-lumex-bg-deep/60 py-2 pl-9 pr-3 text-sm text-lumex-text outline-none',
                                        'placeholder:text-lumex-sub/50 transition-all duration-300',
                                        'focus:border-lumex-blue focus:bg-lumex-bg-white focus:ring-2 focus:ring-lumex-blue/15',
                                        'hover:border-lumex-border-hover',
                                        isSearchExpanded ? 'w-[280px]' : 'w-[200px]',
                                    ].join(' ')}
                                    onFocus={expandSearch}
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lumex-sub">
                                    <SearchIcon />
                                </span>
                            </form>
                        </div>

                        {/* Submit Paper CTA */}
                        <button
                            onClick={() => void navigate('/publish')}
                            className="hidden rounded-xl bg-lumex-blue px-5 py-2 text-[0.8rem] font-bold uppercase tracking-wider text-white shadow-md shadow-lumex-blue/20 transition-all duration-150 hover:-translate-y-px hover:bg-lumex-blue-dark hover:shadow-lg active:translate-y-0 xl:block"
                        >
                            Submit Paper
                        </button>

                        {/* Mobile controls */}
                        <div className="flex items-center gap-0.5 xl:hidden">
                            <button
                                aria-label="Search"
                                className="rounded-lg p-2 text-lumex-muted transition-colors hover:bg-lumex-blue/5 hover:text-lumex-blue"
                                onClick={() => void navigate('/search')}
                            >
                                <SearchIcon />
                            </button>
                            <button
                                aria-label="Toggle theme"
                                className="rounded-lg p-2 text-lumex-muted transition-colors hover:bg-lumex-blue/5 hover:text-lumex-blue"
                                onClick={toggleTheme}
                            >
                                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                            </button>
                            <button
                                aria-expanded={isMobileMenuOpen}
                                aria-label="Toggle menu"
                                className="rounded-lg p-2 text-lumex-muted transition-colors hover:bg-lumex-blue/5 hover:text-lumex-blue"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <XIcon /> : <BarsIcon />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mega Menu */}
            <MegaMenu isOpen={isExploreOpen || isMobileMenuOpen} onClose={closeMenus} />
        </header>
    );
}
