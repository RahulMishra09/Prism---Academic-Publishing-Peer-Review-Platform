import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Container } from '../../../shared/ui';
import { fetchClient } from '../../../shared/api/base';

interface Career {
    id: string;
    title: string;
    department?: string;
    location?: string;
    type?: string;
    description?: string;
    slug?: string;
    createdAt?: string;
}

const MOCK_CAREERS: Career[] = [
    { id: '1', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Help build the next generation of academic publishing tools.', slug: 'senior-frontend-engineer' },
    { id: '2', title: 'Editorial Operations Manager', department: 'Editorial', location: 'New York, NY', type: 'Full-time', description: 'Lead editorial workflow optimization and manage peer review processes.', slug: 'editorial-ops-manager' },
    { id: '3', title: 'Data Scientist — Research Metrics', department: 'Data', location: 'Remote', type: 'Full-time', description: 'Develop citation analytics and impact measurement systems for academic research.', slug: 'data-scientist-metrics' },
    { id: '4', title: 'Product Designer', department: 'Design', location: 'London, UK', type: 'Full-time', description: 'Design intuitive interfaces for researchers, editors, and reviewers.', slug: 'product-designer' },
];

export const CareersPage: React.FC = () => {
    const { data: careers, isLoading } = useQuery({
        queryKey: ['careers'],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Career[] }>('/careers');
                return res.data;
            } catch {
                return MOCK_CAREERS;
            }
        },
    });

    const listings = careers || MOCK_CAREERS;

    return (
        <div className="py-12 bg-lumex-bg min-h-[70vh]">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl font-serif font-bold text-lumex-text mb-4">
                            Careers at Lumex
                        </h1>
                        <p className="text-lg text-lumex-muted leading-relaxed max-w-2xl mx-auto">
                            Join our mission to advance scientific discovery. We're building the future of academic publishing.
                        </p>
                    </header>

                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lumex-blue" />
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-16 bg-lumex-card border border-lumex-border rounded-xl">
                            <h2 className="text-xl font-bold text-lumex-text mb-2">No open positions</h2>
                            <p className="text-lumex-muted">Check back soon — we're always growing.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {listings.map((job) => (
                                <div
                                    key={job.id}
                                    className="bg-lumex-card border border-lumex-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-lumex-blue/30 transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h2 className="text-lg font-bold text-lumex-text mb-1">{job.title}</h2>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-lumex-muted mb-3">
                                                {job.department && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-lumex-blue" />
                                                        {job.department}
                                                    </span>
                                                )}
                                                {job.location && <span>{job.location}</span>}
                                                {job.type && (
                                                    <span className="text-xs font-bold bg-lumex-bg-deep px-2 py-0.5 rounded-full">
                                                        {job.type}
                                                    </span>
                                                )}
                                            </div>
                                            {job.description && (
                                                <p className="text-sm text-lumex-text-secondary leading-relaxed">
                                                    {job.description}
                                                </p>
                                            )}
                                        </div>
                                        <Link
                                            to={`/careers/${job.id}`}
                                            className="shrink-0 px-5 py-2.5 bg-lumex-blue text-white text-sm font-bold rounded hover:bg-lumex-blue-dark transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};
