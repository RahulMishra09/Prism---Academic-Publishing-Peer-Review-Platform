import React from 'react';
import { Container, Skeleton } from '../../../shared/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
}

export const CareersPage: React.FC = () => {
    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ['careers'],
        queryFn: async () => {
            const res = await fetchWithFallback<{ jobs: Job[] }>(
                '/careers',
                '/mock-data/careers.json'
            );
            return res.jobs || [];
        },
    });

    const departments = Array.from(new Set(jobs.map(j => j.department)));

    return (
        <div className="bg-lumex-bg min-h-[70vh]">
            {/* Hero Section */}
            <div className="bg-lumex-bg-deep py-16 border-b border-lumex-border">
                <Container>
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-serif font-bold text-lumex-text mb-6">
                            Join Our Mission
                        </h1>
                        <p className="text-xl text-lumex-muted leading-relaxed mb-8">
                            At Lumex, we are dedicated to advancing discovery and making scientific knowledge accessible. We're looking for passionate individuals to help us build the future of research publishing.
                        </p>
                        <a
                            href="#open-positions"
                            className="inline-block px-6 py-3 bg-lumex-blue text-white font-bold rounded hover:bg-lumex-blue-dark transition-colors"
                        >
                            View Open Positions
                        </a>
                    </div>
                </Container>
            </div>

            {/* Job Listings */}
            <div id="open-positions" className="py-16">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-lumex-text mb-10">
                            Current Openings
                        </h2>

                        {isLoading && (
                            <div className="space-y-6">
                                {['skel-1', 'skel-2', 'skel-3'].map((id) => (
                                    <Skeleton key={id} className="h-40 w-full rounded-xl" />
                                ))}
                            </div>
                        )}
                        {!isLoading && jobs.length === 0 && (
                            <div className="text-center py-12 bg-lumex-bg-deep rounded-xl border border-lumex-border">
                                <p className="text-lumex-muted text-lg">
                                    There are currently no open positions. Please check back later!
                                </p>
                            </div>
                        )}
                        {!isLoading && jobs.length > 0 && (
                            <div className="space-y-12">
                                {departments.map(dept => (
                                    <div key={dept}>
                                        <h3 className="text-xl font-bold text-lumex-text mb-6 pb-2 border-b-2 border-lumex-border inline-block">
                                            {dept}
                                        </h3>
                                        <div className="space-y-4">
                                            {jobs.filter(j => j.department === dept).map(job => (
                                                <div
                                                    key={job.id}
                                                    className="bg-lumex-card border border-lumex-border rounded-xl p-6 hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-lumex-blue mb-2 group-hover:underline cursor-pointer">
                                                            {job.title}
                                                        </h4>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-lumex-muted mb-3">
                                                            <span className="flex items-center gap-1.5">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                                {job.location}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                                                {job.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-lumex-sub">
                                                            {job.description}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <button className="px-5 py-2 whitespace-nowrap border border-lumex-blue text-lumex-blue font-bold rounded hover:bg-lumex-blue hover:text-white transition-colors">
                                                            Apply Now
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        </div>
    );
};
