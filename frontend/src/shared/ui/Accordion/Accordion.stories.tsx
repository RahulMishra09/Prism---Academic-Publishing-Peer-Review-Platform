import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

const meta: Meta<typeof Accordion> = {
    title: 'Shared/UI/Accordion',
    component: Accordion,
};
export default meta;

export const Default: StoryObj<typeof Accordion> = {
    render: () => (
        <Accordion type="single" collapsible className="w-[400px]">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with default styles that matches the other components' aesthetic.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};
