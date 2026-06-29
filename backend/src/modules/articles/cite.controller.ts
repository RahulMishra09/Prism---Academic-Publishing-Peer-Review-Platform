import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middleware/error.middleware.js";

const param = (v: string | string[]): string => (Array.isArray(v) ? v[0]! : v);

const fetchArticle = async (doi: string) => {
  const article = await prisma.article.findUnique({
    where: { doi: decodeURIComponent(doi), isPublished: true },
    select: {
      doi: true, title: true, abstract: true, publishedAt: true,
      language: true, articleType: true,
      journal: { select: { title: true, issn: true, eIssn: true } },
      authors: {
        orderBy: { order: "asc" },
        select: { firstName: true, lastName: true },
      },
    },
  });
  if (!article) throw new AppError("Article not found", 404);
  return article;
};

type ArticleData = Awaited<ReturnType<typeof fetchArticle>>;

function toBibTeX(a: ArticleData): string {
  const key    = a.doi.replace(/[^a-zA-Z0-9]/g, "_");
  const year   = a.publishedAt ? new Date(a.publishedAt).getFullYear() : "n.d.";
  const authors = a.authors.map(au => `${au.lastName}, ${au.firstName}`).join(" and ");
  const lines = [
    `@article{${key},`,
    `  title     = {${a.title}},`,
    `  author    = {${authors || "Unknown"}},`,
    `  journal   = {${a.journal?.title ?? ""}},`,
    `  year      = {${year}},`,
    `  doi       = {${a.doi}},`,
    a.journal?.issn ? `  issn      = {${a.journal.issn}},` : null,
    `}`,
  ];
  return lines.filter(Boolean).join("\n");
}

function toRIS(a: ArticleData): string {
  const year = a.publishedAt ? new Date(a.publishedAt).getFullYear() : "";
  const lines = [
    "TY  - JOUR",
    `TI  - ${a.title}`,
    ...a.authors.map(au => `AU  - ${au.lastName}, ${au.firstName}`),
    a.journal?.title ? `JO  - ${a.journal.title}` : null,
    year ? `PY  - ${year}` : null,
    `DO  - ${a.doi}`,
    a.journal?.issn ? `SN  - ${a.journal.issn}` : null,
    `AB  - ${a.abstract ?? ""}`,
    "ER  -",
  ];
  return lines.filter(Boolean).join("\n");
}

function toAPA(a: ArticleData): string {
  const year  = a.publishedAt ? new Date(a.publishedAt).getFullYear() : "n.d.";
  const names = a.authors.map((au, i) => {
    const initials = au.firstName.split(" ").map(n => n[0] + ".").join(" ");
    return i === 0 ? `${au.lastName}, ${initials}` : `${initials} ${au.lastName}`;
  }).join(", ");
  const journal = a.journal?.title ?? "";
  return `${names || "Unknown Author"} (${year}). ${a.title}. ${journal}. https://doi.org/${a.doi}`;
}

function toMLA(a: ArticleData): string {
  const year    = a.publishedAt ? new Date(a.publishedAt).getFullYear() : "n.d.";
  const names   = a.authors.map((au, i) => i === 0 ? `${au.lastName}, ${au.firstName}` : `${au.firstName} ${au.lastName}`).join(", ");
  const journal = a.journal?.title ?? "";
  return `${names || "Unknown Author"}. "${a.title}." ${journal}, ${year}. DOI: ${a.doi}.`;
}

// ── GET /api/articles/:doi/cite ───────────────────────────────
export const citeArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const format = (req.query["format"] as string ?? "apa").toLowerCase();
    const article = await fetchArticle(param(req.params["doi"]));

    let body: string;
    let contentType: string;

    switch (format) {
      case "bibtex":
        body = toBibTeX(article);
        contentType = "application/x-bibtex";
        break;
      case "ris":
        body = toRIS(article);
        contentType = "application/x-research-info-systems";
        break;
      case "mla":
        body = toMLA(article);
        contentType = "text/plain; charset=utf-8";
        break;
      default: // apa
        body = toAPA(article);
        contentType = "text/plain; charset=utf-8";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="citation-${encodeURIComponent(article.doi)}.${format === "bibtex" ? "bib" : format === "ris" ? "ris" : "txt"}"`);
    res.status(200).send(body);
  } catch (err) { next(err); }
};
