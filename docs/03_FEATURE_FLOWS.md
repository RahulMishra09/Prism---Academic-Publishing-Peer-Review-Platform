# Lumex Frontend Replica — Feature Flows

## 1. Home Page Flow
**Route:** `/`
**Components Used:** GlobalHeader → HomeHero → DisciplineGrid → FeaturedJournals → NewsSection → GlobalFooter

**Sections:**
1. Sticky top nav with mega-menu (discipline categories)
2. Hero search bar (journals, articles, books)
3. Browse by discipline grid (25+ disciplines with icons)
4. Featured/highlighted journals carousel
5. Latest news + blog posts
6. Publisher highlights (LumexOpen, LumexLink stats)
7. Footer with links

---

## 2. Journal Home Page Flow
**Route:** `/journal/{journal-slug}`
**Components:** GlobalHeader → JournalHero → Tabs(Articles/Issues/About/Submit) → JournalSidebar → GlobalFooter

**Sections:**
1. Journal cover image + title + ISSN + metrics (Impact Factor, CiteScore)
2. Open Access badge / Access type indicator
3. Tabs:
   - **Articles** — latest published, editor's choice, most accessed
   - **Issues** — volumes/issues archive
   - **About** — aims & scope, editorial board link
   - **Submission Guidelines** — link to submission page
4. Sidebar: metrics, abstracting & indexing, submission link

---

## 3. Article Page Flow
**Route:** `/article/{doi}`
**Components:** GlobalHeader → ArticleHero → Tabs(Abstract/FullText/Figures/References) → ArticleSidebar → CitationTools → RelatedContent → GlobalFooter

**Sections:**
1. Article hero: title, authors (linked), affiliations, dates, DOI, access badge
2. Action bar: Download PDF, HTML, Share, Cite, Bookmark
3. Tabs:
   - **Abstract** — structured abstract with sections
   - **Full Text** (if access) — JATS XML rendered as HTML sections
   - **Figures & Tables** — gallery with captions
   - **References** — numbered refs with DOI links
4. Sticky sidebar TOC (scrollspy)
5. Related articles panel
6. Altmetric/citation count badges

---

## 4. Search Flow
**Route:** `/search?query=...&filters=...`
**Components:** GlobalHeader → SearchFilterPanel → SearchResultsList → Pagination

**Steps:**
1. User types in header search bar → typeahead suggestions appear (debounced 300ms)
2. Submit → navigate to /search with query params
3. Results page: left filter panel, center results, sort controls
4. Filters: Content Type, Discipline, Date Range, Language, Access Type, Journal
5. Each result: ArticleCard or BookCard depending on type
6. Pagination: 20 results per page
7. Advanced search toggle: field-specific search (title, author, abstract, ISSN, DOI)

---

## 5. Article Access & PDF Flow
**Components:** AccessGate → PDFViewer / HTMLViewer → DownloadOptions

**Access Logic (accessUtils.ts):**
- `open_access` → show full HTML + PDF download
- `subscribed` (mock auth) → show full content
- `requires_purchase` → show abstract only + buy button (Checkout page)
- `free_to_read` → full access flagged articles

**PDF Viewer:**
- Uses pdfjs-dist embedded inline
- Page navigation, zoom, full-screen
- Download button

---

## 6. Manuscript Submission Flow
**Route:** `/journal/{slug}/submit`
**Components:** SubmissionWizard (5-step stepper)

**Steps:**
1. **Manuscript Type** — Research Article, Review, Letter, Editorial, Case Study
2. **Authors** — Add/reorder authors, ORCID field, corresponding author flag, affiliations
3. **Upload** — Drag & drop: main doc (DOCX/PDF), figures, supplementary files; file type validation
4. **Metadata** — Title, abstract (with character counter), keywords (tag input), cover letter, suggested reviewers
5. **Review & Submit** — Preview all, agree to T&C, submit button → success state

---

## 7. Editorial Board Page
**Route:** `/journal/{slug}/editors`
**Components:** EditorialBoardPage → AuthorCard grid with role labels (Editor-in-Chief, Section Editor, etc.)

---

## 8. Auth Flow
**Routes:** `/login`, `/register`, `/forgot-password`

**Login Options:**
- Email + password form
- ORCID login button (OAuth mock)
- Institutional access (Shibboleth mock)

**Register:** Full academic profile: name, email, password, affiliation, ORCID, research interests (multi-select disciplines)

---

## 9. My Account Flow
**Route:** `/account` (protected)
**Tabs:** Profile, Saved Articles, Alerts, Submissions, Orders

---

## 10. Open Access / APC Page
**Route:** `/journal/{slug}/open-access`
- APC pricing table
- Waiver/discount info
- License options (CC-BY, CC-BY-NC-ND, etc.)
- FAQ accordion

---

## 11. Browse Journals A–Z
**Route:** `/journals`
- Alphabetical index (A–Z buttons)
- Filter by discipline / access type
- Journal cards in grid

---

## 12. Book / Chapter Flow
**Route:** `/book/{isbn}`, `/chapter/{doi}`
- Book cover, metadata (ISBN, edition, publisher, year)
- Table of contents with chapter links
- Chapter-level access gates
- Citation export same as articles

---

## 13. Checkout / Purchase Flow
**Route:** `/checkout`
- Article purchase: one-time buy
- Rental option (48hr access)
- Institutional invoice option
- Order confirmation page

---

## 14. Article Alerts
**Route:** `/journal/{slug}/alerts`
- Email alert signup for new issues / TOC alerts
- Keyword alerts
- Author alerts

---

## 15. Peer Review Dashboard (Reviewer)
**Route:** `/account/reviews`
- Pending invitations
- Active reviews
- Completed reviews
- ReviewForm: Accept/Decline → Detailed review form with criteria scoring + free text comments

---

## 16. Static Pages
- About Lumex
- Contact Us
- Privacy Policy
- Terms & Conditions
- Cookie Policy
- Accessibility
- Help / FAQ
