import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-lumex-bg-light py-16 px-4">
            <div className="text-center max-w-lg">
                {/* Big 404 */}
                <div className="relative mb-8">
                    <div className="text-[10rem] font-black text-lumex-blue/10 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-lumex-blue/50"
                        >
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-serif font-bold text-lumex-text mb-3">
                    Page not found
                </h1>
                <p className="text-lumex-muted mb-8 leading-relaxed">
                    The page you're looking for may have moved or no longer exists. Try searching
                    for what you need using the search bar below.
                </p>

                {/* Inline Search */}
                <div className="flex gap-2 mb-6 max-w-sm mx-auto">
                    <input
                        type="search"
                        placeholder="Search articles, journals, books…"
                        className="flex-1 px-4 py-2.5 border border-lumex-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30"
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                const val = (e.target as HTMLInputElement).value.trim();
                                if (val) void navigate(`/search?query=${encodeURIComponent(val)}`);
                            }
                        }}
                    />
                    <button
                        className="px-4 py-2.5 bg-lumex-blue text-white text-sm font-bold rounded hover:bg-lumex-blue-dark transition-colors"
                        onClick={e => {
                            const input = e.currentTarget.previousSibling as HTMLInputElement;
                            const val = input?.value.trim();
                            if (val) void navigate(`/search?query=${encodeURIComponent(val)}`);
                        }}
                    >
                        Search
                    </button>
                </div>

                {/* Quick links */}
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                    <Link to="/" className="text-lumex-blue hover:underline font-medium">
                        ← Home
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/search" className="text-lumex-blue hover:underline font-medium">
                        Browse articles
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/login" className="text-lumex-blue hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};
