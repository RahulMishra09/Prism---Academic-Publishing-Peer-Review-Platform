/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
    Toast,
    ToastAction,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from './Toast';
import { Button } from '../Button/Button';

const useToast = () => {
    const [open, setOpen] = React.useState(false);
    return { open, setOpen };
};

const meta: Meta<typeof Toast> = {
    title: 'Shared/UI/Toast',
    component: Toast,
    parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
    render: () => {
        const { open, setOpen } = useToast();
        return (
            <ToastProvider>
                <Button onClick={() => setOpen(true)}>Show Toast</Button>
                <Toast open={open} onOpenChange={setOpen}>
                    <div className="grid gap-1">
                        <ToastTitle>Scheduled: Catch up</ToastTitle>
                        <ToastDescription>Friday, February 10, 2023 at 5:57 PM</ToastDescription>
                    </div>
                    <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
                    <ToastClose />
                </Toast>
                <ToastViewport />
            </ToastProvider>
        );
    },
};
