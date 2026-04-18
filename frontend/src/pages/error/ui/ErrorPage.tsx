import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
    const error = useRouteError() as {
        status?: number;
        statusText?: string;
        message?: string;
    } | null;
    const navigate = useNavigate();

    const is404 = error?.status === 404;

    return (
        <div className="min-h-screen flex items-center justify-center bg-lumex-bg-light py-16 px-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                <h1 className="text-2xl font-serif font-bold text-lumex-text mb-2">
                    {is404 ? 'Page Not Found' : 'Something went wrong'}
                </h1>

                <p className="text-gray-500 mb-2 text-sm">
                    {error?.status && (
                        <span className="font-mono font-bold text-red-500 mr-2">
                            {error.status}
                        </span>
                    )}
                    {error?.statusText || error?.message || 'An unexpected error occurred.'}
                </p>

                <p className="text-gray-400 text-sm mb-8">
                    {is404
                        ? "The page you're looking for doesn't exist or has been moved."
                        : 'Please try again. If the problem persists, contact support.'}
                </p>

                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => void navigate(-1)}
                        className="px-5 py-2.5 border border-lumex-border text-lumex-text text-sm font-bold rounded hover:bg-lumex-bg-light transition-colors"
                    >
                        ← Go back
                    </button>
                    <button
                        onClick={() => void navigate('/')}
                        className="px-5 py-2.5 bg-lumex-blue text-white text-sm font-bold rounded hover:bg-lumex-blue-dark transition-colors"
                    >
                        Go to homepage
                    </button>
                </div>
            </div>
        </div>
    );
};
