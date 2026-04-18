import type { Author } from '../../article/model/types';

export interface Book {
    id: string;
    doi: string;
    isbn: string;
    title: string;
    subtitle?: string;
    authors?: Author[];
    editors?: Author[];
    edition?: string;
    publisher: string;
    publishYear: number;
    coverImageUrl?: string;
    type: 'monograph' | 'edited-volume' | 'textbook' | 'reference-work';
}

export interface BookChapter {
    id: string;
    doi: string;
    title: string;
    bookTitle: string;
    bookDoi: string;
    authors: Author[];
    pages: string;
    publishYear: number;
}
