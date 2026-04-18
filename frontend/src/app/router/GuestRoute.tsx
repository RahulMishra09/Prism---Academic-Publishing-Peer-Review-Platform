import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface GuestRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

/**
 * GuestRoute
 * Inverse of ProtectedRoute. Redirects already-authenticated users away from
 * guest-only pages (login, register, forgot-password) back to the home page.
 */
export const GuestRoute: React.FC<GuestRouteProps> = ({
    children,
    redirectTo = '/',
}) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};
