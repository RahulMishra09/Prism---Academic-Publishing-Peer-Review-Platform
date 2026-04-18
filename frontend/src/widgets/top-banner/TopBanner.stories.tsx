import type { Meta, StoryObj } from '@storybook/react';
import { TopBanner } from './TopBanner';

const meta: Meta<typeof TopBanner> = {
    title: 'Widgets/TopBanner',
    component: TopBanner,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof TopBanner>;

export const Default: Story = {};
