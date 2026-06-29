import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container } from '../../../shared/ui';
import { fetchClient } from '../../../shared/api/base';

interface Career {
    id: string;
    title: string;
    department?: string;
    location?: string;
    type?: string;
    description?: string;
    requirements?: string;
    isActive?: boolean;
    closingDate?: string;
    createdAt?: string;
}

const MOCK_CAREERS: Career[] = [
    { id: '1', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Help build the next generation of academic publishing tools.\n\nAs a Senior Frontend Engineer at Lumex, you will work on building performant, accessible, and beautiful interfaces for researchers, editors, and reviewers worldwide. You will collaborate closely with our design and backend teams to deliver features that make scientific publishing faster and more transparent.\n\nKey responsibilities include architecting React components, optimizing rendering performance, implementing real-time collaboration features, and mentoring junior developers.', requirements: '• 5+ years of experience with React and TypeScript\n• Strong understanding of web performance optimization\n• Experience with state management (Zustand, Redux, or similar)\n• Familiarity with design systems and component libraries\n• Experience with testing frameworks (Jest, Playwright)\n• Excellent communication skills', isActive: true, closingDate: '2026-07-15T00:00:00Z', createdAt: '2026-05-01T00:00:00Z' },
    { id: '2', title: 'Editorial Operations Manager', department: 'Editorial', location: 'New York, NY', type: 'Full-time', description: 'Lead editorial workflow optimization and manage peer review processes.\n\nYou will be responsible for ensuring smooth operations across all journals published on Lumex. This includes managing reviewer assignments, tracking submission timelines, and working with editors to maintain quality standards.', requirements: '• 3+ years in scholarly publishing or editorial operations\n• Experience with peer review management systems\n• Strong organizational and project management skills\n• Excellent written and verbal communication\n• Familiarity with academic publishing standards (COPE, ICMJE)', isActive: true, closingDate: '2026-08-01T00:00:00Z', createdAt: '2026-05-10T00:00:00Z' },
    { id: '3', title: 'Data Scientist — Research Metrics', department: 'Data', location: 'Remote', type: 'Full-time', description: 'Develop citation analytics and impact measurement systems for academic research.\n\nYou will design and implement algorithms for measuring research impact, build dashboards for journal editors, and create tools that help researchers understand how their work is being received by the academic community.', requirements: '• MS/PhD in Computer Science, Statistics, or related field\n• Experience with Python, SQL, and data visualization\n• Knowledge of bibliometrics and scientometrics\n• Experience with machine learning and NLP\n• Familiarity with academic publishing metrics (h-index, impact factor)', isActive: true, createdAt: '2026-05-15T00:00:00Z' },
    { id: '4', title: 'Product Designer', department: 'Design', location: 'London, UK', type: 'Full-time', description: 'Design intuitive interfaces for researchers, editors, and reviewers.\n\nAs a Product Designer, you will own the end-to-end design process for key features of the Lumex platform. You will conduct user research, create wireframes and prototypes, and collaborate with engineers to ship polished experiences.', requirements: '• 4+ years of product design experience\n• Proficiency in Figma and design systems\n• Experience with user research and usability testing\n• Portfolio demonstrating complex product design work\n• Understanding of accessibility standards (WCAG)', isActive: true, createdAt: '2026-05-20T00:00:00Z' },
];

export const CareerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', coverLetter: '' });
    const [submitted, setSubmitted] = useState(false);

    const { data: career, isLoading } = useQuery({
        queryKey: ['careers', id],
        queryFn: async () => {
            try {
                const res = await fetchClient<{ data: Career }>(`/careers/${id}`);
                return res.data;
            } catch {
                return MOCK_CAREERS.find(c => c.id === id) || null;
            }
        },
        enabled: !!id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // No backend endpoint for applications — just show confirmation
        setSubmitted(true);
        setShowForm(false);
    };

    if (isLoading) {
        return (
            <div className="py-12 bg-lumex-bg min-h-[70vh]">
                <Container>
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lumex-blue" />
                    </div>
                </Container>
            </div>
        );
    }

    if (!career) {
        return (
            <div className="py-12 bg-lumex-bg min-h-[70vh]">
                <Container>
                    <div className="max-w-3xl mx-auto text-center py-20">
                        <h1 className="text-2xl font-bold text-lumex-text mb-4">Position Not Found</h1>
                        <p className="text-lumex-muted mb-6">This job listing may have been removed or is no longer active.</p>
                        <Link to="/careers" className="text-lumex-blue font-bold hover:underline">
                            ← Back to Careers
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    const isOpen = career.isActive !== false && (!career.closingDate || new Date(career.closingDate) > new Date());

    return (
        <div className="py-12 bg-lumex-bg min-h-[70vh]">
            <Container>
                <div className="max-w-3xl mx-auto">
                    <Link to="/careers" className="inline-flex items-center text-sm font-bold text-lumex-blue hover:underline mb-8">
                        ← Back to All Positions
                    </Link>

                    <div className="bg-lumex-card border border-lumex-border rounded-xl p-8 shadow-sm mb-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-lumex-border">
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-lumex-text mb-2">{career.title}</h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-lumex-muted">
                                    {career.department && (
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            {career.department}
                                        </span>
                                    )}
                                    {career.location && (
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {career.location}
                                        </span>
                                    )}
                                    {career.type && (
                                        <span className="text-xs font-bold bg-lumex-blue/10 text-lumex-blue px-2.5 py-0.5 rounded-full">
                                            {career.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${isOpen ? 'bg-green-500/15 text-green-600 border border-green-500/20' : 'bg-red-500/15 text-red-500 border border-red-500/20'}`}>
                                {isOpen ? 'Open' : 'Closed'}
                            </span>
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-6 text-sm text-lumex-muted mb-8">
                            {career.createdAt && (
                                <div>
                                    <span className="text-xs font-bold uppercase text-lumex-sub tracking-wider">Posted</span>
                                    <p className="text-lumex-text font-medium mt-0.5">{new Date(career.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            )}
                            {career.closingDate && (
                                <div>
                                    <span className="text-xs font-bold uppercase text-lumex-sub tracking-wider">Closing Date</span>
                                    <p className="text-lumex-text font-medium mt-0.5">{new Date(career.closingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-xs font-bold uppercase text-lumex-sub tracking-wider mb-3">About This Role</h2>
                            <div className="text-sm text-lumex-text-secondary leading-relaxed whitespace-pre-line">
                                {career.description}
                            </div>
                        </div>

                        {/* Requirements */}
                        {career.requirements && (
                            <div className="mb-8">
                                <h2 className="text-xs font-bold uppercase text-lumex-sub tracking-wider mb-3">Requirements</h2>
                                <div className="text-sm text-lumex-text-secondary leading-relaxed whitespace-pre-line">
                                    {career.requirements}
                                </div>
                            </div>
                        )}

                        {/* Apply button */}
                        {isOpen && !submitted && (
                            <div className="pt-6 border-t border-lumex-border">
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="px-6 py-3 bg-lumex-blue text-white font-bold rounded-lg hover:bg-lumex-blue-dark transition-colors"
                                >
                                    {showForm ? 'Cancel' : 'Apply for This Position'}
                                </button>
                            </div>
                        )}

                        {/* Application form */}
                        {showForm && (
                            <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-lumex-bg-deep border border-lumex-border rounded-lg p-6">
                                <h3 className="text-sm font-bold text-lumex-text mb-2">Application Form</h3>
                                <div>
                                    <label className="block text-xs font-bold text-lumex-sub uppercase tracking-wider mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                        className="w-full px-3 py-2 bg-lumex-card border border-lumex-border rounded text-sm text-lumex-text focus:outline-none focus:border-lumex-blue"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-lumex-sub uppercase tracking-wider mb-1">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                        className="w-full px-3 py-2 bg-lumex-card border border-lumex-border rounded text-sm text-lumex-text focus:outline-none focus:border-lumex-blue"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-lumex-sub uppercase tracking-wider mb-1">Cover Letter / Message *</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.coverLetter}
                                        onChange={e => setFormData(p => ({ ...p, coverLetter: e.target.value }))}
                                        placeholder="Tell us why you're interested in this role and what makes you a great fit..."
                                        className="w-full px-3 py-2 bg-lumex-card border border-lumex-border rounded text-sm text-lumex-text focus:outline-none focus:border-lumex-blue resize-y"
                                    />
                                </div>
                                <p className="text-xs text-lumex-muted">
                                    Please also send your resume to <a href="mailto:careers@lumex.io" className="text-lumex-blue hover:underline">careers@lumex.io</a> with the position title in the subject line.
                                </p>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-lumex-blue text-white text-sm font-bold rounded hover:bg-lumex-blue-dark transition-colors"
                                >
                                    Submit Application
                                </button>
                            </form>
                        )}

                        {/* Success message */}
                        {submitted && (
                            <div className="mt-6 bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                                <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h3 className="text-lg font-bold text-lumex-text mb-1">Application Submitted</h3>
                                <p className="text-sm text-lumex-muted">
                                    Thank you for your interest! We'll review your application and get back to you soon.
                                    Please also email your resume to <a href="mailto:careers@lumex.io" className="text-lumex-blue hover:underline">careers@lumex.io</a>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};
