import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Journal } from '../../../entities/journal/model/types';

export const EditorialBoardPage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();

    return (
        <div className="space-y-12 max-w-4xl pb-12">
            <div className="border-b border-lumex-border pb-4">
                <h2 className="text-3xl font-serif text-lumex-blue font-bold">
                    Editorial Board
                </h2>
                <p className="text-lumex-muted mt-3 text-lg leading-relaxed">
                    The {journal.title} editorial board consists of leading international researchers and experts who oversee the peer-review process and ensure the highest scientific standards.
                </p>
            </div>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-6 pb-2 border-b border-gray-200 dark:border-lumex-border">Editor-in-Chief</h3>
                <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-gradient-to-br from-lumex-blue/20 to-purple-500/20 rounded-full flex items-center justify-center shrink-0 border border-lumex-blue/10">
                        <span className="text-3xl font-serif font-bold text-lumex-blue">EA</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-lumex-text mb-1">Prof. Elena Alistair, Ph.D.</h4>
                        <p className="text-lumex-blue font-medium mb-3">Department of Computational Biology, Oxford University, UK</p>
                        <p className="text-sm text-lumex-text-secondary leading-relaxed">
                            Prof. Alistair's research focuses on algorithmic modeling of cellular pathways. She has served on numerous international panels, published over 200 peer-reviewed articles, and brings 25 years of editorial experience to {journal.title}. She leads the journal's strategic vision towards open and transparent science.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-6 pb-2 border-b border-gray-200 dark:border-lumex-border">Associate Editors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 border border-lumex-border rounded-xl bg-lumex-bg-white hover:border-lumex-blue/50 transition-colors">
                        <h4 className="font-bold text-lumex-text text-lg">Dr. Marcus Chen</h4>
                        <p className="text-sm text-lumex-blue font-medium mb-2">Data Science & Ethics</p>
                        <p className="text-sm text-lumex-muted">Stanford University, USA</p>
                    </div>
                    <div className="p-5 border border-lumex-border rounded-xl bg-lumex-bg-white hover:border-lumex-blue/50 transition-colors">
                        <h4 className="font-bold text-lumex-text text-lg">Dr. Sarah Jenkins</h4>
                        <p className="text-sm text-lumex-blue font-medium mb-2">Environmental Dynamics</p>
                        <p className="text-sm text-lumex-muted">University of Melbourne, Australia</p>
                    </div>
                    <div className="p-5 border border-lumex-border rounded-xl bg-lumex-bg-white hover:border-lumex-blue/50 transition-colors">
                        <h4 className="font-bold text-lumex-text text-lg">Prof. Hiroshi Tanaka</h4>
                        <p className="text-sm text-lumex-blue font-medium mb-2">Materials Engineering</p>
                        <p className="text-sm text-lumex-muted">University of Tokyo, Japan</p>
                    </div>
                    <div className="p-5 border border-lumex-border rounded-xl bg-lumex-bg-white hover:border-lumex-blue/50 transition-colors">
                        <h4 className="font-bold text-lumex-text text-lg">Dr. Amara Okoro</h4>
                        <p className="text-sm text-lumex-blue font-medium mb-2">Public Health Policy</p>
                        <p className="text-sm text-lumex-muted">University of Cape Town, South Africa</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-6 pb-2 border-b border-gray-200 dark:border-lumex-border">International Advisory Board</h3>
                <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm">
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 text-sm text-lumex-text-secondary">
                        <li><strong className="text-lumex-text block mb-1">Dr. David Miller</strong>Institute for Advanced Study, USA</li>
                        <li><strong className="text-lumex-text block mb-1">Prof. Lars Jensen</strong>University of Copenhagen, Denmark</li>
                        <li><strong className="text-lumex-text block mb-1">Dr. Maria Schmidt</strong>Max Planck Institute, Germany</li>
                        <li><strong className="text-lumex-text block mb-1">Prof. Robert Greene</strong>Caltech, USA</li>
                        <li><strong className="text-lumex-text block mb-1">Dr. Clara Rodriguez</strong>ETH Zurich, Switzerland</li>
                        <li><strong className="text-lumex-text block mb-1">Prof. Wei Lin</strong>Tsinghua University, China</li>
                    </ul>
                </div>
            </section>

            <section className="bg-gradient-to-r from-lumex-blue/5 to-transparent p-6 rounded-xl border-l-4 border-lumex-blue shadow-sm">
                <h3 className="text-lg font-bold text-lumex-text mb-3">Editorial Policies & Independence</h3>
                <p className="text-sm text-lumex-text-secondary leading-relaxed mb-4">
                    The Editor-in-Chief has the final authority on all editorial decisions regarding peer-reviewed content. {journal.title} and its publisher, Lumex Academic, adhere strictly to the guidelines set forth by the Committee on Publication Ethics (COPE). 
                </p>
                <p className="text-sm text-lumex-text-secondary leading-relaxed">
                    Editors and reviewers are strictly prohibited from utilizing privileged information obtained through the peer review process for personal or professional gain. We maintain a zero-tolerance policy towards plagiarism, data falsification, and coercive citation practices.
                </p>
            </section>
        </div>
    );
};

