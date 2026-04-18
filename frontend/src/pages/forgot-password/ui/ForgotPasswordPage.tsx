import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ForgotPasswordPageProps { }

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = () => {
    const [email, setEmail] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setIsLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-lumex-bg-light py-16 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white border border-lumex-border rounded-xl p-8 shadow-sm">
                    {submitted ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.12 1.2 2 2 0 012.11.03h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l.53-.53a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-lumex-text mb-2">
                                Check your email
                            </h2>
                            <p className="text-lumex-muted text-sm mb-6">
                                If an account exists for <strong>{email}</strong>, we've sent a
                                password reset link.
                            </p>
                            <button
                                onClick={() => void navigate('/login')}
                                className="w-full py-2.5 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors text-sm"
                            >
                                Back to sign in
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-serif font-bold text-lumex-text mb-1">
                                Reset password
                            </h1>
                            <p className="text-lumex-muted text-sm mb-6">
                                Enter your email address and we'll send you a link to reset your
                                password.
                            </p>
                            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
                                <div>
                                    <label
                                        htmlFor="reset-email"
                                        className="block text-sm font-semibold text-lumex-text mb-1.5"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue transition ${error ? 'border-red-400 bg-red-50' : 'border-lumex-border'}`}
                                        placeholder="you@example.com"
                                    />
                                    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors disabled:opacity-60 text-sm"
                                >
                                    {isLoading ? 'Sending…' : 'Send reset link'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-lumex-muted mt-6">
                                Remember your password?{' '}
                                <Link
                                    to="/login"
                                    className="text-lumex-blue underline hover:text-lumex-blue-dark font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
