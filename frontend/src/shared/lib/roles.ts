import type { UserRole } from '../types/user.types';

// ── Role hierarchy (higher number = more privileges) ────────────────────
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    reader: 0,
    author: 1,
    reviewer: 2,
    editor: 3,
    'associate-editor': 4,
    'chief-editor': 5,
    admin: 6,
};

// ── Role groups for route guards ────────────────────────────────────────
/** Roles that may access the Editor Dashboard */
export const EDITOR_ROLES: UserRole[] = ['editor', 'associate-editor', 'chief-editor', 'admin'];

/** Roles that may access the Reviewer Dashboard */
export const REVIEWER_ROLES: UserRole[] = ['reviewer', 'admin'];

/** Roles that may access the Journal Admin panel (create/edit/archive journals) */
export const JOURNAL_ADMIN_ROLES: UserRole[] = ['chief-editor', 'admin'];

/** Only admin role can access the super-admin panel */
export const ADMIN_ROLES: UserRole[] = ['admin'];

// ── Permission helpers ──────────────────────────────────────────────────

/** Any authenticated user with author+ can submit manuscripts */
export const canSubmit = (role?: UserRole | null): boolean =>
    !!role && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.author;

/** Only reviewers (and admins) can review manuscripts */
export const canReview = (role?: UserRole | null): boolean =>
    !!role && (role === 'reviewer' || role === 'admin');

/** editor, associate-editor, chief-editor, admin */
export const canViewEditorDashboard = (role?: UserRole | null): boolean =>
    !!role && EDITOR_ROLES.includes(role);

/** associate-editor, chief-editor, admin */
export const canAssignReviewers = (role?: UserRole | null): boolean =>
    !!role && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY['associate-editor'];

/** associate-editor, chief-editor, admin */
export const canMakeDecision = (role?: UserRole | null): boolean =>
    !!role && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY['associate-editor'];

/** chief-editor, admin */
export const canViewAnalytics = (role?: UserRole | null): boolean =>
    !!role && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY['chief-editor'];

/** chief-editor, admin */
export const canManageJournal = (role?: UserRole | null): boolean =>
    !!role && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY['chief-editor'];

/** chief-editor, admin — can create new journals */
export const canCreateJournal = (role?: UserRole | null): boolean =>
    !!role && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY['chief-editor'];

/** chief-editor, admin — can create and manage special issues */
export const canManageSpecialIssues = (role?: UserRole | null): boolean =>
    !!role && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY['chief-editor'];

/** Check if a role is any of the editor sub-roles */
export const isEditorRole = (role?: UserRole | null): boolean =>
    !!role && ['editor', 'associate-editor', 'chief-editor'].includes(role);

/** Human-readable label for a role */
export const getRoleLabel = (role: UserRole): string => {
    const labels: Record<UserRole, string> = {
        reader: 'Reader',
        author: 'Author',
        reviewer: 'Reviewer',
        editor: 'Editor',
        'associate-editor': 'Associate Editor',
        'chief-editor': 'Chief Editor',
        admin: 'Administrator',
    };
    return labels[role] ?? role;
};
