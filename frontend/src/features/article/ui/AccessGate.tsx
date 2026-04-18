import React from 'react';
import type { Article, AccessLevel } from '../../../entities/article/model/types';
import { Button } from '../../../shared/ui';

export interface AccessGateProps {
    article: Article;
    onPurchase?: () => void;
    onSubscribe?: () => void;
}

const accessMessages: Record<
    AccessLevel,
    { title: string; description: string; showActions: boolean }
> = {
    open_access: {
        title: 'Open Access',
        description:
            'This article is published under an open access license. You are free to read and download.',
        showActions: false,
    },
    free_to_read: {
        title: 'Free to Read',
        description: 'This article is temporarily free to read.',
        showActions: false,
    },
    subscribed: {
        title: 'Full Access via Subscription',
        description:
            'You have full access to this article through your institutional or personal subscription.',
        showActions: false,
    },
    requires_purchase: {
        title: 'Purchase Access',
        description:
            'To access the full text of this article, you can purchase a PDF download or subscribe to get unlimited access.',
        showActions: true,
    },
};

export const AccessGate: React.FC<AccessGateProps> = ({ article, onPurchase, onSubscribe }) => {
    const info = accessMessages[article.accessLevel];

    if (!info.showActions) return null;

    return (
        <div className="my-10 border-2 border-lumex-border rounded-lg overflow-hidden shadow-md">
            {/* Header */}
            <div className="bg-lumex-blue px-6 py-4 flex items-center gap-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3 className="text-lg font-bold text-white">{info.title}</h3>
            </div>

            {/* Body */}
            <div className="bg-white px-6 py-6">
                <p className="text-lumex-text mb-6 leading-relaxed">{info.description}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                    {article.price && (
                        <Button
                            variant="primary"
                            onClick={onPurchase}
                            className="font-bold text-base px-6 py-3"
                        >
                            Buy this article
                            <span className="ml-2 font-normal">
                                ({article.currency || 'USD'} {article.price?.toFixed(2)})
                            </span>
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={onSubscribe}
                        className="font-bold text-base px-6 py-3"
                    >
                        Subscribe for unlimited access
                    </Button>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                    Institutional users may also access full-text articles through their library
                    subscriptions.
                    <a href="/info/access" className="text-lumex-blue hover:underline ml-1">
                        Learn more
                    </a>
                </p>
            </div>
        </div>
    );
};