export const AboutJournalPage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();
    return (
        <div className="space-y-12 max-w-4xl pb-12">
            <div className="border-b border-lumex-border pb-4">
                <h2 className="text-3xl font-serif text-lumex-blue font-bold">
                    About {journal.title}
                </h2>
                <p className="text-lumex-muted mt-3 text-lg leading-relaxed">
                    A premier international platform for publishing high-quality, peer-reviewed research.
                </p>
            </div>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">Aims and Scope</h3>
                <div className="prose prose-lumex max-w-none text-lumex-text">
                    <p className="text-lg leading-relaxed mb-4">{journal.description}</p>
                    <p className="leading-relaxed">
                        The journal bridges the gap between fundamental theoretical research and applied practical solutions. We welcome original research articles, comprehensive review papers, short communications, and case studies that push the boundaries of current knowledge.
                    </p>
                    <p className="leading-relaxed mt-4">
                        Key areas of interest include, but are not limited to: advanced computational models, empirical field studies, cross-disciplinary methodologies, and innovative technological applications impacting global sustainability.
                    </p>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">Peer Review Model</h3>
                    <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm">
                        <p className="text-sm text-lumex-text-secondary leading-relaxed">
                            This journal operates a strict <strong>single-blind peer-review</strong> process. All submissions are initially assessed by the Editor-in-Chief for suitability. Articles deemed suitable are then sent to a minimum of two independent expert reviewers to assess the scientific quality of the paper.
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">Abstracting & Indexing</h3>
                    <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm">
                        <ul className="text-sm text-lumex-text-secondary space-y-2 list-disc list-inside">
                            <li>Web of Science Core Collection</li>
                            <li>Scopus</li>
                            <li>PubMed / MEDLINE</li>
                            <li>DOAJ (Directory of Open Access Journals)</li>
                            <li>Google Scholar</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-r from-lumex-blue/5 to-transparent p-6 rounded-xl border-l-4 border-lumex-blue shadow-sm">
                <h3 className="text-lg font-bold text-lumex-text mb-2">Publication Frequency</h3>
                <p className="text-sm text-lumex-text-secondary">
                    {journal.title} publishes continuously. Articles are published online as soon as they are accepted and professionally typeset, ensuring rapid dissemination of your research to the global scientific community.
                </p>
            </section>
        </div>
    );
};

