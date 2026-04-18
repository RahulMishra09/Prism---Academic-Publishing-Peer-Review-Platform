import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    inputClassName?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            fullWidth = false,
            inputClassName,
            leftIcon,
            rightIcon,
            id,
            required,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        return (
            <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-lumex-text"
                    >
                        {label}
                        {required && <span className="ml-0.5 text-lumex-red">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lumex-muted">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        required={required}
                        className={clsx(
                            'flex h-9 w-full rounded-lg border bg-lumex-bg-white px-3 py-2 text-sm text-lumex-text',
                            'placeholder:text-lumex-sub',
                            'transition-all duration-150',
                            'focus:outline-none focus:ring-2 focus:ring-offset-0',
                            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-lumex-bg-deep',
                            leftIcon && 'pl-9',
                            rightIcon && 'pr-9',
                            error
                                ? 'border-lumex-red focus:border-lumex-red focus:ring-lumex-red/20'
                                : 'border-lumex-border focus:border-lumex-blue focus:ring-lumex-blue/15 hover:border-lumex-border-hover',
                            inputClassName
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lumex-muted">
                            {rightIcon}
                        </span>
                    )}
                </div>

                {(error || helperText) && (
                    <p
                        className={clsx(
                            'text-xs leading-relaxed',
                            error ? 'text-lumex-red' : 'text-lumex-muted'
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
