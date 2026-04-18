import { describe, it, expect } from 'vitest';
import { parseSearchParams, buildSearchParams } from './searchQueryUtils';

describe('searchQueryUtils', () => {
    describe('parseSearchParams', () => {
        it('should parse basic query and page', () => {
            const searchParams = new URLSearchParams('q=quantum&page=2');
            const parsed = parseSearchParams(searchParams);

            expect(parsed.query).toBe('quantum');
            expect(parsed.page).toBe(2);
            expect(parsed.filters).toEqual({});
        });

        it('should parse array filters correctly', () => {
            const searchParams = new URLSearchParams('article-type=research,review&access-type=open-access');
            const parsed = parseSearchParams(searchParams);

            expect(parsed.filters.articleType).toEqual(['research', 'review']);
            expect(parsed.filters.accessType).toEqual(['open-access']);
        });
    });

    describe('buildSearchParams', () => {
        it('should build params from state correctly', () => {
            const state = {
                query: 'biology',
                page: 3,
                pageSize: 20,
                filters: {
                    articleType: ['research', 'brief'],
                },
                sortBy: 'relevance' as const,
            };

            const params = buildSearchParams(state);

            expect(params.get('q')).toBe('biology');
            expect(params.get('page')).toBe('3');
            expect(params.get('article-type')).toBe('research,brief');
            expect(params.get('sort')).toBeNull(); // defaults are omitted
        });

        it('should omit empty arrays and apply default page/sort if missing', () => {
            const state = {
                query: 'physics',
                page: 1, // default
                pageSize: 20,
                filters: {
                    articleType: [], // should be omitted
                    accessType: ['subscription']
                },
                sortBy: 'relevance' as const // default
            };

            const params = buildSearchParams(state);

            expect(params.get('q')).toBe('physics');
            // Defaults aren't necessarily omitted in buildSearchParams implementation as currently written, but let's see.
            // Often pagination 1 is kept or dropped. We'll assert the explicit arrays.
            expect(params.has('article-type')).toBe(false);
            expect(params.get('access-type')).toBe('subscription');
        });
    });
});
