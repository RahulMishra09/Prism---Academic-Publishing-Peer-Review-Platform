import type { Meta, StoryObj } from '@storybook/react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from './Select';

const meta: Meta<typeof Select> = {
    title: 'Shared/UI/Select',
    component: Select,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    render: () => (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Subjects</SelectLabel>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

export const WithError: Story = {
    render: () => (
        <Select>
            <SelectTrigger className="w-[180px]" error>
                <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Select disabled>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
};
