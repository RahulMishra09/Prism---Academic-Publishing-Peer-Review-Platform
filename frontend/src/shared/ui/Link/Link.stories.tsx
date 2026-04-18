import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof Link> = {
    title: 'Shared/UI/Link',
    component: Link,
    decorators: [
        Story => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        ),
    ],
};
export default meta;

export const Default: StoryObj<typeof Link> = {
    args: {
        to: '/example',
        children: 'Internal Router Link',
        variant: 'default',
    },
};

export const External: StoryObj<typeof Link> = {
    args: {
        to: 'https://lumex.com',
        children: 'External Web Link',
        external: true,
    },
};
