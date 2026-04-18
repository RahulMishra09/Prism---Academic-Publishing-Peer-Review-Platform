import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchWithFallback } from '../../shared/api/fetchWithFallback';

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    institution?: string;
    orcid?: string;
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
                    const loginRes = await fetchWithFallback<{ data: { user: AuthUser & { affiliation?: string }, accessToken: string } }>(
                        '/api/auth/login',
                        '/mock-data/auth-login.json',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        }
                    );

                    const { user, accessToken } = 'data' in loginRes ? loginRes.data : (loginRes as unknown as { data: { user: AuthUser & { affiliation?: string }, accessToken: string } }).data;

                    // Persist token so fetchClient can attach it to future requests
                    localStorage.setItem('mock_token', accessToken);

                    set({
                        user: {
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            institution: user.affiliation,
                            orcid: user.orcid,
                        },
                        isAuthenticated: true,
                        accessToken,
                        isLoading: false,
                    });
                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Login failed',
                        isLoading: false,
                    });
                }
            },

            logout: () => {
                localStorage.removeItem('mock_token');
                set({
                    user: null,
                    isAuthenticated: false,
                    accessToken: null,
                });
            },

            checkInstitutionalAccess: async () => {
                set({ isCheckingAccess: true });
                try {
                    // In a real app, this pings the backend which checks the user's IP
                    // against a database of institutional networks.
                    const data = await fetchWithFallback<{ institution: InstitutionalAccess }>(
                        '/api/auth/ip-check',
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
