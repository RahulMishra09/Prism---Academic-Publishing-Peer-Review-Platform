import { useAuthStore } from '../../app/store/useAuthStore';
import { Link } from '@shared/ui';
import { FaUniversity, FaLockOpen } from 'react-icons/fa';

export function TopBanner() {
    const institution = useAuthStore(state => state.institution);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    return (
        <div className="w-full border-b border-lumex-border bg-lumex-bg-deep py-2">
            <div className="mx-auto flex w-full max-w-container items-center justify-between px-6">
                <div className="flex items-center gap-2.5 text-[0.7rem] sm:text-xs">
                    {institution ? (
                        <>
                            <FaUniversity className="text-lumex-blue opacity-80" size={14} />
                            <span className="text-lumex-muted font-medium">
                                Access provided by <strong className="text-lumex-text font-bold decoration-lumex-blue/30 underline-offset-4 hover:underline cursor-default transition-all">{institution.name}</strong>
                            </span>
                        </>
                    ) : (
                        <>
                            <FaLockOpen className="text-lumex-blue opacity-80" size={13} />
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
