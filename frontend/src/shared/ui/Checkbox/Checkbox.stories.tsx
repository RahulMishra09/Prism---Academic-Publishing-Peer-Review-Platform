import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Shared/UI/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Accept terms and conditions
            </label>
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div className="flex items-center space-x-2">
            <Checkbox id="terms2" disabled />
            <label
                htmlFor="terms2"
                className="text-sm font-medium leading-none opacity-50 cursor-not-allowed"
            >
                Accept terms and conditions
            </label>
        </div>
    ),
};
