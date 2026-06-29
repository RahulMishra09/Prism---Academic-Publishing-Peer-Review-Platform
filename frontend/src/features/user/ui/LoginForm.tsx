import React, { useState } from 'react';
import { useAuthStore } from '../../../app/store/useAuthStore';

export interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const { login, isLoading, error: storeError, clearError } = useAuthStore();

    const validate = () => {
        const errs: typeof fieldErrors = {};
        if (!email) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            return;
        }
        setFieldErrors({});
        await login({ email, password, rememberMe });

        // If the store has no error after login, it succeeded
        const currentError = useAuthStore.getState().error;
        if (!currentError) {
            onSuccess?.();
        }
    };

    return (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5" noValidate>
            {/* Dev-mode credential hint */}
            {import.meta.env.DEV && (
                <div className="rounded-md bg-lumex-accent-soft border border-lumex-accent/20 px-4 py-3 text-sm text-lumex-accent">
                    <strong>Dev credentials:</strong>{' '}
                    <code className="bg-lumex-accent/10 px-1 rounded">test@lumex.com</code> /{' '}
                    <code className="bg-lumex-accent/10 px-1 rounded">password</code>
                </div>
            )}
            <div>
                <label
                    htmlFor="login-email"
                    className="block text-sm font-semibold text-lumex-text mb-1.5"
                >
                    Email address
                </label>
                <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-lumex-bg-white border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue transition ${fieldErrors.email ? 'border-lumex-red bg-lumex-red/5' : 'border-lumex-border'
                        }`}
                    placeholder="you@example.com"
                />
                {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            <div>
                <div className="flex justify-between mb-1.5">
                    <label
                        htmlFor="login-password"
                        className="block text-sm font-semibold text-lumex-text"
                    >
                        Password
                    </label>
                    <a
                        href="/forgot-password"
                        className="text-xs text-lumex-blue underline hover:text-lumex-blue-dark font-medium"
                    >
                        Forgot password?
                    </a>
                </div>
                <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 bg-lumex-bg-white border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue transition ${fieldErrors.password ? 'border-lumex-red bg-lumex-red/5' : 'border-lumex-border'
                        }`}
                    placeholder="••••••••"
                />
                {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
            </div>

            <div className="flex items-center gap-2">
                <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-lumex-blue focus:ring-lumex-blue"
                />
                <label htmlFor="remember-me" className="text-sm text-lumex-muted cursor-pointer">
                    Keep me signed in
                </label>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Signing in…
                    </>
                ) : (
                    'Sign in'
                )}
            </button>

            {storeError && (
                <div className="rounded-md bg-lumex-red/10 border border-lumex-red/20 px-4 py-3 text-sm text-lumex-red" role="alert">
                    {storeError}
                </div>
            )}

            <div className="relative text-center text-sm text-lumex-muted">
                <span className="px-2 bg-lumex-bg-white relative z-10">or sign in with</span>
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-lumex-bg-white border border-lumex-border rounded text-sm font-medium text-lumex-text hover:bg-lumex-bg-deep transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google
                </button>
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-lumex-bg-white border border-lumex-border rounded text-sm font-medium text-lumex-text hover:bg-lumex-bg-deep transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 23 23"
                    >
                        <path fill="#f35325" d="M1 1h10v10H1z" />
                        <path fill="#81bc06" d="M12 1h10v10H12z" />
                        <path fill="#05a6f0" d="M1 12h10v10H1z" />
                        <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                    Microsoft
                </button>
            </div>
        </form>
    );
};
