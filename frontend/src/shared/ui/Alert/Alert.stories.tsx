import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
    title: 'Shared/UI/Alert',
    component: Alert,
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
    args: { variant: 'info', title: 'Did you know?', children: 'This is an informational alert.' },
};
export const Success: Story = {
    args: { variant: 'success', title: 'Success!', children: 'Your action was successful.' },
};
export const Warning: Story = {
    args: { variant: 'warning', title: 'Warning!', children: 'Please be careful with this.' },
};
export const Error: Story = {
    args: { variant: 'error', title: 'Error!', children: 'Something went incredibly wrong.' },
};
