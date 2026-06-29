import React from 'react';
import { Container } from '../../../shared/ui';
import { useAuthStore } from '../../../app/store/useAuthStore';
import { canManageJournal } from '../../../shared/lib/roles';
import { JournalAdminDashboard } from '../../../features/journal-admin';

export const JournalAdminPage: React.FC = () => {
    const role = useAuthStore(s => s.user?.role);

    if (!canManageJournal(role)) {
        return (
            <Container className="py-24 text-center">
                <p className="text-5xl mb-4">🔒</p>
                <h1 className="text-2xl font-bold text-lumex-text mb-2">Access Denied</h1>
                <p className="text-lumex-muted">Journal administration requires Chief Editor or Administrator access.</p>
            </Container>
        );
    }

    return <JournalAdminDashboard />;
};
