import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchClient, ApiError } from '../../../shared/api/base';

type VerifyState = 'loading' | 'success' | 'error' | 'no-token';

export const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [state, setState] = useState<VerifyState>(token ? 'loading' : 'no-token');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!token) return;

        let cancelled = false;

        const verify = async () => {
            try {
                await fetchClient('/auth/verify-email', {
                    method: 'POST',
                    body: JSON.stringify({ token }),
                });
                if (!cancelled) setState('success');
            } catch (err) {
                if (cancelled) return;
                setState('error');
                setErrorMsg(
                    err instanceof ApiError ? err.message
                    : err instanceof Error ? err.message
                    : 'Verification failed. The link may have expired.'
                );
            }
        };

        void verify();
        return () => { cancelled = true; };
    }, [token]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-lumex-bg-light py-16 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white border border-lumex-border rounded-xl p-8 shadow-sm text-center">
                    {state === 'loading' && (
                        <>
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="animate-spin h-7 w-7 text-lumex-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-lumex-text mb-2">Verifying your email...</h2>
                            <p className="text-gray-500 text-sm">Please wait while we confirm your email address.</p>
                        </>
                    )}

                    {state === 'success' && (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-lumex-text mb-2">Email verified</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                Your email has been successfully verified. You can now access all features of your account.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block w-full py-2.5 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors text-sm"
                            >
                                Sign in
                            </Link>
                        </>
                    )}

                    {state === 'error' && (
                        <>
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-lumex-text mb-2">Verification failed</h2>
                            <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
                            <Link
                                to="/login"
                                className="inline-block w-full py-2.5 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors text-sm"
                            >
                                Back to sign in
                            </Link>
                        </>
                    )}

                    {state === 'no-token' && (
                        <>
                            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-lumex-text mb-2">Invalid verification link</h2>
                            <p className="text-gray-500 text-sm mb-6">
                                This link is missing or invalid. Please check the verification email you received and try again.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block w-full py-2.5 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors text-sm"
                            >
                                Back to sign in
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
