import React from 'react';
import { Container } from '../../../shared/ui';

export const AuthorGuidelinesPage: React.FC = () => {
    return (
        <div className="py-12 bg-lumex-bg min-h-[70vh]">
            <Container>
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Navigation */}
                    <div className="md:w-1/4">
                        <div className="sticky top-24 bg-lumex-card border border-lumex-border rounded-lg p-6">
                            <h3 className="font-bold text-lumex-text mb-4">On this page</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <a href="#formatting" className="text-lumex-blue hover:underline">Formatting Requirements</a>
                                </li>
                                <li>
                                    <a href="#structure" className="text-lumex-blue hover:underline">Manuscript Structure</a>
                                </li>
                                <li>
                                    <a href="#figures" className="text-lumex-blue hover:underline">Figures and Tables</a>
                                </li>
                                <li>
                                    <a href="#references" className="text-lumex-blue hover:underline">References</a>
                                </li>
                                <li>
                                    <a href="#ethics" className="text-lumex-blue hover:underline">Research Ethics</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="md:w-3/4 max-w-3xl">
                        <h1 className="text-4xl font-serif font-bold text-lumex-text mb-6">
                            Author Guidelines
                        </h1>
                        <p className="text-lg text-lumex-muted mb-10 leading-relaxed">
                            Thank you for choosing to submit your paper to Lumex journals. These instructions will ensure we have everything required so your paper can move through peer review, production and publication smoothly.
                        </p>

                        <div className="prose prose-lumex max-w-none space-y-12">
                            <section id="formatting">
                                <h2 className="text-2xl font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">Formatting Requirements</h2>
                                <ul className="list-disc pl-5 space-y-2 text-lumex-muted">
                                    <li>Manuscripts must be submitted in Word (.doc, .docx) or LaTeX format.</li>
                                    <li>Use a standard font (e.g., Times New Roman, 12pt) and double spacing throughout.</li>
                                    <li>Pages should be numbered consecutively.</li>
                                    <li>Continuous line numbering is highly recommended to aid reviewers.</li>
                                </ul>
                            </section>

                            <section id="structure">
                                <h2 className="text-2xl font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">Manuscript Structure</h2>
                                <p className="text-lumex-muted mb-4">Research articles should generally be structured as follows:</p>
                                <ol className="list-decimal pl-5 space-y-3 text-lumex-muted">
                                    <li><strong>Title Page:</strong> Include a concise title, author names, affiliations, and contact information for the corresponding author.</li>
                                    <li><strong>Abstract:</strong> A structured or unstructured summary of the research (max 250 words).</li>
                                    <li><strong>Introduction:</strong> Background, context, and the specific objectives of the study.</li>
                                    <li><strong>Methods:</strong> Detailed procedures ensuring reproducibility.</li>
                                    <li><strong>Results:</strong> Objective representation of the findings.</li>
                                    <li><strong>Discussion:</strong> Interpretation of results in the context of existing literature.</li>
                                    <li><strong>Conclusions:</strong> Main takeaways and future directions.</li>
                                </ol>
                            </section>

                            <section id="figures">
                                <h2 className="text-2xl font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">Figures and Tables</h2>
                                <ul className="list-disc pl-5 space-y-2 text-lumex-muted">
                                    <li>Submit high-resolution images (minimum 300 dpi for halftones, 600 dpi for line art).</li>
                                    <li>Acceptable formats: TIFF, EPS, or high-quality PDF/JPEG.</li>
                                    <li>Each figure must have a concise caption describing the content.</li>
                                    <li>Tables should be editable text, not images, and contain clear column headings.</li>
                                </ul>
                            </section>

                            <section id="references">
                                <h2 className="text-2xl font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">References</h2>
                                <p className="text-lumex-muted mb-3">Lumex uses a standard numbered citation style. Please ensure all references are accurate and properly formatted.</p>
                                <div className="bg-lumex-bg-deep p-4 rounded border border-lumex-border text-sm text-lumex-muted font-mono">
                                    [1] Smith, J., & Doe, A. (2023). Title of the manuscript. Journal of Science, 45(2), 112-120. doi:10.1000/xyz123
                                </div>
                            </section>

                            <section id="ethics">
                                <h2 className="text-2xl font-bold text-lumex-text mb-4 border-b border-lumex-border pb-2">Research Ethics</h2>
                                <p className="text-lumex-muted mb-4">
                                    All submitted manuscripts must adhere to high ethical standards. Plagiarism, data falsification, and inappropriate image manipulation are unacceptable.
                                </p>
                                <p className="text-lumex-muted">
                                    Studies involving human subjects or animals must explicitly state ethical approval and informed consent procedures.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};
