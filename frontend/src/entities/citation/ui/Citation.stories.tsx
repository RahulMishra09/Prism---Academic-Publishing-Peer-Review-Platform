import type { Meta, StoryObj } from '@storybook/react';
import { CitationDisplay, ReferenceItem } from './index';

export default {
    title: 'Entities/Citation',
    component: CitationDisplay,
} satisfies Meta<typeof CitationDisplay>;

type Story = StoryObj<typeof CitationDisplay>;

const mockArticle = {
    id: 'a1',
    doi: '10.1007/s00285-024-02112-3',
    title: 'Spatiotemporal dynamics of predator-prey systems with Allee effects',
    authors: [
        {
            id: '1',
            name: 'Sarah Chen',
            firstName: 'Sarah',
            lastName: 'Chen',
            isCorresponding: true,
            affiliations: [],
        },
    ],
    abstract: [],
    keywords: [],
    articleType: 'research-article' as const,
    accessLevel: 'open_access' as const,
    journalSlug: 'journal-of-mathematical-biology',
    journalTitle: 'Journal of Mathematical Biology',
    journalISSN: '1234-5678',
    publishedDate: '2024-03-15T00:00:00Z',
    volume: '88',
    issue: '4',
    pages: '1-34',
    language: 'en',
};

export const Display: Story = {
    args: {
        article: mockArticle,
    },
};

export const Reference = {
    render: () => (
        <ReferenceItem
            reference={{
                id: 'r1',
                index: 1,
                rawText:
                    'Turing, A. (1952). The chemical basis of morphogenesis. Philosophical Transactions of the Royal Society of London.',
                authors: ['Turing, A.'],
                year: 1952,
                title: 'The chemical basis of morphogenesis',
                journal: 'Philosophical Transactions of the Royal Society of London',
                url: 'https://royalsocietypublishing.org/doi/10.1098/rstb.1952.0012',
                volume: '237',
                issue: '641',
                pages: '37-72',
                type: 'journal',
            }}
        />
    ),
};
