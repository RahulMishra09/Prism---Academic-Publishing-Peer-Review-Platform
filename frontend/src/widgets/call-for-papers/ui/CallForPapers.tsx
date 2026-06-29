import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Skeleton, Badge } from '../../../shared/ui';
import { useQuery } from '@tanstack/react-query';
import type { SpecialIssue } from '../../../entities/journal/model/types';
import { FaCalendarAlt, FaBullhorn } from 'react-icons/fa';

export const CallForPapers: React.FC = () => {
    const { data: issues, isLoading } = useQuery<SpecialIssue[]>({
        queryKey: ['home-cfps'],
        queryFn: async () => {
            const res = await fetch('/mock-data/special-issues.json');
            if (!res.ok) throw new Error('Failed to fetch special issues');
            const data = await res.json() as SpecialIssue[];
            // Filter only open CFPs
            return data.filter(i => i.status === 'call-for-papers').slice(0, 3);
        }
    });

    if (isLoading) {
        return (
            <section className="py-16 bg-lumex-bg-deep">
                <Container>
                    <Skeleton className="h-8 w-48 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
                    </div>
                </Container>
            </section>
        );
    }

    if (!issues || issues.length === 0) return null;

    return (
        <section className="py-20 bg-lumex-bg-deep relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-lumex-blue/5 rounded-full blur-3xl pointer-events-none" />
            
            <Container className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-2 text-lumex-blue">
                            <FaBullhorn className="text-xl" />
                            <span className="text-sm font-bold uppercase tracking-wider">Submissions Open</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-lumex-text">Call for Papers</h2>
                        <p className="text-lumex-muted mt-2 max-w-2xl">Publish your research in our upcoming special issues curated by leading guest editors.</p>
                    </div>
                    <Link to="/journals" className="text-lumex-blue font-semibold hover:underline text-sm flex-shrink-0">
                        View all open collections →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {issues.map(issue => (
                        <div key={issue.id} className="group bg-lumex-card rounded-2xl border border-lumex-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="h-32 relative overflow-hidden bg-gradient-to-br from-lumex-blue/20 to-lumex-bg-deep">
                                {issue.coverImageUrl ? (
                                    <img
                                        src={issue.coverImageUrl}
                                        alt={issue.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                    />
                                ) : null}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                    <Badge variant="default" className="bg-white/20 text-white border-none backdrop-blur-md">
                                        Special Issue
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="font-serif font-bold text-lumex-text text-lg leading-snug mb-3 group-hover:text-lumex-blue transition-colors line-clamp-2">
                                    <Link to={`/journal/${issue.journalSlug}/special-issue/${issue.id}`} className="after:absolute after:inset-0">
                                        {issue.title}
                                    </Link>
                                </h3>
                                
                                <p className="text-sm text-lumex-muted line-clamp-2 mb-5">
                                    {issue.description.replace(/<[^>]*>?/gm, '')}
                                </p>
                                
                                <div className="pt-4 border-t border-lumex-border flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-lumex-text">
                                        <FaCalendarAlt className="text-lumex-blue opacity-70" />
                                        <span className="font-semibold">
                                            Deadline: {new Date(issue.callForPapersDeadline!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <span className="text-lumex-blue font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};
