import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { GlobalHeader, TopBanner, GlobalFooter } from '../../widgets';
import { ScrollToTop } from '../../shared/ui/ScrollToTop/ScrollToTop';

export function PageLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-lumex-bg">
            <Helmet titleTemplate="%s | Lumex Research" defaultTitle="Lumex Research | Advancing Discovery">
                <meta name="description" content="Lumex is a leading global research publisher, dedicated to advancing discovery by publishing robust and insightful science." />
                <meta property="og:site_name" content="Lumex Research" />
                <meta property="og:type" content="website" />
            </Helmet>
            <ScrollToTop />
            <div className="sticky top-0 z-50 w-full">
                <TopBanner />
                <GlobalHeader />
            </div>

            {/* Main content area */}
            <main className="flex-1">
                <Outlet />
            </main>

            <GlobalFooter />
        </div >
    );
}
