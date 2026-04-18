import type { Meta, StoryObj } from '@storybook/react';
import { GlobalHeader } from './GlobalHeader';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof GlobalHeader> = {
    title: 'Widgets/GlobalHeader',
    component: GlobalHeader,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        Story => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof GlobalHeader>;

export const Default: Story = {};
