import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
    title: 'Shared/UI/Tag',
    component: Tag,
    tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = { args: { children: 'Keyword Tag' } };
