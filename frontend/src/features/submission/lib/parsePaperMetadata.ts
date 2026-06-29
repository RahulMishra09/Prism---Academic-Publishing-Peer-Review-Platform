/**
 * parsePaperMetadata.ts
 *
 * Client-side manuscript parser that extracts author metadata from uploaded
 * PDF or DOCX files, similar to Springer's auto-fill feature.
 *
 * Uses pdfjs-dist for PDFs and mammoth for DOCX.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ParsedAuthor {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    institution: string;
    department: string;
    city: string;
    country: string;
    orcid: string;
    isCorresponding: boolean;
}

export interface ParsedPaperMetadata {
    title: string;
    authors: ParsedAuthor[];
    abstract: string;
    keywords: string[];
    emails: string[];
    phones: string[];
    orcids: string[];
}

// ── Regex Patterns ─────────────────────────────────────────────────────────────

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const PHONE_RE =
    /(?:\+?\d{1,3}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/g;

const ORCID_RE = /\d{4}-\d{4}-\d{4}-\d{3}[\dX]/g;

// Common patterns for affiliation blocks
const AFFILIATION_LINE_RE =
    /^[\s]*(?:[¹²³⁴⁵⁶⁷⁸⁹⁰]+|[*†‡§‖¶#]+|\d{1,2})\s*[.)\-–—]?\s*(.+)/;

// ── PDF Text Extraction ────────────────────────────────────────────────────────

async function extractTextFromPDF(file: File): Promise<string> {
    const pdfjsLib = await import('pdfjs-dist');

    // Set the worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
    ).toString();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Only parse first 3 pages (author info is always in the header)
    const pagesToRead = Math.min(pdf.numPages, 3);
    const textChunks: string[] = [];

    for (let i = 1; i <= pagesToRead; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .join(' ');
        textChunks.push(pageText);
    }

    return textChunks.join('\n\n--- PAGE BREAK ---\n\n');
}

// ── DOCX Text Extraction ───────────────────────────────────────────────────────

async function extractTextFromDOCX(file: File): Promise<string> {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

// ── Extraction Helpers ─────────────────────────────────────────────────────────

function extractEmails(text: string): string[] {
    const matches = text.match(EMAIL_RE) || [];
    // Deduplicate and filter out obvious non-author emails
    const filtered = matches.filter(
        (e) =>
            !e.includes('journal') &&
            !e.includes('publisher') &&
            !e.includes('editor@') &&
            !e.includes('noreply') &&
            !e.includes('support@')
    );
    return [...new Set(filtered)];
}

function extractPhones(text: string): string[] {
    const matches = text.match(PHONE_RE) || [];
    // Filter out numbers that are too short (likely years or references)
    const filtered = matches.filter((p) => {
        const digitsOnly = p.replace(/\D/g, '');
        return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    });
    return [...new Set(filtered)];
}

function extractOrcids(text: string): string[] {
    const matches = text.match(ORCID_RE) || [];
    return [...new Set(matches)];
}

function extractKeywords(text: string): string[] {
    // Look for "Keywords:" or "Key words:" pattern
    const kwMatch = text.match(
        /(?:keywords?|key\s*words?)\s*[:;–—]\s*(.+?)(?:\n|$)/i
    );
    if (!kwMatch) return [];

    return kwMatch[1]
        .split(/[;,·•]/)
        .map((kw) => kw.trim())
        .filter((kw) => kw.length > 1 && kw.length < 60);
}

function extractTitle(text: string): string {
    // The title is usually the first significant line of text
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

    for (const line of lines.slice(0, 15)) {
        // Skip short lines, headers like "Research Article", DOI lines, etc.
        if (line.length < 10) continue;
        if (/^(research|review|original|brief|case|letter|editorial)/i.test(line)) continue;
        if (/^doi[:.\s]/i.test(line)) continue;
        if (/^(received|accepted|published|volume|issue)/i.test(line)) continue;
        if (/^https?:\/\//.test(line)) continue;

        // This is likely the title
        return line.length > 300 ? line.slice(0, 300) : line;
    }

    return '';
}

function extractAbstract(text: string): string {
    const absMatch = text.match(
        /(?:^|\n)\s*(?:abstract|summary)\s*[:\-–—]?\s*\n?([\s\S]*?)(?:\n\s*(?:keywords?|key\s*words?|introduction|1\.\s|1\s+introduction|background)\s*[:\-–—]?)/i
    );
    if (!absMatch) return '';

    let abstract = absMatch[1].trim();
    // Cap at 3000 chars
    if (abstract.length > 3000) abstract = abstract.slice(0, 3000);
    return abstract;
}

// ── Author Name Extraction ─────────────────────────────────────────────────────

function extractAuthorNames(text: string): string[] {
    // Take a focused header region (first ~2000 chars)
    const header = text.slice(0, 2500);
    const lines = header.split('\n').map((l) => l.trim()).filter(Boolean);

    // Strategy 1: Look for lines between title and abstract containing name-like patterns
    let candidateBlock = '';
    let foundTitle = false;

    for (const line of lines) {
        // Skip very short or URL lines
        if (line.length < 3) continue;
        if (/^https?:\/\//.test(line)) continue;

        if (!foundTitle && line.length > 15) {
            foundTitle = true;
            continue;
        }

        // Stop at abstract
        if (/^\s*(abstract|summary)\s*[:\-–—]?/i.test(line)) break;
        // Stop at affiliation markers
        if (AFFILIATION_LINE_RE.test(line) && line.length > 60) break;

        if (foundTitle) {
            candidateBlock += ' ' + line;
        }
    }

    // Try to find comma/semicolon separated name lists
    // Clean up superscripts and special chars
    candidateBlock = candidateBlock
        .replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰*†‡§‖¶#]+/g, '')
        .replace(/\d+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Split by common author delimiters
    let names: string[] = [];

    if (candidateBlock.includes(' and ') || candidateBlock.includes(',')) {
        // Replace " and " with comma for uniform splitting
        const normalized = candidateBlock.replace(/\s+and\s+/gi, ', ');
        names = normalized
            .split(/[,;]/)
            .map((n) => n.trim())
            .filter((n) => {
                // Filter to entries that look like person names
                const parts = n.split(/\s+/);
                return (
                    parts.length >= 2 &&
                    parts.length <= 5 &&
                    parts.every((p) => /^[A-Z][a-zA-Z\-']+\.?$/.test(p)) &&
                    n.length > 3 &&
                    n.length < 60
                );
            });
    }

    return names;
}

function parseNameParts(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return { firstName: '', lastName: '' };
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };

    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(' ');
    return { firstName, lastName };
}

// ── Affiliation Extraction ─────────────────────────────────────────────────────

interface AffiliationBlock {
    index: number;
    text: string;
    institution: string;
    department: string;
    city: string;
    country: string;
}

function extractAffiliations(text: string): AffiliationBlock[] {
    const header = text.slice(0, 4000);
    const lines = header.split('\n').map((l) => l.trim()).filter(Boolean);
    const affiliations: AffiliationBlock[] = [];

    for (const line of lines) {
        const match = line.match(AFFILIATION_LINE_RE);
        if (!match) continue;

        const affText = match[1].trim();
        // Skip if it looks like a reference or section heading
        if (affText.length < 10 || affText.length > 300) continue;
        if (/^(abstract|introduction|method|result|conclusion)/i.test(affText)) continue;

        // Try to extract structured parts
        const parts = affText.split(',').map((p) => p.trim());
        const institution = parts[0] || '';
        const department =
            parts.find(
                (p) =>
                    /department|dept|school|faculty|division|center|centre|lab|institute/i.test(p)
            ) || '';
        const country =
            parts[parts.length - 1]?.length < 40 ? parts[parts.length - 1] : '';
        const city =
            parts.length > 2 && parts[parts.length - 2]?.length < 40
                ? parts[parts.length - 2]
                : '';

        affiliations.push({
            index: affiliations.length + 1,
            text: affText,
            institution: department ? institution : institution,
            department: department === institution ? '' : department,
            city,
            country,
        });
    }

    return affiliations;
}

// ── Main Parser ────────────────────────────────────────────────────────────────

export async function parsePaperMetadata(file: File): Promise<ParsedPaperMetadata> {
    let text: string;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (ext === 'pdf') {
        text = await extractTextFromPDF(file);
    } else if (ext === 'docx' || ext === 'doc') {
        text = await extractTextFromDOCX(file);
    } else {
        throw new Error(`Unsupported file format: .${ext}. Please upload a PDF or DOCX file.`);
    }

    if (!text || text.trim().length < 50) {
        throw new Error(
            'Could not extract enough text from the document. The file may be scanned or image-based.'
        );
    }

    // Extract raw data
    const emails = extractEmails(text);
    const phones = extractPhones(text);
    const orcids = extractOrcids(text);
    const title = extractTitle(text);
    const abstract = extractAbstract(text);
    const keywords = extractKeywords(text);
    const authorNames = extractAuthorNames(text);
    const affiliations = extractAffiliations(text);

    // Build author objects by matching names with emails/affiliations
    const authors: ParsedAuthor[] = authorNames.map((name, idx) => {
        const { firstName, lastName } = parseNameParts(name);

        // Try to match email by last name
        const matchedEmail =
            emails.find(
                (e) =>
                    e.toLowerCase().includes(lastName.toLowerCase()) ||
                    e.toLowerCase().includes(firstName.toLowerCase())
            ) || emails[idx] || '';

        // Use first available affiliation, or try to match by index
        const aff = affiliations[idx] || affiliations[0];

        return {
            firstName,
            lastName,
            email: matchedEmail,
            phone: phones[idx] || '',
            institution: aff?.institution || '',
            department: aff?.department || '',
            city: aff?.city || '',
            country: aff?.country || '',
            orcid: orcids[idx] || '',
            isCorresponding: idx === 0, // First author is usually corresponding
        };
    });

    // If we found emails but no author names, create authors from emails
    if (authors.length === 0 && emails.length > 0) {
        for (const email of emails) {
            const localPart = email.split('@')[0];
            // Try to derive name from email (e.g., john.doe@...)
            const nameParts = localPart.split(/[._\-]/).filter(Boolean);
            const firstName =
                nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : '';
            const lastName =
                nameParts[1]
                    ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
                    : '';

            const aff = affiliations[0];

            authors.push({
                firstName,
                lastName,
                email,
                phone: '',
                institution: aff?.institution || '',
                department: aff?.department || '',
                city: aff?.city || '',
                country: aff?.country || '',
                orcid: '',
                isCorresponding: authors.length === 0,
            });
        }
    }

    return {
        title,
        authors,
        abstract,
        keywords,
        emails,
        phones,
        orcids,
    };
}
