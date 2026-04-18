import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../../../features/user';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-lumex-bg-light py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-lumex-card rounded-xl shadow-lg border border-lumex-border p-8">
                    {/* Logo area */}
                    <div className="text-center mb-8">
                        <a
                            href="/"
                            className="inline-block text-2xl font-black tracking-tight text-lumex-blue font-serif"
                        >
                            Lumex
                        </a>
                        <h1 className="text-xl font-bold text-lumex-text mt-3">
                            Sign in to your account
                        </h1>
                        <p className="text-sm text-lumex-muted mt-1">
                            Access millions of scientific articles and books
                        </p>
                    </div>

                    <LoginForm onSuccess={() => void navigate(from, { replace: true })} />

                    <p className="mt-6 text-center text-sm text-lumex-muted">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-lumex-blue underline hover:text-lumex-blue-dark font-bold"
                        >
                            Create one for free
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-lumex-muted">
                    By signing in, you agree to our{' '}
                    <a href="/terms" className="underline hover:text-lumex-blue font-medium">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="underline hover:text-lumex-blue font-medium">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};
