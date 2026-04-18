import React from 'react';
import { Container, Skeleton } from '../../../shared/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import { Link } from 'react-router-dom';

interface Collection {
    id: string;
    title: string;
    description: string;
    articleCount: number;
    imageUrl: string;
    slug: string;
    updatedAt: string;
}

export const CollectionsPage: React.FC = () => {
    const { data: collections = [], isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            const res = await fetchWithFallback<{ collections: Collection[] }>(
                '/collections',
                '/mock-data/collections.json'
            );
            return res.collections || [];
        },
    });

    return (
        <div className="py-12 bg-lumex-bg min-h-[70vh]">
            <Container>
                <div className="max-w-4xl mb-12">
                    <h1 className="text-4xl font-serif font-bold text-lumex-text mb-4">
                        Special Collections
                    </h1>
                    <p className="text-xl text-lumex-muted leading-relaxed">
                        Explore our curated selection of groundbreaking research focused on specific themes, global challenges, and emerging scientific fields.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading && (
                        ['skel-1', 'skel-2', 'skel-3', 'skel-4', 'skel-5', 'skel-6'].map((id) => (
                            <Skeleton key={id} className="h-80 w-full rounded-xl" />
                        ))
                    )}
                    {!isLoading && collections.length === 0 && (
                        <p className="col-span-full text-lumex-muted italic py-12 text-center">
                            No collections available at this time.
                        </p>
                    )}
                    {!isLoading && collections.length > 0 && (
                        collections.map((collection) => (
                            <Link
                                key={collection.id}
                                to={`/collection/${collection.slug}`}
                                className="group bg-lumex-card border border-lumex-border rounded-xl overflow-hidden hover:border-lumex-blue hover:shadow-lg transition-all flex flex-col h-full"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={collection.imageUrl}
                                        alt={collection.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-lumex-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-lumex-blue ring-1 ring-lumex-border/50">
                                        {collection.articleCount} Articles
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-lumex-text mb-3 group-hover:text-lumex-blue transition-colors">
                                        {collection.title}
                                    </h3>
                                    <p className="text-lumex-muted text-sm leading-relaxed mb-6 flex-grow">
                                        {collection.description}
                                    </p>
                                    <div className="text-xs text-lumex-sub font-medium flex items-center justify-between mt-auto">
                                        <span>Updated: {new Date(collection.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                        <span className="text-lumex-blue group-hover:underline">Explore →</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </Container>
        </div>
    );
};
