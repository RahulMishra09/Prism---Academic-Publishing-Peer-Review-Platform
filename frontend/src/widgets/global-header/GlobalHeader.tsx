import { useState } from 'react';
import { Link } from '@shared/ui';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { MegaMenu } from '../mega-menu/MegaMenu';
import { useAuthStore } from '../../app/store/useAuthStore';
import { useThemeStore } from '../../entities/theme/model/useThemeStore';

export function GlobalHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    const handleSearch = (e: React.KeyboardEvent | React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            void navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsMobileMenuOpen(false);
        }
    };

    const closeMenus = () => {
        setIsMobileMenuOpen(false);
        setIsExploreOpen(false);
    };

    const NAV_ITEMS = [
        { id: '/', label: 'Home' },
        { id: '/journals', label: 'Journals' },
        { id: '/about', label: 'About' },
    ];

    return (
        <header className="relative z-50 w-full border-b border-lumex-border bg-lumex-bg-white shadow-sm transition-colors duration-200">
            {/* Desktop utility bar */}
            <div className="hidden w-full lg:block border-b border-lumex-border/50">
                <div className="mx-auto flex w-full max-w-container justify-end px-6">
                    <nav
                        aria-label="Utility navigation"
                        className="flex items-center gap-6 py-1.5 text-[0.7rem] uppercase tracking-wider font-bold"
                    >
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-5">
                                <span className="flex items-center gap-2 text-lumex-text">
                                    <div className="w-5 h-5 rounded-full bg-lumex-blue/10 flex items-center justify-center text-lumex-blue">
                                        <FaUser size={10} />
                                    </div>
                                    <span className="opacity-70">Hi,</span> {user.firstName}
                                </span>
                                <Link
                                    to="/account"
                                    className="text-lumex-muted hover:text-lumex-blue transition-colors"
                                >
                                    My Account
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="flex items-center gap-1.5 text-lumex-muted hover:text-lumex-blue transition-colors"
                                >
                                    <FaSignOutAlt size={11} /> Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-5">
                                <Link
                                    to="/login"
                                    className="flex items-center gap-1.5 text-lumex-muted hover:text-lumex-blue transition-colors"
                                >
                                    <FaUser size={11} /> Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-lumex-muted hover:text-lumex-blue transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        <div className="ml-2 border-l border-lumex-border pl-4">
                            <button
                                onClick={toggleTheme}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-lumex-bg-deep text-lumex-muted transition-all hover:scale-110 hover:bg-lumex-blue-soft hover:text-lumex-blue"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <FaMoon size={12} /> : <FaSun size={12} />}
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main navigation bar */}
            <div className="mx-auto w-full max-w-container px-6">
                <div className="flex h-[72px] items-center justify-between">
                    {/* Logo & Nav */}
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <Link to="/" onClick={closeMenus} className="group flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lumex-blue shadow-lg shadow-lumex-blue/20 transition-transform group-hover:scale-105">
                                <span className="font-serif text-lg font-black italic text-white">
                                    L
                                </span>
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="font-serif text-xl font-extrabold text-lumex-text tracking-tight">
                                    Lumex
                                </span>
                                <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-lumex-blue/80">
                                    Research
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-1.5 xl:flex">
                            <button
                                onClick={() => setIsExploreOpen(!isExploreOpen)}
                                className={`rounded-lg px-4 py-2 text-[0.82rem] font-bold uppercase tracking-[0.08em] transition-all ${isExploreOpen
                                    ? 'bg-lumex-blue text-white shadow-md shadow-lumex-blue/20'
                                    : 'text-lumex-muted hover:text-lumex-blue'
                                    }`}
                                aria-expanded={isExploreOpen}
                            >
                                Explore
                            </button>
                            {NAV_ITEMS.map(item => (
                                <Link
                                    key={item.id}
                                    to={item.id}
                                    className="rounded-lg px-4 py-2 text-[0.82rem] font-bold uppercase tracking-[0.08em] text-lumex-muted transition-all hover:text-lumex-blue hover:bg-lumex-blue/5"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right side: search + CTA */}
                    <div className="flex items-center gap-4">
                        {/* Search (Desktop) */}
                        <div className="hidden xl:block">
                            <form onSubmit={handleSearch} className="relative group">
                                <input
                                    type="search"
                                    placeholder="Quick search…"
                                    className="w-[260px] rounded-xl border border-lumex-border bg-lumex-card py-2.5 pl-10 pr-4 text-sm text-lumex-text outline-none transition-all placeholder:text-lumex-sub/60 focus:border-lumex-blue focus:ring-4 focus:ring-lumex-blue/10 group-hover:border-lumex-border-hover shadow-sm"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
                                />
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lumex-sub transition-colors group-focus-within:text-lumex-blue">
                                    <FaSearch size={13} />
                                </span>
                            </form>
                        </div>

                        {/* Submit Paper CTA */}
                        <button
                            className="hidden premium-button rounded-xl bg-lumex-blue px-6 py-2.5 text-[0.82rem] font-bold uppercase tracking-wider text-white shadow-lg shadow-lumex-blue/20 transition-all hover:-translate-y-0.5 hover:bg-lumex-blue-dark active:translate-y-0 xl:block"
                            onClick={() => void navigate('/publish')}
                        >
                            Submit Paper
                        </button>

                        {/* Mobile hamburger */}
                        <div className="flex items-center gap-1 xl:hidden">
                            <button
                                className="p-2.5 text-lumex-muted hover:text-lumex-blue transition-colors"
                                aria-label="Search"
                                onClick={() => void navigate('/search')}
                            >
                                <FaSearch size={18} />
                            </button>
                            <button
                                className="p-2.5 text-lumex-muted hover:text-lumex-blue transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-expanded={isMobileMenuOpen}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <FaTimes size={22} />
                                ) : (
                                    <FaBars size={22} />
                                )}
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 text-lumex-muted hover:text-lumex-blue transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mega Menu Dropdown */}
            <MegaMenu isOpen={isExploreOpen || isMobileMenuOpen} onClose={closeMenus} />
        </header>
    );
}
