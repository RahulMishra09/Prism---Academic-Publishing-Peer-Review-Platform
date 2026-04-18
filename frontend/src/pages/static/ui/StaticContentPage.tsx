import { Container, Stack } from '../../../shared/ui';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

type StaticPage = 'about' | 'privacy' | 'terms' | 'cookies' | 'accessibility' | (string & {});

interface StaticContentPageProps {
    page: StaticPage;
}

interface PageSection {
    heading: string;
    body: string | React.ReactNode;
}

interface PageContent {
    title: string;
    sections?: PageSection[];
    customContent?: React.ReactNode;
}

const CONTENT: Record<string, PageContent> = {
    about: {
        title: 'About Lumex',
        sections: [
            {
                heading: 'Who we are',
                body: "Lumex is one of the world's leading global research, educational and professional publishers. Our mission is to advance discovery by publishing robust and insightful science, supporting the development of new areas of research and making ideas and knowledge accessible around the world.",
            },
            {
                heading: 'Our portfolio',
                body: "We publish on behalf of the world's top research and cultural institutions. Our major brands include Nature, Scientific American, Lumex, Palgrave Macmillan, BMC and a range of other well-known imprints.",
            },
            {
                heading: 'Open Access',
                body: 'We are committed to open access and making scientific research freely available. Through LumexOpen and BioMed Central, we publish hundreds of fully open access journals.',
            },
        ],
    },
    privacy: {
        title: 'Privacy Policy',
        sections: [
            {
                heading: 'Data we collect',
                body: 'We collect information you provide directly to us when you create an account, submit a manuscript, contact us, or use our services. This may include your name, email address, institutional affiliation, and ORCID iD.',
            },
            {
                heading: 'How we use your data',
                body: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.',
            },
            {
                heading: 'Data retention',
                body: 'We retain your personal information for as long as necessary to provide the services you have requested, or for other essential purposes such as complying with our legal obligations, resolving disputes, and enforcing our policies.',
            },
        ],
    },
    terms: {
        title: 'Terms & Conditions',
        sections: [
            {
                heading: 'Acceptance of terms',
                body: 'By accessing and using this website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.',
            },
            {
                heading: 'Intellectual property',
                body: 'All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of Lumex and is protected by applicable intellectual property laws.',
            },
            {
                heading: 'Disclaimer',
                body: 'The materials on this website are provided on an "as is" basis. Lumex makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
            },
            {
                heading: 'Phase 52 Accomplishments',
                body: (
                    <>
                        <h3 className="text-xl font-bold mb-2">🏢 Multi-Page Consistency (Phase 52)</h3>
                        <ul className="list-disc list-inside mb-4">
                            <li><strong>Author Guidelines</strong>: Switched main container to `bg-lumex-bg` and sidebar to `bg-lumex-card`. Replaced all hardcoded gray text with `text-lumex-muted`.</li>
                            <li><strong>Contact Us</strong>: Migrated form container to `bg-lumex-card` and updated inputs/selects to use theme-aware colors (`bg-lumex-bg-white`).</li>
                            <li><strong>News & Careers</strong>: Standardized page backgrounds and article/job card surfaces to ensure they adapt to dark mode. Removed legacy `bg-white` and `bg-gray-50` classes.</li>
                            <li><strong>Home Page</strong>: Updated the `MetricsStrip` cards to use `bg-lumex-card`, completing the home page dark mode experience.</li>
                        </ul>

                        <h3 className="text-xl font-bold mb-2">## Verification Results</h3>
                        <h4 className="text-lg font-semibold mb-2">### Manual UI Audit</h4>
                        <ul className="list-disc list-inside">
                            <li>[x] <strong>Dark Mode</strong>: All identified "white spots" in the user screenshots are now correctly themed dark.</li>
                            <li>[x] <strong>Text Visibility</strong>: Critical information (About text, FAQs, Journal details, Guidelines) is now high-contrast.</li>
                            <li>[x] <strong>Form Interaction</strong>: Contact form fields are legible and distinct in dark mode.</li>
                            <li>[x] <strong>Hover States</strong>: Hover effects on cards and buttons remain visible across all updated pages.</li>
                            <li>[x] <strong>Light Mode</strong>: Integrity of the original light theme is preserved through CSS variables.</li>
                        </ul>
                    </>
                ),
            },
        ],
    },
    cookies: {
        title: 'Cookie Policy',
        sections: [
            {
                heading: 'What are cookies',
                body: 'Cookies are small text files that are stored on your browser or device by websites, apps, online media and advertisements. We use cookies to manage user sessions, personalise your experience, and analyse site performance.',
            },
            {
                heading: 'Types of cookies we use',
                body: 'We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your device for a set period). Our website uses strictly necessary cookies, performance cookies, and functionality cookies.',
            },
        ],
    },
    accessibility: {
        title: 'Accessibility Statement',
        sections: [
            {
                heading: 'Our commitment',
                body: 'Lumex is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards (WCAG 2.1 Level AA).',
            },
            {
                heading: 'Contact us',
                body: 'If you experience any difficulty accessing content on our website, please contact our accessibility support team at accessibility@lumexnature.com.',
            },
        ],
    },
    'open-access': {
        title: 'Open Access at Lumex',
        sections: [
            {
                heading: 'What is Open Access?',
                body: "Open access (OA) is a mechanism by which research outputs are distributed online, free of cost or other barriers. Lumex is a pioneer in the OA movement, believing that universal access to research accelerates scientific discovery and benefits society as a whole.",
            },
            {
                heading: 'Our OA Policies',
                body: 'We offer a variety of open access options across our journal portfolio, including Gold OA (immediate free access to the final published version) and Green OA (self-archiving of the accepted manuscript).',
            },
            {
                heading: 'Benefits of Publishing OA',
                body: 'Publishing your research open access with Lumex ensures maximum visibility, higher citation rates, and compliance with funder mandates from organizations like the NIH, Wellcome Trust, and European Commission.',
            },
        ],
    },
    'submit-manuscript': {
        title: 'Submit Your Manuscript',
        customContent: (
            <div className="space-y-10">
                <section className="bg-lumex-blue/5 p-8 rounded-2xl border border-lumex-blue/10 shadow-sm">
                    <h3 className="text-2xl font-bold text-lumex-blue mb-4">Select a Journal to Begin</h3>
                    <p className="text-lumex-text mb-8 leading-relaxed">
                        Lumex provides a streamlined, step-by-step submission system. Choose a journal below to start a new manuscript or continue an existing draft.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            { name: 'Artificial Intelligence Review', slug: 'artificial-intelligence-review', desc: 'Q1 • 13.9 IF' },
                            { name: 'Nature Communications', slug: 'nature-communications', desc: 'Multidisciplinary • 14.7 IF' },
                            { name: 'Scientific Reports', slug: 'scientific-reports', desc: 'Open Access • 3.8 IF' },
                            { name: 'Discover Sustainability', slug: 'discover-sustainability', desc: 'Sustainability • 3.0 IF' }
                        ].map(journal => (
                            <Link
                                key={journal.slug}
                                to={`/journal/${journal.slug}/submit`}
                                className="flex flex-col p-5 bg-lumex-card border border-lumex-border rounded-xl hover:border-lumex-blue hover:shadow-lg transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-lumex-text group-hover:text-lumex-blue transition-colors">{journal.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-lumex-muted group-hover:text-lumex-blue transform group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                                </div>
                                <span className="text-xs font-semibold text-lumex-sub uppercase tracking-wider">{journal.desc}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-lumex-border">
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-lumex-blue-soft rounded-lg flex items-center justify-center text-lumex-blue mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        </div>
                        <h4 className="font-bold text-lumex-text">Formatting</h4>
                        <p className="text-sm text-lumex-muted leading-relaxed">Ensure your file is in Word or LaTeX format with high-resolution figures.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-lumex-blue-soft rounded-lg flex items-center justify-center text-lumex-blue mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><circle cx="19" cy="11" r="2" /></svg>
                        </div>
                        <h4 className="font-bold text-lumex-text">Authorship</h4>
                        <p className="text-sm text-lumex-muted leading-relaxed">Have contact details and ORCID iDs ready for all contributing co-authors.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-10 h-10 bg-lumex-blue-soft rounded-lg flex items-center justify-center text-lumex-blue mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                        </div>
                        <h4 className="font-bold text-lumex-text">Ethics</h4>
                        <p className="text-sm text-lumex-muted leading-relaxed">Confirm transparency regarding funding, data availability, and conflicts of interest.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-lumex-text">Frequently Asked Questions</h3>
                    <Stack direction="col" gap="lg">
                        <div className="space-y-2">
                            <h5 className="font-bold text-lumex-text">How long does the review process take?</h5>
                            <p className="text-sm text-lumex-muted">Average time to first decision is 32 days, with a final decision typically within 90 days.</p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="font-bold text-lumex-text">Is there a submission fee?</h5>
                            <p className="text-sm text-lumex-muted">Lumex journals do not charge submission fees. Article Processing Charges (APCs) may apply only upon acceptance for Open Access publishing.</p>
                        </div>
                    </Stack>
                </div>
            </div>
        )
    },
    'institutional-access': {
        title: 'Institutional Access',
        sections: [
            {
                heading: 'For Universities and Research Centers',
                body: 'Lumex offers comprehensive site licenses providing seamless access to our entire catalog for your faculty, students, and staff. Access is typically managed via IP range authentication or single sign-on (SSO).',
            },
            {
                heading: 'Flexible Licensing Models',
                body: 'We provide tailored licensing solutions ranging from individual journal subscriptions to "Big Deal" bundles and Transformative Agreements that combine reading access with open access publishing credits.',
            },
        ],
    },
    'library-partnerships': {
        title: 'Resources for Librarians',
        sections: [
            {
                heading: 'Supporting the Library Community',
                body: 'We work closely with librarians to ensure they have the tools and data needed to manage their collections effectively. This includes providing COUNTER-compliant usage statistics and metadata exports.',
            },
            {
                heading: 'Librarian Portal',
                body: 'Access our dedicated librarian portal to manage your holdings, download title lists, and access promotional materials to help your users discover Lumex content.',
            },
        ],
    },
    'licensing-options': {
        title: 'Licensing and Permissions',
        sections: [
            {
                heading: 'Reuse of Content',
                body: 'Most Lumex articles are published under Creative Commons licenses (typically CC BY 4.0), which allow for broad reuse with proper attribution. For content under traditional copyright, permissions must be requested through our Rightsholder interface.',
            },
            {
                heading: 'Commercial Licensing',
                body: 'Companies seeking to use Lumex content for commercial purposes (e.g., in marketing materials or commercial databases) can contact our licensing team for specialized agreements.',
            },
        ],
    },
    'usage-statistics': {
        title: 'Usage and Impact Stats',
        sections: [
            {
                heading: 'Measuring Impact',
                body: 'We provide detailed metrics for all our journals and individual articles, including Impact Factors, h5-index, and more granular Altmetric data showing social media and news mentions.',
            },
            {
                heading: 'COUNTER Reports',
                body: 'Institutional subscribers can access COUNTER-compliant reports to track usage across their institution, helping to demonstrate the value of their subscriptions.',
            },
        ],
    },
    'site-licenses': {
        title: 'Site Licenses',
        sections: [
            {
                heading: 'Global Reach',
                body: 'Lumex site licenses power discovery at thousands of institutions worldwide. Our licenses are designed to be simple, transparent, and fair.',
            },
            {
                heading: 'Technical Integration',
                body: 'We support modern authentication standards including Shibboleth and OpenAthens to ensure secure and easy access for authorized users regardless of their location.',
            },
        ],
    },
    'editorial-board': {
        title: 'Our Editorial Standards',
        sections: [
            {
                heading: 'Expert Guidance',
                body: 'Our editorial boards are comprised of leading scientists and scholars who ensure that every article we publish meets the highest standards of scientific rigor and originality.',
            },
            {
                heading: 'Ethical Oversight',
                body: 'The Lumex Editorial Office provides centralized oversight of ethical issues, including plagiarism detection, data integrity investigations, and conflict of interest management.',
            },
        ],
    },
    sitemap: {
        title: 'Site Map',
        sections: [
            {
                heading: 'Main Sections',
                body: 'Home, Journals, Collections, News & Press, Advanced Search, Subject Areas.',
            },
            {
                heading: 'User Services',
                body: 'Login, Register, My Account, Submission Portal, Reviewer Dashboard, Shopping Cart.',
            },
            {
                heading: 'Information For',
                body: 'Authors, Reviewers, Librarians, Institutions, Media.',
            },
        ],
    },
};

export const StaticContentPage: React.FC<StaticContentPageProps> = ({ page }) => {
    const content = CONTENT[page] || {
        title: page
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
        sections: [
            {
                heading: 'Coming Soon',
                body: `The content for the ${page.replace(/-/g, ' ')} page is currently under development. Please check back later.`,
            },
        ],
    };

    const metaDescription = typeof content.sections?.[0]?.body === 'string'
        ? content.sections[0].body.substring(0, 160)
        : `Learn more about ${content.title} at Lumex Research.`;

    return (
        <div className="py-12 bg-lumex-bg min-h-[70vh]">
            <Helmet>
                <title>{content.title}</title>
                <meta name="description" content={metaDescription} />
            </Helmet>
            <Container>
                <div className="max-w-4xl">
                    <h1 className="text-4xl font-serif font-bold text-lumex-text mb-10 pb-6 border-b border-lumex-border">
                        {content.title}
                    </h1>

                    {content.customContent ? (
                        content.customContent
                    ) : (
                        <div className="space-y-12">
                            {content.sections?.map((section) => (
                                <section key={String(section.heading)}>
                                    <h2 className="text-2xl font-bold text-lumex-text mb-4">
                                        {section.heading}
                                    </h2>
                                    <div className="text-lumex-muted leading-relaxed text-lg">
                                        {section.body}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};
