import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Skeleton } from '../Skeleton/Skeleton';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    containerClassName?: string;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
    ({ className, containerClassName, alt = '', fallbackSrc, src, ...props }, ref) => {
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);

        const handleLoad = () => setIsLoading(false);
        const handleError = () => {
            setIsLoading(false);
            setHasError(true);
        };

        const finalSrc = hasError && fallbackSrc ? fallbackSrc : src;

        return (
            <div className={clsx('relative overflow-hidden', containerClassName)}>
                {isLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
                <img
                    ref={ref}
                    src={finalSrc}
                    alt={alt}
                    onLoad={handleLoad}
                    onError={handleError}
                    className={clsx(
                        'transition-opacity duration-300',
                        isLoading ? 'opacity-0' : 'opacity-100',
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);
Image.displayName = 'Image';
