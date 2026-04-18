export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    orcid?: string;
    affiliation?: string;
    role: 'reader' | 'author' | 'reviewer' | 'editor' | 'admin';
    savedArticles: string[]; // DOIs
    alerts: AlertSetting[];
    orders: Order[];
    submissions: UserSubmission[];
    avatarUrl?: string;
}

export interface AlertSetting {
    id: string;
    type: 'journal-toc' | 'author' | 'keyword';
    target: string; // journal slug / author ID / keyword
    email: string;
    frequency: 'immediately' | 'weekly' | 'monthly';
    active: boolean;
}

export interface Order {
    id: string;
    doi: string;
    articleTitle: string;
    amount: number;
    currency: string;
    date: string;
    receiptUrl?: string;
    accessType: 'permanent' | '48hr';
}

export interface UserSubmission {
    id: string;
    title: string;
    journalSlug: string;
    status: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'published';
    submittedDate?: string;
    lastModifiedDate: string;
}
