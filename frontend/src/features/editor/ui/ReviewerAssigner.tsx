import React, { useState, useEffect } from 'react';
import { Container, Button } from '@shared/ui';

interface Reviewer {
    id: string;
    name: string;
    expertise: string[];
    institution: string;
    activeReviews: number;
    completedReviews: number;
    rating: number;
}

interface ReviewerAssignerProps {
    manuscriptId: string;
    manuscriptTitle: string;
    onClose: () => void;
    onAssign: (reviewerIds: string[]) => void;
}

export const ReviewerAssigner: React.FC<ReviewerAssignerProps> = ({
    manuscriptId,
    manuscriptTitle,
    onClose,
    onAssign
}) => {
    const [reviewers, setReviewers] = useState<Reviewer[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/mock-data/reviewers.json')
            .then(res => res.json())
            .then((data: Reviewer[]) => {
                setReviewers(data);
                setLoading(false);
            })
            .catch(err => console.error('Failed to load reviewers', err));
    }, []);

    const filtered = reviewers.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.expertise.some(e => e.toLowerCase().includes(search.toLowerCase())) ||
        r.institution.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelection = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Container className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col p-0">
                {/* Header */}
                <div className="p-6 border-b border-lumex-border bg-gray-50/50">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-lumex-text">Assign Reviewers</h2>
                            <p className="text-sm text-lumex-text-secondary mt-1">
                                <span className="font-bold text-lumex-blue">{manuscriptId}:</span> {manuscriptTitle}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>

                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            placeholder="Search by name, expertise, or institution..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-lumex-border rounded-lg outline-none focus:ring-2 focus:ring-lumex-blue/20 focus:border-lumex-blue text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumex-blue" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map(rev => (
                                <div
                                    key={rev.id}
                                    className={`p-4 border rounded-lg transition-all cursor-pointer ${selected.includes(rev.id)
                                        ? 'border-lumex-blue bg-blue-50/50 ring-1 ring-lumex-blue'
                                        : 'border-lumex-border bg-white hover:border-gray-300'
                                        }`}
                                    onClick={() => toggleSelection(rev.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${selected.includes(rev.id) ? 'bg-lumex-blue' : 'bg-gray-300'
                                                }`}>
                                                {rev.name.split(' ').pop()?.[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lumex-text">{rev.name}</h3>
                                                <p className="text-xs text-gray-500">{rev.institution}</p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {rev.expertise.map(exp => (
                                                        <span key={exp} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                            {exp}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-sm font-bold text-lumex-text">
                                                <svg className="text-amber-400" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                {rev.rating}
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                                                {rev.activeReviews} Active · {rev.completedReviews} Done
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-lumex-border bg-gray-50/50 flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-500">
                        {selected.length} {selected.length === 1 ? 'reviewer' : 'reviewers'} selected
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            variant="primary"
                            disabled={selected.length === 0}
                            onClick={() => onAssign(selected)}
                        >
                            Confirm Assignment
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    );
};
