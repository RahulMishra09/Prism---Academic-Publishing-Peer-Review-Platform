import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Shared/UI/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        required: { control: 'boolean' },
        fullWidth: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text here...',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Email Address',
        placeholder: 'name@example.com',
        type: 'email',
    },
};

export const WithHelperText: Story = {
    args: {
        label: 'Password',
        type: 'password',
        helperText: 'Must be at least 8 characters long.',
    },
};

export const WithError: Story = {
    args: {
        label: 'Username',
        defaultValue: 'spring',
        error: 'Username is already taken.',
    },
};

export const Required: Story = {
    args: {
        label: 'First Name',
        required: true,
    },
};

export const Disabled: Story = {
    args: {
        label: 'Disabled Input',
        disabled: true,
        defaultValue: 'Cannot edit this',
    },
};
