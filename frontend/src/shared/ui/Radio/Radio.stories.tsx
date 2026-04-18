import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './Radio';

const meta: Meta<typeof RadioGroup> = {
    title: 'Shared/UI/Radio',
    component: RadioGroup,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue="open-access">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="open-access" id="r1" />
                <label htmlFor="r1" className="text-sm">
                    Open Access
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="subscription" id="r2" />
                <label htmlFor="r2" className="text-sm">
                    Subscription
                </label>
            </div>
        </RadioGroup>
    ),
};
