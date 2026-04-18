import type { Meta, StoryObj } from '@storybook/react';
import { BookCard, ChapterCard } from './index';

export default {
    title: 'Entities/Book',
    component: BookCard,
} satisfies Meta<typeof BookCard>;

type Story = StoryObj<typeof BookCard>;

const mockBook = {
    id: 'b1',
    doi: '10.1007/978-3-031',
    isbn: '978-3-031',
    title: 'Introduction to Mathematical Biology',
    subtitle: 'A Modern Approach',
    authors: [
        {
            id: '1',
            name: 'Alan Turing',
            firstName: 'Alan',
            lastName: 'Turing',
            isCorresponding: false,
            affiliations: [],
        },
    ],
    publisher: 'Lumex',
    publishYear: 2023,
    type: 'monograph' as const,
};

export const Card: Story = {
    args: {
        book: mockBook,
    },
};

export const Chapter = {
    render: () => (
        <ChapterCard
            chapter={{
                id: 'c1',
                doi: '10.1007/978-3-031_1',
                title: 'The Reaction-Diffusion System',
                bookTitle: 'Introduction to Mathematical Biology',
                bookDoi: '10.1007/978-3-031',
                authors: [
                    {
                        id: '1',
                        name: 'Alan Turing',
                        firstName: 'Alan',
                        lastName: 'Turing',
                        isCorresponding: false,
                        affiliations: [],
                    },
                ],
                pages: '1-45',
                publishYear: 2023,
            }}
        />
    ),
};
