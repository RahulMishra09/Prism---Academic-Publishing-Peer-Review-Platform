import type { Meta, StoryObj } from '@storybook/react';
import { ArticleCard, ArticleCardFull, ArticleBadge } from './index';

export default {
    title: 'Entities/Article',
    component: ArticleCard,
} satisfies Meta<typeof ArticleCard>;

type Story = StoryObj<typeof ArticleCard>;

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
        {
            id: '2',
            name: 'John Doe',
            firstName: 'John',
            lastName: 'Doe',
            isCorresponding: false,
            affiliations: [],
        },
        {
            id: '3',
            name: 'Jane Smith',
            firstName: 'Jane',
            lastName: 'Smith',
            isCorresponding: false,
            affiliations: [],
        },
    ],
    abstract: [{ text: 'This is a mock abstract demonstrating the layout.' }],
    keywords: ['Predator-prey', 'Allee effect', 'Biology', 'Mathematics'],
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
    metrics: { citations: 10, downloads: 100 },
};

export const Card: Story = {
    args: {
        article: mockArticle,
    },
};

export const CardFull = {
    render: () => (
        <div className="max-w-4xl">
            <ArticleCardFull article={mockArticle} />
        </div>
    ),
};

export const Badges = {
    render: () => (
        <div className="flex gap-4">
            <ArticleBadge type="access" accessLevel="open_access" />
            <ArticleBadge type="article-type" articleType="research-article" />
            <ArticleBadge type="access" accessLevel="free_to_read" />
            <ArticleBadge type="access" accessLevel="subscribed" />
        </div>
    ),
};
