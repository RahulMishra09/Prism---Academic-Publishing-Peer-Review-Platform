import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../../features/user';

const PrismMark = () => (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polygon points="16,3 29,27 3,27" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="16" cy="3" r="1.5" fill="currentColor" opacity="0.9" />
        <line x1="29" y1="27" x2="33" y2="23" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="27" x2="33" y2="27" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="27" x2="32" y2="31" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    return (
        <div className="flex min-h-[85vh] items-center justify-center bg-lumex-bg-deep px-4 py-14">
            {/* Background blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
                <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-lumex-blue/8 blur-3xl" />
                <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-prism-violet/6 blur-3xl" />
            </div>

            <div className="relative w-full max-w-[420px]">
                {/* Card */}
                <div className="rounded-2xl border border-lumex-border bg-lumex-bg-white p-8 shadow-xl">
                    {/* Brand */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <Link
                            to="/"
                            className="mb-4 flex items-center gap-2.5 text-lumex-blue no-underline"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lumex-blue to-prism-violet shadow-md">
                                <PrismMark />
                            </div>
                            <span className="font-serif text-xl font-bold tracking-tight text-lumex-text">
                                Prism
                            </span>
                        </Link>
                        <h1 className="text-xl font-bold text-lumex-text">
                            Sign in to your account
                        </h1>
                        <p className="mt-1 text-sm text-lumex-muted">
                            Access millions of peer-reviewed articles
                        </p>
                    </div>

                    <LoginForm onSuccess={() => void navigate(from, { replace: true })} />

                    <p className="mt-6 text-center text-sm text-lumex-muted">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-lumex-blue underline hover:text-lumex-blue-dark"
                        >
                            Create one free
                        </Link>
                    </p>
                </div>

                <p className="mt-5 text-center text-xs text-lumex-muted/60">
                    By signing in, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-lumex-blue">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="underline hover:text-lumex-blue">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};
