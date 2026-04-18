import React, { useState } from 'react';

export interface RegisterFormProps {
    onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        institution: '',
        agreeTerms: false,
    });
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        institution?: string;
        agreeTerms?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);

    const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({
            ...prev,
            [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
        }));

    const validate = () => {
        const errs: {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
            institution?: string;
            agreeTerms?: string;
        } = {};
        if (!form.firstName.trim()) errs.firstName = 'Required';
        if (!form.lastName.trim()) errs.lastName = 'Required';
        if (!form.email) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 8) errs.password = 'At least 8 characters';
        if (!form.agreeTerms) errs.agreeTerms = 'You must accept the terms';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setIsLoading(false);
        onSuccess?.();
    };

    const field = (
        id: string,
        label: string,
        type: string,
        key: keyof typeof form,
        placeholder?: string
    ) => (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-lumex-text mb-1.5">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={form[key] as string}
                onChange={set(key)}
                placeholder={placeholder}
                className={`w-full px-4 py-2.5 bg-lumex-bg-white border rounded text-sm focus:outline-none focus:ring-2 focus:ring-lumex-blue/30 focus:border-lumex-blue transition ${
                    errors[key] ? 'border-lumex-red bg-lumex-red/5' : 'border-lumex-border'
                }`}
            />
            {errors[key] && <p className="mt-1 text-xs text-lumex-red">{errors[key]}</p>}
        </div>
    );

    return (
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
                {field('reg-fname', 'First name', 'text', 'firstName', 'Jane')}
                {field('reg-lname', 'Last name', 'text', 'lastName', 'Doe')}
            </div>
            {field('reg-email', 'Email address', 'email', 'email', 'you@example.com')}
            {field('reg-password', 'Password', 'password', 'password', 'At least 8 characters')}
            {field(
                'reg-institution',
                'Institution / Organization (optional)',
                'text',
                'institution',
                'University of...'
            )}

            <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.agreeTerms}
                        onChange={set('agreeTerms')}
                        className="w-4 h-4 mt-0.5 rounded border-lumex-border text-lumex-blue focus:ring-lumex-blue"
                    />
                    <span className="text-sm text-lumex-text-secondary">
                        I agree to the{' '}
                        <a href="/terms" className="text-lumex-blue hover:underline font-medium">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                            href="/privacy"
                            className="text-lumex-blue hover:underline font-medium"
                        >
                            Privacy Policy
                        </a>
                    </span>
                </label>
                {errors.agreeTerms && (
                    <p className="mt-1 text-xs text-lumex-red">{errors.agreeTerms}</p>
                )}
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
                        Creating account…
                    </>
                ) : (
                    'Create account'
                )}
            </button>
        </form>
    );
};
