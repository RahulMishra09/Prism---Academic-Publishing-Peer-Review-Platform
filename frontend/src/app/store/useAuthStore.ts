import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL } from '../../shared/api/base';

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    role: 'READER' | 'AUTHOR' | 'REVIEWER' | 'EDITOR' | 'ADMIN';
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

export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

// Shape of backend success envelope: { success, message, data }
interface BackendAuthResponse {
    success: boolean;
    message: string;
    data: {
        user: { id: string; name: string; email: string; role: AuthUser['role'] };
        token: string;
    };
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
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    checkInstitutionalAccess: () => Promise<void>;
    setUser: (user: AuthUser) => void;
    clearError: () => void;
}

/** Parse "John Doe" → { firstName: "John", lastName: "Doe" } */
function splitName(name: string) {
    const parts = name.trim().split(/\s+/);
    return {
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' ') || (parts[0] ?? ''),
    };
}

async function callAuthApi(path: string, body: object): Promise<BackendAuthResponse> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const json = await res.json() as BackendAuthResponse & { message?: string; error?: string };
    if (!res.ok) {
        throw new Error(
            (json as unknown as { message?: string; error?: string }).message ||
            (json as unknown as { message?: string; error?: string }).error ||
            'Request failed'
        );
    }
    return json;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
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
                    const res = await callAuthApi('/auth/login', {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const { user: rawUser, token } = res.data;
                    const { firstName, lastName } = splitName(rawUser.name);

                    localStorage.setItem('mock_token', token);

                    set({
                        user: {
                            id: rawUser.id,
                            email: rawUser.email,
                            name: rawUser.name,
                            firstName,
                            lastName,
                            role: rawUser.role,
                        },
                        isAuthenticated: true,
                        accessToken: token,
                        isLoading: false,
                    });
                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Login failed',
                        isLoading: false,
                    });
                }
            },

            register: async (credentials: RegisterCredentials) => {
                set({ isLoading: true, error: null });
                try {
                    const res = await callAuthApi('/auth/register', {
                        name: `${credentials.firstName} ${credentials.lastName}`.trim(),
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const { user: rawUser, token } = res.data;
                    const { firstName, lastName } = splitName(rawUser.name);

                    localStorage.setItem('mock_token', token);

                    set({
                        user: {
                            id: rawUser.id,
                            email: rawUser.email,
                            name: rawUser.name,
                            firstName,
                            lastName,
                            role: rawUser.role,
                        },
                        isAuthenticated: true,
                        accessToken: token,
                        isLoading: false,
                    });
                } catch (err) {
                    set({
                        error: err instanceof Error ? err.message : 'Registration failed',
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
                    error: null,
                });
            },

            checkInstitutionalAccess: async () => {
                set({ isCheckingAccess: true });
                try {
                    const token = localStorage.getItem('mock_token');
                    const res = await fetch(`${API_BASE_URL}/auth/ip-check`, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    });
                    if (res.ok) {
                        const data = await res.json() as { data?: { institution?: InstitutionalAccess } };
                        const inst = data?.data?.institution;
                        if (inst) set({ institution: inst });
                    }
                } catch {
                    // non-critical — silently ignore
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
            name: 'prism-auth',
            partialize: state => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                accessToken: state.accessToken,
            }),
        }
    )
);
