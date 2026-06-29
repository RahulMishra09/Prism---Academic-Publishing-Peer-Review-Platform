import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchClient, ApiError } from '../../../shared/api/base';

export const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            await fetchClient('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ token, password }),
            });
            setSuccess(true);
        } catch (err) {
            setError(
                err instanceof ApiError ? err.message
                : err instanceof Error ? err.message
                : 'Failed to reset password. The link may have expired.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-lumex-bg-light py-16 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white border border-lumex-border rounded-xl p-8 shadow-sm">
                    {success ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-lumex-text mb-2">Password reset successful</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                Your password has been updated. You can now sign in with your new password.
                            </p>
                            <button
                                onClick={() => void navigate('/login')}
                                className="w-full py-2.5 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors text-sm"
                            >
                                Sign in
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-serif font-bold text-lumex-text mb-1">
                                Set new password
                            </h1>
                            <p className="text-lumex-muted text-sm mb-6">
                                Enter your new password below.
                            </p>
                            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-semibold text-lumex-text mb-1.5">
                                        New Password
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-lumex-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue transition"
                                        placeholder="At least 6 characters"
                                        minLength={6}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-semibold text-lumex-text mb-1.5">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-lumex-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue transition"
                                        placeholder="Re-enter your password"
                                        required
                                    />
                                </div>
                                {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors disabled:opacity-60 text-sm"
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-lumex-muted mt-6">
                                <Link to="/login" className="text-lumex-blue underline hover:text-lumex-blue-dark font-medium">
                                    Back to sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
