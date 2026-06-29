/**
 * alertDigest.ts
 *
 * Called whenever one or more articles are newly published.
 * Queries all saved alerts, groups matching articles per user,
 * and fires a single digest email per user (fire-and-forget).
 */

import { prisma } from "../config/prisma.js";
import { sendAlertDigestEmail } from "./email.js";

interface PublishedArticle {
  id:           string;
  doi:          string;
  title:        string;
  discipline:   string;
  keywords:     string[];
  journalId:    string | null;
  journal:      { title: string; slug: string } | null;
}

/**
 * Dispatch alert digest emails for the given set of newly-published articles.
 *
 * @param articles - Articles that were just published (include journal relation).
 */
export async function dispatchAlertDigest(articles: PublishedArticle[]): Promise<void> {
  if (articles.length === 0) return;

  // Fetch all active alerts with owner details
  const alerts = await prisma.alert.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (alerts.length === 0) return;

  // Build a map: userId → list of matching articles
  const matchMap = new Map<string, { user: { name: string; email: string }; matches: PublishedArticle[] }>();

  for (const alert of alerts) {
    const matched = articles.filter((article) => articleMatchesAlert(article, alert));
    if (matched.length === 0) continue;

    const key = alert.userId;
    if (!matchMap.has(key)) {
      matchMap.set(key, { user: alert.user, matches: [] });
    }
    // Deduplicate articles across multiple matching alerts for the same user
    const entry = matchMap.get(key)!;
    for (const m of matched) {
      if (!entry.matches.find((e) => e.id === m.id)) {
        entry.matches.push(m);
      }
    }
  }

  // Fire one email per user (all non-blocking)
  for (const [, { user, matches }] of matchMap) {
    void sendAlertDigestEmail({
      to:       user.email,
      userName: user.name,
      articles: matches.map((a) => ({
        title:        a.title,
        doi:          a.doi,
        discipline:   a.discipline,
        journalTitle: a.journal?.title ?? null,
      })),
    });
  }
}

// ── Matching logic ────────────────────────────────────────────────────────────

type AlertRecord = {
  type:       string;
  query:      string | null;
  journalId:  string | null;
  discipline: string | null;
};

function articleMatchesAlert(article: PublishedArticle, alert: AlertRecord): boolean {
  switch (alert.type) {
    case "KEYWORD":
      return matchesKeyword(article, alert.query ?? "");

    case "JOURNAL":
      return alert.journalId !== null && article.journalId === alert.journalId;

    case "DISCIPLINE":
      return (
        alert.discipline !== null &&
        article.discipline.toLowerCase() === alert.discipline.toLowerCase()
      );

    case "AUTHOR":
      // For alert type AUTHOR the query holds the author name/ORCID.
      // A full implementation would check ArticleAuthor records;
      // here we do a best-effort keyword check on title.
      return matchesKeyword(article, alert.query ?? "");

    default:
      return false;
  }
}

function matchesKeyword(article: PublishedArticle, query: string): boolean {
  if (!query.trim()) return false;
  const q = query.toLowerCase();
  return (
    article.title.toLowerCase().includes(q) ||
    article.discipline.toLowerCase().includes(q) ||
    article.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
