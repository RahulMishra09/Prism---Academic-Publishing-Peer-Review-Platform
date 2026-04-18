import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
    title: 'Shared/UI/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
    render: () => <Skeleton className="h-4 w-[250px]" />,
};
export const Circle: Story = {
    render: () => <Skeleton className="h-12 w-12 rounded-full" />,
};
export const Card: Story = {
    render: () => (
        <div className="space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    ),
};
