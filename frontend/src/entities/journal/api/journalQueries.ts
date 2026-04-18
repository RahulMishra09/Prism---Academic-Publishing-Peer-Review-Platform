import { useQuery } from '@tanstack/react-query';
import { fetchWithFallback } from '../../../shared/api/fetchWithFallback';
import { hasKey } from '../../../shared/lib/typeGuards';
import type { Journal } from '../model/types';
import type { ApiResponse, PaginatedResponse } from '../../../shared/types/api.types';

export const journalKeys = {
    all: ['journals'] as const,
    bySlug: (slug: string) => [...journalKeys.all, 'detail', slug] as const,
    list: (params: { page: number; pageSize: number; discipline?: string }) =>
        [...journalKeys.all, 'list', params] as const,
};

export function useJournal(slug: string) {
    return useQuery({
        queryKey: journalKeys.bySlug(slug),
        queryFn: async () => {
            const res = await fetchWithFallback<ApiResponse<Journal>>(
                `/journals/${slug}`,
                `/mock-data/journals.json`
            );
            // If we got the paginated fallback JSON, find by slug
            if (hasKey(res, 'journals')) {
                const fallback = res.journals as Journal[];
                const found = fallback.find(j => j.slug === slug);
                if (!found) throw new Error(`Journal "${slug}" not found in fallback data`);
                return found;
            }
            return (res).data;
        },
        enabled: !!slug,
    });
}

export function useJournalsList(params: { page: number; pageSize: number; discipline?: string }) {
    return useQuery({
        queryKey: journalKeys.list(params),
        queryFn: async () => {
            const searchParams = new URLSearchParams({
                page: params.page.toString(),
                pageSize: params.pageSize.toString(),
            });
            if (params.discipline) searchParams.append('discipline', params.discipline);

            const res = await fetchWithFallback<PaginatedResponse<Journal>>(
                `/journals?${searchParams.toString()}`,
                `/mock-data/journals.json`
            );

            // Fallback JSON uses { journals: [...], totalCount, ... } shape
            if (hasKey(res, 'journals')) {
                let journals = res.journals as Journal[];
                if (params.discipline) {
                    journals = journals.filter(j =>
                        j.discipline.some(
                            d => d.toLowerCase() === params.discipline!.toLowerCase()
                        )
                    );
                }
                const start = (params.page - 1) * params.pageSize;
                const sliced = journals.slice(start, start + params.pageSize);
                return {
                    data: sliced,
                    totalCount: journals.length,
                    page: params.page,
                    pageSize: params.pageSize,
                    totalPages: Math.ceil(journals.length / params.pageSize),
                } as PaginatedResponse<Journal>;
            }
            return res;
        },
    });
}
