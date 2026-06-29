import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PageLayout } from '../layouts';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { EDITOR_ROLES, REVIEWER_ROLES, JOURNAL_ADMIN_ROLES, ADMIN_ROLES } from '../../shared/lib/roles';
import { Container, Skeleton } from '../../shared/ui';
import { ErrorPage, NotFoundPage } from '../../pages/error';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────
const HomePage = lazy(() => import('../../pages/home').then(m => ({ default: m.HomePage })));
const SearchResultsPage = lazy(() =>
    import('../../pages/search').then(m => ({ default: m.SearchResultsPage }))
);
const JournalLayout = lazy(() =>
    import('../../pages/journal').then(m => ({ default: m.JournalLayout }))
);
const JournalHomePage = lazy(() =>
    import('../../pages/journal').then(m => ({ default: m.JournalHomePage }))
);
const JournalIssueListPage = lazy(() =>
    import('../../pages/journal').then(m => ({ default: m.JournalIssueListPage }))
);
const EditorialBoardPage = lazy(() =>
    import('../../pages/journal').then(m => ({ default: m.EditorialBoardPage }))
);
const AboutJournalPage = lazy(() =>
    import('../../pages/journal').then(m => ({ default: m.AboutJournalPage }))
);
const SubmissionGuidelinesPage = lazy(() =>
    import('../../pages/journal').then(m => ({ default: m.SubmissionGuidelinesPage }))
);
const OpenAccessPage = lazy(() =>
    import('../../pages/journal').then(m => ({ default: m.OpenAccessPage }))
);
const ArticlePage = lazy(() => import('../../pages/article').then(m => ({ default: m.ArticlePage })));
const ArticleReadingPage = lazy(() => import('../../pages/article').then(m => ({ default: m.ArticleReadingPage })));
const BookPage = lazy(() => import('../../pages/book').then(m => ({ default: m.BookPage })));
const ChapterPage = lazy(() => import('../../pages/chapter').then(m => ({ default: m.ChapterPage })));
const LoginPage = lazy(() => import('../../pages/account').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../../pages/account').then(m => ({ default: m.RegisterPage })));
const AccountDashboard = lazy(() =>
    import('../../pages/account').then(m => ({ default: m.AccountDashboard }))
);
const JournalListPage = lazy(() =>
    import('../../pages/journal-list').then(m => ({ default: m.JournalListPage }))
);
const BookListPage = lazy(() =>
    import('../../pages/book-list').then(m => ({ default: m.BookListPage }))
);
const ForgotPasswordPage = lazy(() =>
    import('../../pages/forgot-password').then(m => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
    import('../../pages/forgot-password').then(m => ({ default: m.ResetPasswordPage }))
);
const VerifyEmailPage = lazy(() =>
    import('../../pages/verify-email').then(m => ({ default: m.VerifyEmailPage }))
);
const StaticContentPage = lazy(() =>
    import('../../pages/static').then(m => ({ default: m.StaticContentPage }))
);
const AuthorPage = lazy(() => import('../../pages/author').then(m => ({ default: m.AuthorPage })));
const SubjectAreaPage = lazy(() =>
    import('../../pages/subject-area').then(m => ({ default: m.SubjectAreaPage }))
);
const DisciplinesPage = lazy(() =>
    import('../../pages/disciplines').then(m => ({ default: m.DisciplinesPage }))
);
const SubmissionPage = lazy(() =>
    import('../../pages/submission').then(m => ({ default: m.SubmissionPage }))
);
const RevisionForm = lazy(() => import('../../pages/submission').then(m => ({ default: m.RevisionForm })));
const ProofingPage = lazy(() => import('../../pages/submission').then(m => ({ default: m.ProofingPage })));
const CheckoutPage = lazy(() => import('../../pages/checkout').then(m => ({ default: m.CheckoutPage })));
const APCCheckoutPage = lazy(() => import('../../pages/checkout/ui/APCCheckoutPage').then(m => ({ default: m.APCCheckoutPage })));
const ConferencePage = lazy(() =>
    import('../../pages/conference').then(m => ({ default: m.ConferencePage }))
);
const ReviewerDashboard = lazy(() =>
    import('../../pages/reviewer').then(m => ({ default: m.ReviewerDashboard }))
);
const ReviewForm = lazy(() =>
    import('../../pages/reviewer').then(m => ({ default: m.ReviewForm }))
);
const CollectionsPage = lazy(() => import('../../pages/collections').then(m => ({ default: m.CollectionsPage })));
const CollectionDetailPage = lazy(() => import('../../pages/collections/ui/CollectionDetailPage').then(m => ({ default: m.CollectionDetailPage })));
const NewsPage = lazy(() => import('../../pages/news').then(m => ({ default: m.NewsPage })));
const NewsDetailPage = lazy(() => import('../../pages/news').then(m => ({ default: m.NewsDetailPage })));

const ContactPage = lazy(() => import('../../pages/contact').then(m => ({ default: m.ContactPage })));
const CareersPage = lazy(() => import('../../pages/careers').then(m => ({ default: m.CareersPage })));
const CareerDetailPage = lazy(() => import('../../pages/careers').then(m => ({ default: m.CareerDetailPage })));
const AuthorGuidelinesPage = lazy(() => import('../../pages/authors').then(m => ({ default: m.AuthorGuidelinesPage })));
const PdfTestPage = lazy(() => import('../../pages/pdf-test').then(m => ({ default: m.PdfTestPage })));
const AdminLayout = lazy(() => import('../../pages/admin').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('../../pages/admin').then(m => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import('../../pages/admin').then(m => ({ default: m.UserManagement })));
const SubmissionsAdmin = lazy(() => import('../../pages/admin').then(m => ({ default: m.SubmissionsAdmin })));
const ContentManagement = lazy(() => import('../../pages/admin').then(m => ({ default: m.ContentManagement })));
const ContactMessages = lazy(() => import('../../pages/admin').then(m => ({ default: m.ContactMessages })));
const SiteSettings = lazy(() => import('../../pages/admin').then(m => ({ default: m.SiteSettings })));
const EditorDashboard = lazy(() => import('../../pages/editor/ui/EditorDashboard').then(m => ({ default: m.EditorDashboard })));
const DecisionForm = lazy(() => import('../../pages/editor/ui/DecisionForm').then(m => ({ default: m.DecisionForm })));
const SubmissionDetailPage = lazy(() => import('../../pages/editor/ui/SubmissionDetailPage').then(m => ({ default: m.SubmissionDetailPage })));

// ── Journal Admin pages (lazy) ─────────────────────────────────────────────
const JournalAdminPage = lazy(() =>
    import('../../pages/journal-admin').then(m => ({ default: m.JournalAdminPage }))
);
const JournalCreatePage = lazy(() =>
    import('../../pages/journal-admin').then(m => ({ default: m.JournalCreatePage }))
);
const JournalEditPage = lazy(() =>
    import('../../pages/journal-admin').then(m => ({ default: m.JournalEditPage }))
);
const SpecialIssuePage = lazy(() =>
    import('../../pages/journal-admin').then(m => ({ default: m.SpecialIssuePage }))
);
const SpecialIssueCreatePage = lazy(() =>
    import('../../pages/journal-admin').then(m => ({ default: m.SpecialIssueCreatePage }))
);
const SpecialIssueLandingPage = lazy(() =>
    import('../../pages/journal-admin').then(m => ({ default: m.SpecialIssueLandingPage }))
);

// ── Page-level loading skeleton ──────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
const PageFallback = () => (
    <Container className="py-12 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-64 w-full" />
    </Container>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PageLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: 'search',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <SearchResultsPage />
                    </Suspense>
                ),
            },
            {
                path: 'article/:slug',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <ArticlePage />
                    </Suspense>
                ),
            },
            {
                path: 'book/:isbn',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <BookPage />
                    </Suspense>
                ),
            },
            {
                path: 'chapter/*',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <ChapterPage />
                    </Suspense>
                ),
            },
            {
                path: 'journals',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <JournalListPage />
                    </Suspense>
                ),
            },
            {
                path: 'books',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <BookListPage />
                    </Suspense>
                ),
            },
            {
                path: 'author/:authorId',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <AuthorPage />
                    </Suspense>
                ),
            },
            {
                path: 'subject/:subject',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <SubjectAreaPage />
                    </Suspense>
                ),
            },
            {
                path: 'disciplines',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <DisciplinesPage />
                    </Suspense>
                ),
            },
            // Journal nested routes
            {
                path: 'journal/:slug',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <JournalLayout />
                    </Suspense>
                ),
                children: [
                    { index: true, element: <JournalHomePage /> },
                    { path: 'issues', element: <JournalIssueListPage /> },
                    { path: 'editors', element: <EditorialBoardPage /> },
                    { path: 'about', element: <AboutJournalPage /> },
                    { path: 'submission-guidelines', element: <SubmissionGuidelinesPage /> },
                    { path: 'open-access', element: <OpenAccessPage /> },
                    {
                        path: 'submit',
                        element: (
                            <ProtectedRoute>
                                <Suspense fallback={<PageFallback />}>
                                    <SubmissionPage />
                                </Suspense>
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            // Auth routes
            {
                path: 'login',
                element: (
                    <GuestRoute>
                        <Suspense fallback={<PageFallback />}>
                            <LoginPage />
                        </Suspense>
                    </GuestRoute>
                ),
            },
            {
                path: 'register',
                element: (
                    <GuestRoute>
                        <Suspense fallback={<PageFallback />}>
                            <RegisterPage />
                        </Suspense>
                    </GuestRoute>
                ),
            },
            {
                path: 'forgot-password',
                element: (
                    <GuestRoute>
                        <Suspense fallback={<PageFallback />}>
                            <ForgotPasswordPage />
                        </Suspense>
                    </GuestRoute>
                ),
            },
            {
                path: 'reset-password',
                element: (
                    <GuestRoute>
                        <Suspense fallback={<PageFallback />}>
                            <ResetPasswordPage />
                        </Suspense>
                    </GuestRoute>
                ),
            },
            {
                path: 'verify-email',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <VerifyEmailPage />
                    </Suspense>
                ),
            },
            // Protected routes
            {
                path: 'account',
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<PageFallback />}>
                            <AccountDashboard />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'submit-revision/:id',
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<PageFallback />}>
                            <RevisionForm />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'submit-proofing/:id',
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<PageFallback />}>
                            <ProofingPage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'checkout/:doi',
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<PageFallback />}>
                            <CheckoutPage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'checkout-apc/:id',
                element: (
                    <ProtectedRoute>
                        <Suspense fallback={<PageFallback />}>
                            <APCCheckoutPage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'conference/:slug',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <ConferencePage />
                    </Suspense>
                ),
            },
            {
                path: 'reviewer',
                element: (
                    <ProtectedRoute allowedRoles={REVIEWER_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <ReviewerDashboard />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'reviewer/review/:id',
                element: (
                    <ProtectedRoute allowedRoles={REVIEWER_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <ReviewForm />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'editor',
                element: (
                    <ProtectedRoute allowedRoles={EDITOR_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <EditorDashboard />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'editor/decision/:id',
                element: (
                    <ProtectedRoute allowedRoles={EDITOR_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <DecisionForm />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'editor/submission/:id',
                element: (
                    <ProtectedRoute allowedRoles={EDITOR_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <SubmissionDetailPage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            // Journal Admin routes (chief-editor, admin only)
            {
                path: 'editor/journals',
                element: (
                    <ProtectedRoute allowedRoles={JOURNAL_ADMIN_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <JournalAdminPage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'editor/journals/create',
                element: (
                    <ProtectedRoute allowedRoles={JOURNAL_ADMIN_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <JournalCreatePage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'editor/journals/:slug/edit',
                element: (
                    <ProtectedRoute allowedRoles={JOURNAL_ADMIN_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <JournalEditPage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'editor/journals/:slug/special-issues',
                element: (
                    <ProtectedRoute allowedRoles={JOURNAL_ADMIN_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <SpecialIssuePage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            {
                path: 'editor/journals/:slug/special-issues/create',
                element: (
                    <ProtectedRoute allowedRoles={JOURNAL_ADMIN_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <SpecialIssueCreatePage />
                        </Suspense>
                    </ProtectedRoute>
                ),
            },
            // Public special issue landing page
            {
                path: 'journal/:slug/special-issue/:issueId',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <SpecialIssueLandingPage />
                    </Suspense>
                ),
            },
            // Static pages
            {
                path: 'about',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <StaticContentPage page="about" />
                    </Suspense>
                ),
            },
            {
                path: 'privacy-policy',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <StaticContentPage page="privacy" />
                    </Suspense>
                ),
            },
            {
                path: 'terms',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <StaticContentPage page="terms" />
                    </Suspense>
                ),
            },
            {
                path: 'collections',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <CollectionsPage />
                    </Suspense>
                ),
            },
            {
                path: 'collection/:slug',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <CollectionDetailPage />
                    </Suspense>
                ),
            },
            {
                path: 'news',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <NewsPage />
                    </Suspense>
                ),
            },
            {
                path: 'news/:slug',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <NewsDetailPage />
                    </Suspense>
                ),
            },

            {
                path: 'contact',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <ContactPage />
                    </Suspense>
                ),
            },
            {
                path: 'authors',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <AuthorGuidelinesPage />
                    </Suspense>
                ),
            },
            {
                path: 'careers',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <CareersPage />
                    </Suspense>
                ),
            },
            {
                path: 'careers/:id',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <CareerDetailPage />
                    </Suspense>
                ),
            },
            // Footer missing pages
            ...[
                { path: 'open-access', page: 'open-access' },
                { path: 'publish', page: 'submit-manuscript' },
                { path: 'institutions', page: 'institutional-access' },
                { path: 'librarians', page: 'library-partnerships' },
                { path: 'licensing', page: 'licensing-options' },
                { path: 'stats', page: 'usage-statistics' },
                { path: 'licenses', page: 'site-licenses' },
                { path: 'editors', page: 'editorial-board' },
                { path: 'cookies', page: 'cookies' },
                { path: 'accessibility', page: 'accessibility' },
                { path: 'sitemap', page: 'sitemap' }
            ].map(({ path, page }) => ({
                path,
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <StaticContentPage page={page} />
                    </Suspense>
                ),
            })),
            // Admin panel (ADMIN role only)
            {
                path: 'admin',
                element: (
                    <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                        <Suspense fallback={<PageFallback />}>
                            <AdminLayout />
                        </Suspense>
                    </ProtectedRoute>
                ),
                children: [
                    { index: true, element: <Suspense fallback={<PageFallback />}><AdminDashboard /></Suspense> },
                    { path: 'users', element: <Suspense fallback={<PageFallback />}><UserManagement /></Suspense> },
                    { path: 'submissions', element: <Suspense fallback={<PageFallback />}><SubmissionsAdmin /></Suspense> },
                    { path: 'content', element: <Suspense fallback={<PageFallback />}><ContentManagement /></Suspense> },
                    { path: 'messages', element: <Suspense fallback={<PageFallback />}><ContactMessages /></Suspense> },
                    { path: 'settings', element: <Suspense fallback={<PageFallback />}><SiteSettings /></Suspense> },
                ],
            },
            // PDF viewer test page
            {
                path: 'pdf-test',
                element: (
                    <Suspense fallback={<PageFallback />}>
                        <PdfTestPage />
                    </Suspense>
                ),
            },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
    {
        path: '/article/:slug/read',
        element: (
            <Suspense fallback={<PageFallback />}>
                <ArticleReadingPage />
            </Suspense>
        ),
    },
]);

