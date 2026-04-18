import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
    title: 'Shared/UI/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
    args: { value: 60 },
};

export const Animated: Story = {
    render: () => {
        const AnimatedProgress = () => {
            const [progress, setProgress] = useState(13);

            useEffect(() => {
                const timer = setTimeout(() => setProgress(66), 500);
                return () => clearTimeout(timer);
            }, []);

            return <ProgressBar value={progress} className="w-[60%]" />;
        };
        return <AnimatedProgress />;
    },
};
