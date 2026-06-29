import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchClient, ApiError } from '../../shared/api/base';
import { fetchWithFallback } from '../../shared/api/fetchWithFallback';
import type { UserRole } from '../../shared/types/user.types';

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    institution?: string;
    orcid?: string;
    role: UserRole;
}

export interface InstitutionalAccess {
    id: string;
    name: string;
    ipAddress: string;
    type: 'university' | 'corporate' | 'library';
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface AuthState {
    user: AuthUser | null;
    institution: InstitutionalAccess | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    isLoading: boolean;
    isCheckingAccess: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    verifyAuth: () => Promise<void>;
    checkInstitutionalAccess: () => Promise<void>;
    setUser: (user: AuthUser) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            user: null,
            institution: null,
            isAuthenticated: false,
            accessToken: null,
            isLoading: false,
            isCheckingAccess: false,
            error: null,

            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });
                try {
                    const loginRes = await fetchClient<{ data: { user: AuthUser & { affiliation?: string; role?: UserRole; name?: string }, accessToken: string, refreshToken?: string } }>(
                        '/auth/login',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        }
                    );

                    const { user, accessToken, refreshToken } = loginRes.data;

                    // Persist tokens so fetchClient can attach them to future requests
                    localStorage.setItem('mock_token', accessToken);
                    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

                    // Backend returns `name` as single field; split for firstName/lastName
                    const rawUser = user as AuthUser & { name?: string; affiliation?: string };
                    const firstName = rawUser.firstName || rawUser.name?.split(' ')[0] || '';
                    const lastName = rawUser.lastName || rawUser.name?.split(' ').slice(1).join(' ') || '';

                    set({
                        user: {
                            id: user.id,
                            email: user.email,
                            firstName,
                            lastName,
                            institution: rawUser.affiliation,
                            orcid: user.orcid,
                            role: (user.role?.toLowerCase() as UserRole) ?? 'reader',
                        },
                        isAuthenticated: true,
                        accessToken,
                        isLoading: false,
                    });
                } catch (err) {
                    const message = err instanceof ApiError
                        ? err.message
                        : err instanceof Error
                        ? err.message
                        : 'Login failed. Please try again.';
                    set({
                        error: message,
                        isLoading: false,
                    });
                }
            },

            logout: () => {
                // Fire-and-forget backend logout to revoke refresh token
                const token = localStorage.getItem('mock_token');
                if (token) {
                    fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }).catch(() => { /* ignore — clearing local state is enough */ });
                }
                localStorage.removeItem('mock_token');
                localStorage.removeItem('refresh_token');
                set({
                    user: null,
                    isAuthenticated: false,
                    accessToken: null,
                });
            },

            verifyAuth: async () => {
                const token = localStorage.getItem('mock_token');
                if (!token) return;

                try {
                    const res = await fetchClient<{ data: AuthUser & { name?: string; affiliation?: string; role?: UserRole; accessToken?: string } }>(
                        '/auth/me'
                    );
                    const u = res.data;
                    
                    let currentToken = token;
                    if (u.accessToken) {
                        localStorage.setItem('mock_token', u.accessToken);
                        currentToken = u.accessToken;
                    }
                    
                    const firstName = u.firstName || u.name?.split(' ')[0] || '';
                    const lastName = u.lastName || u.name?.split(' ').slice(1).join(' ') || '';

                    set({
                        user: {
                            id: u.id,
                            email: u.email,
                            firstName,
                            lastName,
                            institution: u.affiliation,
                            orcid: u.orcid,
                            role: (u.role?.toLowerCase() as UserRole) ?? 'reader',
                        },
                        isAuthenticated: true,
                        accessToken: currentToken,
                    });
                } catch {
                    // Token is invalid or expired — clear auth state
                    localStorage.removeItem('mock_token');
                    set({ user: null, isAuthenticated: false, accessToken: null });
                }
            },

            checkInstitutionalAccess: async () => {
                set({ isCheckingAccess: true });
                try {
                    // In a real app, this pings the backend which checks the user's IP
                    // against a database of institutional networks.
                    const data = await fetchWithFallback<{ institution: InstitutionalAccess }>(
                        '/auth/ip-check',
                        '/mock-data/auth-ip-check.json'
                    );
                    
                    const inst = 'institution' in data ? data.institution : (data as unknown as { institution: InstitutionalAccess }).institution;
                    if (inst) {
                        set({ institution: inst });
                    }
                } catch (error) {
                    console.error('Failed to check institutional access', error);
                } finally {
                    set({ isCheckingAccess: false });
                }
            },

            setUser: (user: AuthUser) => {
                set({ user, isAuthenticated: true });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'lumex-auth',
            partialize: state => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                accessToken: state.accessToken,
                // We generally DO NOT persist institutional access because IP can change,
                // but for mockup purposes or temporary VPN leases, we could.
                // We'll leave it out of persistence so it checks freshly on reload or is handled by interceptors.
            }),
        }
    )
);
