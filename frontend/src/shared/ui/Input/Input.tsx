import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    inputClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, fullWidth = false, inputClassName, id, required, ...props }, ref) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full', className)}>
                {label && (
                    <label htmlFor={inputId} className="text-sm font-semibold text-lumex-text">
                        {label} {required && <span className="text-lumex-red">*</span>}
                    </label>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    required={required}
                    className={clsx(
                        'flex h-10 w-full rounded-md border border-lumex-border bg-lumex-bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-lumex-blue-soft focus:border-lumex-blue',
                        'placeholder:text-lumex-muted focus-visible:outline-none focus-visible:ring-2',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error
                            ? 'border-lumex-red focus-visible:ring-lumex-red'
                            : 'border-lumex-border focus-visible:ring-lumex-blue',
                        inputClassName
                    )}
                    {...props}
                />
                {(error || helperText) && (
                    <p
                        className={clsx(
                            'text-sm',
                            error ? 'text-lumex-red font-medium' : 'text-lumex-muted'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
