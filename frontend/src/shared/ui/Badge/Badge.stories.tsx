import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Shared/UI/Badge',
    component: Badge,
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'Badge', variant: 'default' } };
export const OA: Story = { args: { children: 'Open Access', variant: 'oa' } };
export const Journal: Story = { args: { children: 'Journal', variant: 'journal' } };
export const Outline: Story = { args: { children: 'Outline', variant: 'outline' } };
