import type { Meta, StoryObj } from '@storybook/react';
import { JournalCard, IssueCard, JournalBadge } from './index';

export default {
    title: 'Entities/Journal',
    component: JournalCard,
} satisfies Meta<typeof JournalCard>;

type Story = StoryObj<typeof JournalCard>;

const mockJournal = {
    id: 'j1',
    slug: 'test-journal',
    title: 'Journal of Mathematical Biology',
    electronicISSN: '1432-1416',
    printISSN: '0303-6812',
    publisher: 'Lumex',
    accessType: 'hybrid' as const,
    discipline: ['Mathematics', 'Biology'],
    description: 'The Journal of Mathematical Biology focuses on mathematical biology...',
    aimsAndScope: '<p>Test</p>',
    language: ['English'],
    metrics: { impactFactor: 2.6, impactFactorYear: 2023, citeScore: 5.2, quartile: 'Q1' as const },
};

export const Card: Story = {
    args: {
        journal: mockJournal,
    },
};

export const Issue = {
    render: () => (
        <IssueCard
            journalTitle="Journal of Mathematical Biology"
            issue={{
                id: '1',
                journalSlug: 'test-journal',
                volume: 88,
                issue: 4,
                year: 2024,
                month: 3,
                publishedDate: '',
                articleCount: 15,
            }}
        />
    ),
};

export const Badges = {
    render: () => (
        <div className="flex gap-4">
            <JournalBadge type="access" accessType="gold_oa" />
            <JournalBadge type="access" accessType="hybrid" />
            <JournalBadge type="quartile" quartile="Q1" />
            <JournalBadge type="quartile" quartile="Q2" />
        </div>
    ),
};
