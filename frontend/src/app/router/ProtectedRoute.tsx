import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../../shared/types/user.types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
    /** When provided, the user's role must be in this list to access the route. */
    allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute
 * Guards a route behind authentication. Redirects to /login if the user is
 * not authenticated, preserving the attempted URL in state so LoginPage can
 * redirect back after a successful login.
 *
 * When `allowedRoles` is supplied the user's role is checked against the list.
 * If the role doesn't match, the user is redirected to the home page.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    redirectTo = '/login',
    allowedRoles,
}) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const userRole = useAuthStore(state => state.user?.role);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
