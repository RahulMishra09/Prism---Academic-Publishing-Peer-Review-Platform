import { useAuthStore } from '../../app/store/useAuthStore';
import { Link } from '@shared/ui';
const UniversityIcon = () => (
    <svg className="h-3.5 w-3.5 opacity-80 text-lumex-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 4.5v1H3V7.5L12 3zm0 0v18M3 21h18M5 10v8m4-8v8m4-8v8m4-8v8" />
    </svg>
);
const LockOpenIcon = () => (
    <svg className="h-3.5 w-3.5 opacity-80 text-lumex-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="11" width="18" height="11" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 019.9-1" />
    </svg>
);

export function TopBanner() {
    const institution = useAuthStore(state => state.institution);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return (
        <div className="w-full border-b border-lumex-border bg-lumex-bg-deep py-2">
            <div className="mx-auto flex w-full max-w-container items-center justify-between px-6">
                <div className="flex items-center gap-2.5 text-[0.7rem] sm:text-xs">
                    {institution ? (
                        <>
                            <UniversityIcon />
                            <span className="text-lumex-muted font-medium">
                                Access provided by <strong className="text-lumex-text font-bold decoration-lumex-blue/30 underline-offset-4 hover:underline cursor-default transition-all">{institution.name}</strong>
                            </span>
                        </>
                    ) : (
                        <>
                            <LockOpenIcon />
                            <span className="text-lumex-muted font-medium">
                                <strong className="text-lumex-text font-bold">Open Access Month</strong>
                                <span className="hidden sm:inline"> — All articles freely available through March 2025</span>
                            </span>
                        </>
                    )}
                </div>
                <div className="hidden items-center gap-6 text-[0.7rem] sm:text-xs font-semibold uppercase tracking-wider text-lumex-muted sm:flex">
                    {!isAuthenticated && (
                        <div className="flex items-center gap-4 border-r border-lumex-border pr-6">
                            <Link to="/login" className="cursor-pointer transition-colors hover:text-lumex-blue">Sign In</Link>
                            <Link to="/register" className="cursor-pointer transition-colors hover:text-lumex-blue">Register</Link>
                        </div>
                    )}
                    <span className="cursor-pointer transition-colors hover:text-lumex-blue">Institutional Access</span>
                    <span className="cursor-pointer transition-colors hover:text-lumex-blue">Help</span>
                </div>
            </div>
        </div>
    );
}
