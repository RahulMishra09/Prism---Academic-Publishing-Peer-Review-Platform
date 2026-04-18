export interface ConferencePaper {
    id: string;
    title: string;
    authors: string;
    citations: number;
}

export interface Conference {
    id: string;
    slug: string;
    title: string;
    date: string;
    location: string;
    about: string;
    topics: string[];
    papers: ConferencePaper[];
    price: number;
}
