import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Container } from '@shared/ui';

export interface TwoColumnLayoutProps {
    main: ReactNode;
    sidebar: ReactNode;
    sidebarPosition?: 'left' | 'right';
    className?: string;
}

export function TwoColumnLayout({
    main,
    sidebar,
    sidebarPosition = 'right',
    className,
}: TwoColumnLayoutProps) {
    return (
        <Container className={clsx('py-8', className)}>
            <div
                className={clsx(
                    'flex flex-col gap-8',
                    sidebarPosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'
                )}
            >
                {/* Main Content Area */}
                <div className="flex-1 w-full min-w-0">{main}</div>

                {/* Sidebar Area */}
                <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 h-fit">{sidebar}</aside>
            </div>
        </Container>
    );
}
