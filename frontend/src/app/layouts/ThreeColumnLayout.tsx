import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Container } from '@shared/ui';

export interface ThreeColumnLayoutProps {
    leftSidebar: ReactNode;
    main: ReactNode;
    rightSidebar: ReactNode;
    className?: string;
}

export function ThreeColumnLayout({
    leftSidebar,
    main,
    rightSidebar,
    className,
}: ThreeColumnLayoutProps) {
    return (
        <Container className={clsx('py-8', className)}>
            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Left Sidebar */}
                <aside className="w-full lg:w-[240px] xl:w-[280px] shrink-0 order-2 lg:order-1">
                    {leftSidebar}
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 w-full min-w-0 order-1 lg:order-2">{main}</div>

                {/* Right Sidebar */}
                <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 order-3 lg:order-3">
                    {rightSidebar}
                </aside>
            </div>
        </Container>
    );
}
