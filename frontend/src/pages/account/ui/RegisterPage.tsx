import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../../features/user';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-lumex-bg-light py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-lumex-card rounded-xl shadow-lg border border-lumex-border p-8">
                    <div className="text-center mb-8">
                        <a
                            href="/"
                            className="inline-block text-2xl font-black tracking-tight text-lumex-blue font-serif"
                        >
                            Lumex
                        </a>
                        <h1 className="text-xl font-bold text-lumex-text mt-3">
                            Create a free account
                        </h1>
                        <p className="text-sm text-lumex-muted mt-1">
                            Join millions of researchers worldwide
                        </p>
                    </div>

                    <RegisterForm onSuccess={() => void navigate('/account')} />

                    <p className="mt-6 text-center text-sm text-lumex-muted">
                        Already have an account?{' '}
                        <Link to="/login" className="text-lumex-blue underline hover:text-lumex-blue-dark font-bold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
