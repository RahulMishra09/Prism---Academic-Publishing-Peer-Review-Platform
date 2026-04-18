import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MegaMenu } from './MegaMenu';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof MegaMenu> = {
    title: 'Widgets/MegaMenu',
    component: MegaMenu,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        Story => (
            <BrowserRouter>
                <div className="relative w-full h-screen bg-gray-100">
                    <header className="h-16 bg-white border-b flex items-center px-8 relative z-50">
                        <h1 className="font-bold">Dummy Header</h1>
                    </header>
                    <Story />
                </div>
            </BrowserRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof MegaMenu>;

export const Default: Story = {
    render: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isOpen, setIsOpen] = useState(true);
        return <MegaMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />;
    },
};