export const SubmissionGuidelinesPage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();
    return (
        <div className="space-y-12 max-w-4xl pb-12">
            <div className="border-b border-lumex-border pb-4">
                <h2 className="text-3xl font-serif text-lumex-blue font-bold">
                    Submission Guidelines
                </h2>
                <p className="text-lumex-muted mt-3 text-lg leading-relaxed">
                    Detailed instructions for authors preparing a manuscript for {journal.title}.
                </p>
            </div>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">1. Manuscript Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-lumex-border rounded-lg bg-lumex-bg-white">
                        <h4 className="font-bold text-lumex-text">Original Research</h4>
                        <p className="text-xs text-lumex-text-secondary mt-2">Comprehensive studies reporting original data. Max 8,000 words, unlimited figures.</p>
                    </div>
                    <div className="p-4 border border-lumex-border rounded-lg bg-lumex-bg-white">
                        <h4 className="font-bold text-lumex-text">Review Articles</h4>
                        <p className="text-xs text-lumex-text-secondary mt-2">In-depth synthesis of current literature. Max 12,000 words.</p>
                    </div>
                    <div className="p-4 border border-lumex-border rounded-lg bg-lumex-bg-white">
                        <h4 className="font-bold text-lumex-text">Short Communications</h4>
                        <p className="text-xs text-lumex-text-secondary mt-2">Brief reports of highly significant findings. Max 3,000 words, 4 figures.</p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">2. Formatting Requirements</h3>
                <div className="prose prose-lumex max-w-none text-sm text-lumex-text-secondary">
                    <ul className="list-disc list-outside ml-4 space-y-2">
                        <li><strong>File Format:</strong> Manuscripts must be submitted in Word (.docx) or LaTeX (.zip containing .tex and all assets) format.</li>
                        <li><strong>Typography:</strong> Use a standard, readable font (e.g., 10-12 point Times New Roman or Arial). Double-space all text.</li>
                        <li><strong>Title Page:</strong> Must include a concise title, full author names, affiliations, and the corresponding author's email address.</li>
                        <li><strong>Abstract:</strong> Provide a structured abstract (Background, Methods, Results, Conclusion) of no more than 250 words.</li>
                        <li><strong>Keywords:</strong> Provide 4 to 6 keywords immediately following the abstract.</li>
                    </ul>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">3. Figures and Tables</h3>
                <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm">
                    <p className="text-sm text-lumex-text-secondary mb-4">
                        All figures and tables should be cited in numerical order in the text.
                    </p>
                    <ul className="text-sm text-lumex-text-secondary list-disc list-inside space-y-2">
                        <li><strong>Resolution:</strong> Photographic images must be at least 300 DPI. Line art must be at least 1000 DPI.</li>
                        <li><strong>Formats:</strong> Acceptable formats include EPS, TIFF, and high-quality PDF or PNG.</li>
                        <li><strong>Captions:</strong> Provide detailed legends for all figures on a separate page or at the end of the document.</li>
                    </ul>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">4. References Style</h3>
                <p className="text-sm text-lumex-text-secondary mb-4">
                    {journal.title} utilizes the APA (American Psychological Association) reference style. Ensure all in-text citations match the reference list exactly. We highly recommend using reference management software such as EndNote, Zotero, or Mendeley.
                </p>
            </section>

            <section className="bg-gradient-to-r from-red-500/5 to-transparent p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
                <h3 className="text-lg font-bold text-lumex-text mb-2">5. Research Ethics & Consent</h3>
                <p className="text-sm text-lumex-text-secondary">
                    All studies involving human subjects or animal models must include a statement of ethical approval from an Institutional Review Board (IRB) or equivalent committee. Informed consent declarations must be clearly stated in the methods section.
                </p>
            </section>
        </div>
    );
};

export const OpenAccessPage: React.FC = () => {
    const { journal } = useOutletContext<{ journal: Journal }>();
    return (
        <div className="space-y-12 max-w-4xl pb-12">
            <div className="border-b border-lumex-border pb-4">
                <h2 className="text-3xl font-serif text-lumex-blue font-bold">
                    Open Access Policies
                </h2>
                <p className="text-lumex-muted mt-3 text-lg leading-relaxed">
                    Committed to breaking down barriers to scientific knowledge through flexible publishing models.
                </p>
            </div>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">Publishing Model</h3>
                <div className="bg-lumex-bg-white p-6 rounded-xl border border-lumex-border shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-lumex-text text-lg">Hybrid Open Access Journal</h4>
                        <p className="text-sm text-lumex-text-secondary leading-relaxed mt-2">
                            {journal.title} offers authors two distinct publishing choices. You may choose to publish Open Access (making your article freely available worldwide immediately upon publication), or via the traditional subscription model (where access is restricted to journal subscribers).
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">Article Processing Charges (APC)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-lumex-border rounded-xl bg-lumex-bg-white">
                        <h4 className="font-bold text-lumex-blue text-2xl mb-1">£2,490.00</h4>
                        <p className="text-xs font-bold text-lumex-muted uppercase tracking-wider mb-4">Standard APC</p>
                        <p className="text-sm text-lumex-text-secondary">
                            Applicable only if the Open Access option is selected. This fee covers peer-review administration, professional typesetting, and perpetual digital archiving.
                        </p>
                    </div>
                    <div className="p-6 border border-lumex-border rounded-xl bg-lumex-bg-white">
                        <h4 className="font-bold text-lumex-text mb-2">APC Waivers</h4>
                        <p className="text-sm text-lumex-text-secondary">
                            We offer comprehensive APC waivers and substantial discounts for corresponding authors based in low- and lower-middle-income countries, as classified by the World Bank.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-lumex-text mb-4 pb-2 border-b border-gray-100 dark:border-lumex-border">Licensing Options</h3>
                <p className="text-sm text-lumex-text-secondary mb-4">
                    Open Access articles are published under Creative Commons licenses, allowing varied degrees of reuse:
                </p>
                <ul className="space-y-4 text-sm text-lumex-text-secondary">
                    <li className="flex gap-3">
                        <span className="font-bold text-lumex-text shrink-0 w-24">CC BY 4.0</span>
                        <span>Allows users to copy, distribute, and build upon the material, even commercially, provided proper attribution is given. (Recommended)</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="font-bold text-lumex-text shrink-0 w-24">CC BY-NC 4.0</span>
                        <span>Permits non-commercial reuse and adaptation, requiring proper attribution.</span>
                    </li>
                </ul>
            </section>
        </div>
    );
};
