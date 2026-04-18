import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Journal } from '../../../entities/journal/model/types';

export const EditorialBoardPage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();

    return (
        <div className="space-y-8">
            <div className="border-b border-lumex-border pb-3">
                <h2 className="text-2xl font-serif text-lumex-blue font-bold">
                    Editorial board
                </h2>
            </div>

            {journal.editors?.map((editor) => (
                <div key={editor.name} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
                    <h3 className="text-lg font-bold text-lumex-text">{editor.name}</h3>
                    <p className="text-lumex-text-secondary text-sm mt-1">{editor.role}</p>
                    {editor.affiliation && (
                        <p className="text-lumex-muted text-sm mt-1">{editor.affiliation}</p>
                    )}
                </div>
            ))}

            {(!journal.editors || journal.editors.length === 0) && (
                <p className="text-lumex-muted italic">
                    Editorial board information is currently being updated.
                </p>
            )}
        </div>
    );
};

export const AboutJournalPage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();
    return (
        <div className="space-y-8 max-w-3xl">
            <div className="border-b border-lumex-border pb-3">
                <h2 className="text-2xl font-serif text-lumex-blue font-bold">
                    About {journal.title}
                </h2>
            </div>
            <div className="prose prose-lumex">
                <h3>Aims and scope</h3>
                <p className="text-lg leading-relaxed">{journal.description}</p>
                <p>
                    This journal operates a single-blind peer-review process. All submissions will
                    be initially assessed by the editor for suitability for the journal.
                </p>

                <h3>Publishing model</h3>
                <p>{journal.openAccess ? 'Hybrid Open Access' : 'Subscription'} journal.</p>
            </div>
        </div>
    );
};

export const SubmissionGuidelinesPage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();
    return (
        <div className="space-y-8 max-w-3xl">
            <div className="border-b border-lumex-border pb-3">
                <h2 className="text-2xl font-serif text-lumex-blue font-bold">
                    Submission guidelines
                </h2>
            </div>
            <div className="prose prose-lumex">
                <p>Instructions for Authors for {journal.title}.</p>
                <h3>1. Manuscript Preparation</h3>
                <ul>
                    <li>Manuscripts should be submitted in Word or LaTeX format.</li>
                    <li>Use a normal, plain font (e.g., 10-point Times Roman) for text.</li>
                    <li>Use italics for emphasis.</li>
                    <li>Use the automatic page numbering function to number the pages.</li>
                </ul>
                <h3>2. Title Page</h3>
                <p>
                    The title page should include the name(s) of the author(s), a concise and
                    informative title, and the affiliation(s) and address(es) of the author(s).
                </p>
            </div>
        </div>
    );
};

export const OpenAccessPage: React.FC = () => {
    return (
        <div className="space-y-8 max-w-3xl">
            <div className="border-b border-lumex-border pb-3">
                <h2 className="text-2xl font-serif text-lumex-blue font-bold">
                    Open Access policies
                </h2>
            </div>
            <div className="prose prose-lumex">
                <p>
                    Upon acceptance of an article, authors will be asked to complete a 'Journal
                    Publishing Agreement'.
                </p>
                <h3>Open Choice</h3>
                <p>
                    This journal allows authors to publish their article open access. This means the
                    article will be freely available immediately upon publication worldwide.
                </p>
                <h3>Article Processing Charges (APC)</h3>
                <p>
                    The APC for this journal is £2,490.00 / $3,590.00 / €2,890.00, subject to tax.
                </p>
            </div>
        </div>
    );
};
