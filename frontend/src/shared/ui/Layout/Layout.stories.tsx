import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { Grid } from './Grid';
import { Stack } from './Stack';

const meta: Meta = {
    title: 'Shared/UI/Layout',
    tags: ['autodocs'],
};
export default meta;

export const ContainerExample: StoryObj = {
    render: () => (
        <Container className="bg-lumex-bg-light py-8">
            <p className="text-center font-bold">Inside a maximum width container</p>
        </Container>
    ),
};

export const GridExample: StoryObj = {
    render: () => (
        <Grid cols={3}>
            <div className="bg-lumex-blue text-white p-4 rounded text-center">Item 1</div>
            <div className="bg-lumex-blue text-white p-4 rounded text-center">Item 2</div>
            <div className="bg-lumex-blue text-white p-4 rounded text-center">Item 3</div>
        </Grid>
    ),
};

export const StackExample: StoryObj = {
    render: () => (
        <Stack direction="row" gap="md" align="center">
            <div className="bg-lumex-bg-light p-4 rounded border border-lumex-border">
                Flex 1
            </div>
            <div className="bg-lumex-bg-light p-4 rounded border border-lumex-border">
                Flex 2
            </div>
        </Stack>
    ),
};
