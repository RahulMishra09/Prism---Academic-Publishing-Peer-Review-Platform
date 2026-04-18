import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
    title: 'Shared/UI/Image',
    component: Image,
};
export default meta;

export const Default: StoryObj<typeof Image> = {
    args: {
        src: 'https://placehold.co/600x400/025e8d/ffffff?text=Image+Component',
        alt: 'Example image',
        containerClassName: 'w-[400px] h-[300px] rounded-lg',
        className: 'object-cover w-full h-full',
    },
};

export const MissingFallback: StoryObj<typeof Image> = {
    args: {
        src: 'invalid-url',
        alt: 'Broken image',
        fallbackSrc: 'https://placehold.co/600x400/e8181d/ffffff?text=Fallback+Loaded',
        containerClassName: 'w-[400px] h-[300px] rounded-lg',
        className: 'object-cover w-full h-full',
    },
};
