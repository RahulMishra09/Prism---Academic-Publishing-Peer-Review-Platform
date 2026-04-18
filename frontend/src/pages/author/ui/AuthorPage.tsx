import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../../../shared/ui';

export const AuthorPage: React.FC = () => {
    const { authorId } = useParams<{ authorId: string }>();

    return (
        <div className="py-12 min-h-[70vh] bg-lumex-bg-light">
            <Container>
                <div className="max-w-2xl">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-lumex-blue/10 flex items-center justify-center text-3xl font-serif font-bold text-lumex-blue">
                            {authorId?.[0]?.toUpperCase() ?? 'A'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-lumex-text">
                                Author Profile
                            </h1>
                            <p className="text-gray-500 text-sm font-mono mt-1">ID: {authorId}</p>
                        </div>
                    </div>
                    <div className="bg-white border border-lumex-border rounded-lg p-6">
                        <p className="text-gray-500 italic text-sm">
                            Author profile pages will display publications, affiliations, and
                            co-author networks once the backend API is integrated.
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
};
