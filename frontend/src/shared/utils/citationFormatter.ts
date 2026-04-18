import type { Article } from '../../entities/article/model/types';
import { formatAuthorListAPA } from './authorUtils';
import { extractYear } from './dateUtils';

/** Generate an APA citation string for an article. */
export function toAPA(article: Article): string {
    const authors = formatAuthorListAPA(article.authors);
    const year = extractYear(article.publishedDate);
    const journal = article.journalTitle ?? '';
    return `${authors} (${year}). ${article.title}. *${journal}*. https://doi.org/${article.doi}`;
}

/** Generate an MLA citation string. */
export function toMLA(article: Article): string {
    const firstAuthor = article.authors[0];
    const authorStr = firstAuthor
        ? `${firstAuthor.lastName}, ${firstAuthor.firstName}`
        : 'Anonymous';
    const year = extractYear(article.publishedDate);
    return `${authorStr}. "${article.title}." *${article.journalTitle}*, ${year}, doi:${article.doi}.`;
}

/** Generate a BibTeX entry for an article. */
export function toBibTeX(article: Article): string {
    const key = `${article.authors[0]?.lastName ?? 'Unknown'}${extractYear(article.publishedDate)}`;
    const authorBib = article.authors.map(a => `${a.lastName}, ${a.firstName}`).join(' and ');
    const year = extractYear(article.publishedDate);
    return `@article{${key},
  author    = {${authorBib}},
  title     = {${article.title}},
  journal   = {${article.journalTitle}},
  year      = {${year}},
  doi       = {${article.doi}},
  url       = {https://doi.org/${article.doi}}
}`;
}

/** Generate a RIS citation entry for an article. */
export function toRIS(article: Article): string {
    const authorLines = article.authors.map(a => `AU  - ${a.lastName}, ${a.firstName}`).join('\n');
    const year = extractYear(article.publishedDate);
    return `TY  - JOUR
TI  - ${article.title}
${authorLines}
JO  - ${article.journalTitle}
PY  - ${year}
DO  - ${article.doi}
UR  - https://doi.org/${article.doi}
ER  -`;
}
