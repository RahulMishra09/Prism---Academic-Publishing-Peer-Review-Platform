import type { Meta, StoryObj } from '@storybook/react';
import { GlobalFooter } from './GlobalFooter';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof GlobalFooter> = {
    title: 'Widgets/GlobalFooter',
    component: GlobalFooter,
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
type Story = StoryObj<typeof GlobalFooter>;

export const Default: Story = {};
