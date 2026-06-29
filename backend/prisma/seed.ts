/**
 * prisma/seed.ts
 * Comprehensive seed — populates all tables from frontend mock data.
 * Run:  npx tsx prisma/seed.ts
 */

import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const prisma = new PrismaClient({ adapter, log: ["warn", "error"] });

const hash = (p: string) => bcrypt.hash(p, 10);
const now = new Date();
const future = (d: number) => new Date(now.getTime() + d * 86_400_000);
const past = (d: number) => new Date(now.getTime() - d * 86_400_000);

async function main() {
  console.log("🌱  Seeding Lumex database...\n");

  // ── CLEAN ─────────────────────────────────────────────────
  console.log("🗑   Cleaning...");
  const tables = [
    prisma.contactMessage, prisma.order, prisma.alert, prisma.viewHistory,
    prisma.verificationToken, prisma.userSavedArticle, prisma.userBookmark,
    prisma.subscription, prisma.submissionReview, prisma.submissionReviewer,
    prisma.submissionFile, prisma.submissionAuthor, prisma.submission,
    prisma.articleFigure, prisma.articleSupplementary, prisma.refreshToken,
    prisma.passwordResetToken, prisma.collectionArticle, prisma.articleMetrics,
    prisma.articleReference, prisma.articleAuthor, prisma.article,
    prisma.bookChapterAuthor, prisma.bookChapter, prisma.bookAuthor, prisma.book,
    prisma.collection, prisma.journalEditorialBoard, prisma.journalIssue,
    prisma.journal, prisma.affiliation, prisma.news, prisma.career,
    prisma.conference, prisma.siteConfig, prisma.homepageContent,
    prisma.comment, prisma.review, prisma.reviewerAssignment, prisma.paper,
    prisma.user,
  ] as { deleteMany: () => Promise<unknown> }[];
  for (const t of tables) await t.deleteMany();
  console.log("   ✅  Clean\n");

  // ══════════════════════════════════════════════════════════
  // 1. USERS  →  users table
  // ══════════════════════════════════════════════════════════
  console.log("👤  Users → users table");
  const [admin, editor, rev1, rev2, auth1, auth2, auth3, reader, reader2] =
    await Promise.all([
      prisma.user.create({ data: { name: "Admin User",     email: "admin@lumex.io",   password: await hash("Admin@123"),   role: "ADMIN",    isVerified: true } }),
      prisma.user.create({ data: { name: "Editor Jane",    email: "editor@lumex.io",  password: await hash("Editor@123"),  role: "EDITOR",   isVerified: true } }),
      prisma.user.create({ data: { name: "Alice Reviewer", email: "rev1@lumex.io",    password: await hash("Review@123"),  role: "REVIEWER", isVerified: true } }),
      prisma.user.create({ data: { name: "Bob Reviewer",   email: "rev2@lumex.io",    password: await hash("Review@123"),  role: "REVIEWER", isVerified: true } }),
      prisma.user.create({ data: { name: "Carlos Author",  email: "author1@lumex.io", password: await hash("Author@123"),  role: "AUTHOR",   isVerified: true, orcid: "0000-0001-2345-6789" } }),
      prisma.user.create({ data: { name: "Diana Author",   email: "author2@lumex.io", password: await hash("Author@123"),  role: "AUTHOR",   isVerified: true } }),
      prisma.user.create({ data: { name: "Elena Author",   email: "author3@lumex.io", password: await hash("Author@123"),  role: "AUTHOR",   isVerified: true, orcid: "0000-0003-4567-8901" } }),
      prisma.user.create({ data: { name: "Reader Eve",     email: "reader@lumex.io",  password: await hash("Reader@123"),  role: "READER",   isVerified: true } }),
      prisma.user.create({ data: { name: "Reader Frank",   email: "reader2@lumex.io", password: await hash("Reader@123"),  role: "READER" } }),
    ]);
  console.log("   ✅  9 users\n");

  // ══════════════════════════════════════════════════════════
  // 2. AFFILIATIONS  →  affiliations table
  // ══════════════════════════════════════════════════════════
  console.log("🏛   Affiliations → affiliations table");
  const [mit, oxford, stanford, ethz, cambridge, harvard, tokyo, sorbonne, maxPlanck, nus] =
    await Promise.all([
      prisma.affiliation.create({ data: { name: "MIT",                        department: "Computer Science",          country: "USA" } }),
      prisma.affiliation.create({ data: { name: "University of Oxford",       department: "Mathematics",               country: "UK" } }),
      prisma.affiliation.create({ data: { name: "Stanford University",        department: "Biology",                   country: "USA" } }),
      prisma.affiliation.create({ data: { name: "ETH Zurich",                 department: "Computer Science",          country: "Switzerland" } }),
      prisma.affiliation.create({ data: { name: "University of Cambridge",    department: "Cavendish Laboratory",      country: "UK" } }),
      prisma.affiliation.create({ data: { name: "Harvard University",         department: "Chemistry",                 country: "USA" } }),
      prisma.affiliation.create({ data: { name: "University of Tokyo",        department: "Physics",                   country: "Japan" } }),
      prisma.affiliation.create({ data: { name: "Sorbonne University",        department: "Earth Sciences",            country: "France" } }),
      prisma.affiliation.create({ data: { name: "Max Planck Institute",       department: "Neuroscience",              country: "Germany" } }),
      prisma.affiliation.create({ data: { name: "National University of Singapore", department: "Health Sciences",     country: "Singapore" } }),
    ]);
  console.log("   ✅  10 affiliations\n");

  // ══════════════════════════════════════════════════════════
  // 3. JOURNALS  →  journals, journal_issues, journal_editorial_board tables
  // ══════════════════════════════════════════════════════════
  console.log("📰  Journals → journals, journal_issues, journal_editorial_board");
  const journals = [];
  const journalData = [
    { slug: "artificial-intelligence-review",            title: "Artificial Intelligence Review",            discipline: "Computer Science",                issn: "0269-2821", eIssn: "1573-7462", impact: 13.9, oa: true,  desc: "State-of-the-art research in artificial intelligence and cognitive science." },
    { slug: "discover-sustainability",                   title: "Discover Sustainability",                   discipline: "Environmental Science",           issn: "2662-9984", eIssn: null,        impact: 3.0,  oa: true,  desc: "Open access journal publishing research across all fields relevant to sustainability." },
    { slug: "journal-of-epidemiology-and-global-health", title: "Journal of Epidemiology and Global Health", discipline: "Health Sciences",                 issn: "2210-6006", eIssn: "2210-6014", impact: 3.1,  oa: true,  desc: "Research on the epidemiology of communicable and non-communicable diseases globally." },
    { slug: "scientific-reports",                        title: "Scientific Reports",                        discipline: "Multidisciplinary",               issn: "2045-2322", eIssn: null,        impact: 3.8,  oa: true,  desc: "An open access journal publishing original research across all areas of the natural sciences." },
    { slug: "nature-communications",                     title: "Nature Communications",                     discipline: "Earth and Environmental Sciences", issn: "2041-1723", eIssn: null,       impact: 14.7, oa: true,  desc: "Open access journal publishing high-quality research across all areas of the natural sciences." },
    { slug: "nature-machine-intelligence",               title: "Nature Machine Intelligence",               discipline: "Computer Science",                issn: "2522-5839", eIssn: null,        impact: 18.8, oa: false, desc: "Research on machine learning, robotics, and AI spanning all sciences." },
    { slug: "nature-geoscience",                         title: "Nature Geoscience",                         discipline: "Earth Sciences",                  issn: "1752-0894", eIssn: "1752-0908", impact: 18.3, oa: false, desc: "High-impact research across the full range of the Earth sciences." },
  ];
  for (const j of journalData) {
    const journal = await prisma.journal.create({
      data: {
        slug: j.slug, title: j.title, description: j.desc, discipline: j.discipline,
        issn: j.issn, eIssn: j.eIssn, impactFactor: j.impact, isOpenAccess: j.oa,
        publisherName: "Lumex Publishing",
        issues: { create: [
          { volume: 12, issue: 1, year: 2026, publishedAt: past(30) },
          { volume: 11, issue: 4, year: 2025, publishedAt: past(120) },
        ]},
        editorialBoard: { create: [
          { name: `Prof. ${j.title.split(" ")[0]} Editor`, title: "Editor-in-Chief", institution: "MIT", order: 1 },
        ]},
      },
    });
    journals.push(journal);
  }
  console.log(`   ✅  ${journals.length} journals with issues & boards\n`);

  // Helper to find journal by slug
  const jBySlug = (s: string) => journals.find(j => j.slug === s) || journals[3]; // fallback to scientific-reports

  // Fetch first issue per journal for article linking
  const issueMap: Record<string, string> = {};
  for (const j of journals) {
    const iss = await prisma.journalIssue.findFirst({ where: { journalId: j.id } });
    if (iss) issueMap[j.slug] = iss.id;
  }

  // ══════════════════════════════════════════════════════════
  // 4. ARTICLES  →  articles, article_authors, article_references, article_metrics, article_figures tables
  // ══════════════════════════════════════════════════════════
  console.log("📄  Articles → articles, article_authors, article_references, article_metrics, article_figures");

  const articleDefs = [
    // From mock data (6 unique)
    { doi: "10.1038/s41598-024-00001-1", title: "Quantum Entanglement Dynamics in Multi-Particle Thermal Systems", abstract: "We investigated long-term trends in quantum entanglement entropy in closed systems undergoing thermalization. Results show significant non-trivial dynamics linked with system size.", keywords: ["quantum mechanics", "entanglement", "thermal systems"], discipline: "Physics", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "scientific-reports", trending: true, views: 4200, downloads: 890, citations: 67 },
    { doi: "10.1038/s41550-025-00002-6", title: "CRISPR-Cas9 Off-Target Effects in Mammalian Genome Editing", abstract: "Comprehensive analysis of non-target cleavage sites reveals high-frequency off-target activity in mammalian cells, with implications for therapeutic applications.", keywords: ["CRISPR", "genome editing", "off-target", "mammalian"], discipline: "Biology", type: "RESEARCH_ARTICLE" as const, access: "SUBSCRIPTION" as const, journal: "nature-machine-intelligence", trending: true, views: 3100, downloads: 650, citations: 42 },
    { doi: "10.1038/s41467-025-00003-8", title: "Urban Heat Island Dynamics and Green Infrastructure Mitigation", abstract: "A comparative study of thermal patterns in 50 global cities and mitigation strategies using green infrastructure.", keywords: ["urban heat", "green infrastructure", "climate", "cities"], discipline: "Environmental Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-communications", trending: true, views: 5600, downloads: 1200, citations: 89 },
    { doi: "10.1038/s41522-024-00004-5", title: "Biofilms: From the Cradle of Life to Life Support Systems", abstract: "A comprehensive review of biofilm formation and its implications for biotechnology and medical device design.", keywords: ["biofilms", "microbiology", "biotechnology"], discipline: "Biology", type: "REVIEW" as const, access: "OPEN_ACCESS" as const, journal: "scientific-reports", trending: false, views: 2800, downloads: 420, citations: 31 },
    { doi: "10.15252/embj.2024114890", title: "Conserved Shifts in Sperm Small Non-Coding RNA Profiles During Aging", abstract: "We report conserved changes in sperm small RNA profiles across mammals during aging, with potential implications for intergenerational epigenetic inheritance.", keywords: ["sperm RNA", "aging", "epigenetics", "non-coding RNA"], discipline: "Biology", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "discover-sustainability", trending: false, views: 1900, downloads: 310, citations: 18 },
    { doi: "10.1038/s41561-024-01300-x", title: "Evidence for Active Volcanism on Venus from Magellan Radar Data", abstract: "Analysis of Magellan radar images provides direct evidence for active volcanism on Venus, including surface changes over an 8-month period.", keywords: ["Venus", "volcanism", "Magellan", "planetary science"], discipline: "Earth Sciences", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-geoscience", trending: true, views: 8900, downloads: 2100, citations: 156 },
    // From existing seed (4)
    { doi: "10.1234/jcs.2026.001", title: "Deep Learning Advances in Natural Language Processing", abstract: "This paper surveys recent advances in deep learning applied to NLP tasks including sentiment analysis, machine translation, and question answering systems.", keywords: ["deep learning", "NLP", "transformers", "BERT"], discipline: "Computer Science", type: "REVIEW" as const, access: "OPEN_ACCESS" as const, journal: "artificial-intelligence-review", trending: true, views: 6540, downloads: 1320, citations: 95 },
    { doi: "10.1234/bio.2026.001", title: "CRISPR-Cas9 Applications in Gene Therapy", abstract: "A comprehensive review of CRISPR-Cas9 gene editing technology and its therapeutic applications in treating genetic disorders.", keywords: ["CRISPR", "gene therapy", "genome editing"], discipline: "Biology", type: "RESEARCH_ARTICLE" as const, access: "SUBSCRIPTION" as const, journal: "journal-of-epidemiology-and-global-health", trending: false, views: 1890, downloads: 320, citations: 22 },
    { doi: "10.1234/math.2026.001", title: "New Approaches to the Riemann Hypothesis", abstract: "This paper proposes novel approaches to tackling the Riemann Hypothesis using techniques from complex analysis and spectral theory.", keywords: ["Riemann hypothesis", "complex analysis", "spectral theory"], discipline: "Mathematics", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-communications", trending: true, views: 4100, downloads: 850, citations: 78 },
    { doi: "10.1234/jcs.2026.002", title: "Quantum Computing Error Correction Codes", abstract: "Draft paper on quantum error correction codes and their implementation in topological quantum computing.", keywords: ["quantum computing", "error correction"], discipline: "Computer Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "artificial-intelligence-review", trending: false, views: 0, downloads: 0, citations: 0 },
    // Additional generated articles (20 more)
    { doi: "10.1234/phys.2026.001", title: "Topological Insulators and Their Applications in Spintronics", abstract: "We explore the unique electronic properties of topological insulators and demonstrate their potential for next-generation spintronic devices.", keywords: ["topological insulators", "spintronics", "condensed matter"], discipline: "Physics", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "scientific-reports", trending: false, views: 2340, downloads: 410, citations: 28 },
    { doi: "10.1234/chem.2026.001", title: "Metal-Organic Frameworks for Carbon Capture at Scale", abstract: "Design and synthesis of novel MOFs demonstrating record CO2 uptake capacity under industrial flue gas conditions.", keywords: ["MOF", "carbon capture", "materials chemistry"], discipline: "Chemistry", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-communications", trending: false, views: 3700, downloads: 780, citations: 51 },
    { doi: "10.1234/health.2026.001", title: "Long COVID: Mechanisms, Biomarkers, and Therapeutic Targets", abstract: "Systematic review of post-acute sequelae of SARS-CoV-2 infection, identifying persistent inflammation pathways and candidate biomarkers.", keywords: ["long COVID", "SARS-CoV-2", "biomarkers", "inflammation"], discipline: "Health Sciences", type: "REVIEW" as const, access: "OPEN_ACCESS" as const, journal: "journal-of-epidemiology-and-global-health", trending: true, views: 12400, downloads: 3100, citations: 210 },
    { doi: "10.1234/cs.2026.001", title: "Federated Learning for Privacy-Preserving Healthcare Analytics", abstract: "A federated learning framework for healthcare data that preserves patient privacy while enabling collaborative model training across hospital networks.", keywords: ["federated learning", "privacy", "healthcare"], discipline: "Computer Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-machine-intelligence", trending: false, views: 2100, downloads: 450, citations: 19 },
    { doi: "10.1234/env.2026.001", title: "Microplastics in Arctic Sea Ice: Sources and Transport Mechanisms", abstract: "First comprehensive survey of microplastic concentrations in Arctic sea ice cores, revealing atmospheric long-range transport as the dominant source.", keywords: ["microplastics", "Arctic", "pollution", "sea ice"], discipline: "Environmental Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-geoscience", trending: false, views: 4500, downloads: 920, citations: 63 },
    { doi: "10.1234/math.2026.002", title: "Machine Learning Approaches to Partial Differential Equations", abstract: "Neural operator architectures for solving families of PDEs with applications to fluid dynamics and climate modeling.", keywords: ["PDE", "neural operators", "scientific computing"], discipline: "Mathematics", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "artificial-intelligence-review", trending: false, views: 3200, downloads: 680, citations: 44 },
    { doi: "10.1234/bio.2026.002", title: "Gut Microbiome and Neurodegenerative Diseases: The Gut-Brain Axis", abstract: "Meta-analysis of gut microbiome alterations in Alzheimer's and Parkinson's disease patients reveals consistent taxonomic shifts.", keywords: ["microbiome", "gut-brain axis", "neurodegeneration", "Alzheimer's"], discipline: "Biology", type: "REVIEW" as const, access: "SUBSCRIPTION" as const, journal: "discover-sustainability", trending: false, views: 5100, downloads: 1100, citations: 72 },
    { doi: "10.1234/phys.2026.002", title: "Gravitational Wave Detection with Next-Generation Interferometers", abstract: "Projected sensitivity curves and science case for the Einstein Telescope and Cosmic Explorer gravitational wave observatories.", keywords: ["gravitational waves", "interferometry", "LIGO"], discipline: "Physics", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-communications", trending: false, views: 6700, downloads: 1400, citations: 88 },
    { doi: "10.1234/chem.2026.002", title: "Catalytic Asymmetric Synthesis of Chiral Drug Intermediates", abstract: "Development of a general catalytic platform for enantioselective C-H functionalization enabling rapid access to pharmaceutical building blocks.", keywords: ["asymmetric catalysis", "C-H activation", "pharmaceuticals"], discipline: "Chemistry", type: "RESEARCH_ARTICLE" as const, access: "SUBSCRIPTION" as const, journal: "scientific-reports", trending: false, views: 1800, downloads: 290, citations: 15 },
    { doi: "10.1234/cs.2026.002", title: "Diffusion Models for Protein Structure Generation", abstract: "Score-based diffusion models generate novel protein backbones with designable structures, outperforming existing approaches on computational metrics.", keywords: ["protein design", "diffusion models", "generative AI"], discipline: "Computer Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-machine-intelligence", trending: true, views: 9200, downloads: 2300, citations: 134 },
    { doi: "10.1234/health.2026.002", title: "Global Burden of Antimicrobial Resistance: A Systematic Analysis", abstract: "Estimates of deaths and disability-adjusted life-years attributable to and associated with antimicrobial resistance for 23 pathogens in 204 countries.", keywords: ["AMR", "antimicrobial resistance", "global health"], discipline: "Health Sciences", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "journal-of-epidemiology-and-global-health", trending: false, views: 7800, downloads: 1600, citations: 112 },
    { doi: "10.1234/env.2026.002", title: "Rewilding Abandoned Farmland: Biodiversity Recovery Timescales", abstract: "A 30-year longitudinal study of ecosystem recovery on abandoned European farmland reveals non-linear biodiversity trajectories.", keywords: ["rewilding", "biodiversity", "ecosystem recovery", "farmland"], discipline: "Environmental Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-geoscience", trending: false, views: 3400, downloads: 710, citations: 47 },
    { doi: "10.1234/phys.2026.003", title: "Room-Temperature Superconductivity in Modified Hydrogen Sulfide", abstract: "Observation of zero resistance at 287 K in sulfur-hydrogen compounds at 267 GPa, with structural characterization via X-ray diffraction.", keywords: ["superconductivity", "high pressure", "hydrogen sulfide"], discipline: "Physics", type: "LETTER" as const, access: "SUBSCRIPTION" as const, journal: "nature-communications", trending: true, views: 15000, downloads: 4200, citations: 340 },
    { doi: "10.1234/cs.2026.003", title: "Scaling Laws for Vision Transformers in Medical Imaging", abstract: "Empirical scaling laws governing the performance of vision transformers on medical imaging tasks across 12 clinical domains.", keywords: ["vision transformers", "medical imaging", "scaling laws"], discipline: "Computer Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "artificial-intelligence-review", trending: false, views: 4300, downloads: 890, citations: 56 },
    { doi: "10.1234/bio.2026.003", title: "Single-Cell Atlas of the Human Thymus Across the Lifespan", abstract: "Single-cell RNA sequencing of 500,000 thymic cells from fetal to elderly donors maps T-cell development and age-related thymic involution.", keywords: ["single-cell", "thymus", "T cells", "aging"], discipline: "Biology", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "scientific-reports", trending: false, views: 3600, downloads: 750, citations: 41 },
    { doi: "10.1234/math.2026.003", title: "Advances in Homomorphic Encryption for Practical Computation", abstract: "A new bootstrapping algorithm reduces homomorphic encryption overhead by 100x, enabling practical privacy-preserving cloud computation.", keywords: ["homomorphic encryption", "cryptography", "privacy"], discipline: "Mathematics", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-machine-intelligence", trending: false, views: 2900, downloads: 600, citations: 33 },
    { doi: "10.1234/chem.2026.003", title: "Perovskite Solar Cells with 30% Efficiency via Interface Engineering", abstract: "A novel interface passivation strategy pushes perovskite/silicon tandem solar cells to a certified 30.1% power conversion efficiency.", keywords: ["perovskite", "solar cells", "photovoltaics", "tandem"], discipline: "Chemistry", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "nature-communications", trending: true, views: 11000, downloads: 2800, citations: 189 },
    { doi: "10.1234/health.2026.003", title: "mRNA Vaccines for Cancer Immunotherapy: Clinical Trial Results", abstract: "Phase II clinical trial results of personalized neoantigen mRNA vaccines in melanoma and non-small cell lung cancer patients.", keywords: ["mRNA vaccine", "cancer", "immunotherapy", "neoantigen"], discipline: "Health Sciences", type: "RESEARCH_ARTICLE" as const, access: "SUBSCRIPTION" as const, journal: "journal-of-epidemiology-and-global-health", trending: false, views: 8200, downloads: 1800, citations: 97 },
    { doi: "10.1234/env.2026.003", title: "Ocean Alkalinity Enhancement as a Carbon Dioxide Removal Strategy", abstract: "Pilot-scale ocean alkalinity enhancement experiments demonstrate measurable CO2 drawdown with minimal ecosystem disruption.", keywords: ["ocean alkalinity", "CDR", "carbon removal", "marine chemistry"], discipline: "Environmental Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "discover-sustainability", trending: false, views: 2600, downloads: 540, citations: 29 },
    { doi: "10.1234/cs.2026.004", title: "Autonomous Driving Safety Guarantees via Formal Verification", abstract: "A compositional verification framework provides mathematical safety guarantees for autonomous vehicle decision-making in complex urban environments.", keywords: ["autonomous driving", "formal verification", "safety"], discipline: "Computer Science", type: "RESEARCH_ARTICLE" as const, access: "OPEN_ACCESS" as const, journal: "artificial-intelligence-review", trending: false, views: 3800, downloads: 790, citations: 52 },
  ];

  const affiliations = [mit, oxford, stanford, ethz, cambridge, harvard, tokyo, sorbonne, maxPlanck, nus];
  const articleIds: string[] = [];

  for (let i = 0; i < articleDefs.length; i++) {
    const a = articleDefs[i];
    const isPublished = a.doi !== "10.1234/jcs.2026.002"; // draft article
    const j = jBySlug(a.journal);
    const affIdx = i % affiliations.length;
    const affIdx2 = (i + 3) % affiliations.length;

    const article = await prisma.article.create({
      data: {
        doi: a.doi, title: a.title, abstract: a.abstract, keywords: a.keywords,
        discipline: a.discipline, articleType: a.type, accessType: a.access,
        language: "en", isPublished, isTrending: a.trending,
        publishedAt: isPublished ? past(5 + i * 3) : null,
        viewCount: a.views, downloadCount: a.downloads, citationCount: a.citations,
        journalId: j.id, issueId: issueMap[j.slug] || null,
        authors: { create: [
          { firstName: ["Andrew", "Maria", "Wei", "Fatima", "James", "Priya", "Hans", "Li-Wei", "Sarah", "Carlos"][i % 10], lastName: ["Derocher", "Santos", "Zhang", "Al-Rashid", "Smith", "Sharma", "Mueller", "Chang", "Johnson", "Gutierrez"][i % 10], isCorresponding: true, order: 1, affiliationId: affiliations[affIdx].id, email: `author${i}@example.com` },
          { firstName: ["Elena", "Yuki", "David", "Amina", "Robert", "Mei", "Lars", "Aisha", "Thomas", "Olga"][i % 10], lastName: ["Rodriguez", "Tanaka", "Wilson", "Hassan", "Brown", "Liu", "Eriksson", "Khan", "Anderson", "Petrov"][i % 10], isCorresponding: false, order: 2, affiliationId: affiliations[affIdx2].id },
        ]},
        references: { create: [
          { text: `Reference 1 for ${a.title.substring(0, 30)}...`, doi: `10.ref/${i}.1`, order: 1 },
          { text: `Reference 2 for ${a.title.substring(0, 30)}...`, doi: `10.ref/${i}.2`, order: 2 },
          { text: `Reference 3 for ${a.title.substring(0, 30)}...`, order: 3 },
        ]},
        metrics: { create: { viewCount: a.views, downloadCount: a.downloads, citationCount: a.citations } },
        figures: isPublished ? { create: [
          { url: `https://picsum.photos/seed/fig${i}a/800/600`, caption: `Figure 1: Key results from ${a.title.substring(0, 40)}`, type: "IMAGE", order: 1 },
        ]} : undefined,
      },
    });
    articleIds.push(article.id);
  }
  console.log(`   ✅  ${articleDefs.length} articles with authors, refs, metrics, figures\n`);

  // ══════════════════════════════════════════════════════════
  // 5. COLLECTIONS  →  collections, collection_articles tables
  // ══════════════════════════════════════════════════════════
  console.log("📚  Collections → collections, collection_articles");
  const collectionData = [
    { slug: "ai-in-healthcare",            title: "Artificial Intelligence in Healthcare",  desc: "Groundbreaking research on AI and ML in medical diagnosis, treatment planning, and patient care.",                       img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80", discipline: "Health Sciences" },
    { slug: "climate-change-sustainability", title: "Climate Change & Sustainability",       desc: "Essential studies tackling global warming, renewable energy, and sustainable practices across varied ecosystems.",         img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", discipline: "Environmental Science" },
    { slug: "quantum-computing-frontiers",  title: "Quantum Computing Frontiers",            desc: "Latest advancements in quantum algorithms, hardware developments, and theoretical implications.",                       img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80", discipline: "Physics" },
    { slug: "neuroscience-behavior",        title: "Neuroscience and Behavior",              desc: "Recent discoveries in brain functionality, cognitive processes, and behavioral psychology.",                               img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80", discipline: "Biology" },
    { slug: "nanotechnology-innovations",   title: "Nanotechnology Innovations",             desc: "Research on nanomaterials, nanoscale devices, and their applications in various scientific fields.",                      img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=600&q=80", discipline: "Chemistry" },
    { slug: "genomics-precision-medicine",  title: "Genomics and Precision Medicine",        desc: "Latest studies on DNA sequencing, gene editing, and personalized medical treatments.",                                     img: "https://images.unsplash.com/photo-1532187313867-b8637c35f992?auto=format&fit=crop&w=600&q=80", discipline: "Biology" },
  ];
  for (let i = 0; i < collectionData.length; i++) {
    const c = collectionData[i];
    // Add 2-3 articles per collection
    const artSlice = articleIds.slice(i * 3, i * 3 + 3).filter(Boolean);
    await prisma.collection.create({
      data: {
        slug: c.slug, title: c.title, description: c.desc, coverImageUrl: c.img, discipline: c.discipline,
        articles: { create: artSlice.map((aid, idx) => ({ articleId: aid, order: idx + 1 })) },
      },
    });
  }
  console.log(`   ✅  ${collectionData.length} collections\n`);

  // ══════════════════════════════════════════════════════════
  // 6. BOOKS  →  books, book_authors, book_chapters, book_chapter_authors tables
  // ══════════════════════════════════════════════════════════
  console.log("📖  Books → books, book_authors, book_chapters, book_chapter_authors");
  const bookData = [
    { isbn: "978-3-16-148410-0", doi: "10.1007/978-3-031-67890-2", title: "Quantum Computing: A Modern Approach", disc: "Physics", pub: "Lumex Press", year: 2025, img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400", authors: [["Alan","Turing"],["Richard","Feynman"]], chapters: [["Introduction to Quantum Mechanics","10.1007/978-3-031-67890-2_1"],["Surface Codes and Error Correction","10.1007/978-3-031-67890-2_2"],["Quantum Algorithms for Optimization","10.1007/978-3-031-67890-2_3"]] },
    { isbn: "978-1-23-456789-7", doi: "10.1007/978-3-031-12345-1", title: "Advances in Neural Information Processing", disc: "Computer Science", pub: "Lumex Press", year: 2026, img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400", authors: [["Yann","LeCun"],["Geoffrey","Hinton"]], chapters: [["Neural Network Fundamentals","10.1007/978-3-031-12345-1_1"],["Convolutional Neural Networks","10.1007/978-3-031-12345-1_2"],["Attention Mechanisms and Transformers","10.1007/978-3-031-12345-1_3"],["Large Language Models","10.1007/978-3-031-12345-1_4"],["Deployment and Production","10.1007/978-3-031-12345-1_5"]] },
    { isbn: "978-0-12-345678-9", doi: "10.1234/ccgp.2024.3",      title: "Climate Change and Global Policy", disc: "Environmental Science", pub: "Global Earth Press", year: 2024, img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400", authors: [["Jane","Goodall"],["Greta","Thunberg"]], chapters: [["Climate Science Fundamentals","10.1234/ccgp.ch1"],["International Policy Frameworks","10.1234/ccgp.ch2"],["Mitigation Strategies","10.1234/ccgp.ch3"]] },
    { isbn: "978-0-98-765432-1", doi: "10.1234/mbc.2025.4",       title: "Molecular Biology of the Cell", disc: "Biology", pub: "Life Sciences Publishing", year: 2025, img: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400", authors: [["Rosalind","Franklin"],["James","Watson"]], chapters: [["Cell Structure and Function","10.1234/mbc.ch1"],["DNA Replication and Repair","10.1234/mbc.ch2"],["Gene Expression","10.1234/mbc.ch3"]] },
    { isbn: "978-1-11-222333-4", doi: "10.1234/pos.2023.5",       title: "The Philosophy of Science", disc: "Philosophy", pub: "Academic Press", year: 2023, img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400", authors: [["Karl","Popper"],["Thomas","Kuhn"]], chapters: [["Epistemology of Scientific Discovery","10.1234/pos.ch1"],["Paradigm Shifts","10.1234/pos.ch2"]] },
    { isbn: "978-4-55-666777-8", doi: "10.1234/ila.2024.6",       title: "Introduction to Linear Algebra", disc: "Mathematics", pub: "MathBooks Inc", year: 2024, img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400", authors: [["Gilbert","Strang"]], chapters: [["Vectors and Spaces","10.1234/ila.ch1"],["Matrix Operations","10.1234/ila.ch2"],["Eigenvalues and Eigenvectors","10.1234/ila.ch3"]] },
  ];
  for (const b of bookData) {
    await prisma.book.create({
      data: {
        isbn: b.isbn, doi: b.doi, title: b.title, description: `${b.title} — a comprehensive reference.`,
        publisher: b.pub, publishedAt: new Date(`${b.year}-01-15`), coverImageUrl: b.img,
        discipline: b.disc, isOpenAccess: false,
        authors: { create: b.authors.map(([fn, ln], i) => ({ firstName: fn, lastName: ln, order: i + 1 })) },
        chapters: { create: b.chapters.map(([t, d], i) => ({ doi: d, title: t, order: i + 1, pageStart: i * 50 + 1, pageEnd: (i + 1) * 50 })) },
      },
    });
  }
  console.log(`   ✅  ${bookData.length} books with authors & chapters\n`);

  // ══════════════════════════════════════════════════════════
  // 7. NEWS  →  news table
  // ══════════════════════════════════════════════════════════
  console.log("📰  News → news table");
  const newsData = [
    { slug: "new-open-access-initiative",      title: "Lumex Announces New Open Access Initiative",              summary: "Expanding our commitment to open science with a new initiative making all 'Frontiers' series fully open access.", category: "Company News", days: 5 },
    { slug: "2024-excellence-in-science-award", title: "Winner of the 2024 Lumex Excellence in Science Award",   summary: "Congratulations to Dr. Elena Rodriguez for groundbreaking research in sustainable enzymology.",                 category: "Awards", days: 15 },
    { slug: "author-submission-portal-update",  title: "Major Update to the Lumex Author Submission Portal",     summary: "New streamlined workflow, ORCID integration, and real-time status tracking.",                                     category: "Platform Updates", days: 25 },
    { slug: "call-for-papers-quantum-ml",       title: "Call for Papers: Special Issue on Quantum Machine Learning", summary: "The Journal of Advanced Computing is accepting submissions for a special issue on quantum ML.",                category: "Calls for Papers", days: 35 },
    { slug: "global-research-coalition",        title: "Lumex Partners with Global Research Coalition",           summary: "Improving access to scientific literature for researchers in developing nations.",                                category: "Partnerships", days: 50 },
    { slug: "lumex-impact-factor-2026",         title: "Lumex Journals Achieve Record Impact Factors in 2026",    summary: "All flagship journals have reached new heights in academic impact.",                                              category: "Announcements", days: 3 },
    { slug: "ai-ethics-guidelines",             title: "New AI Ethics Guidelines for Research Publishing",        summary: "Lumex adopts comprehensive AI ethics framework for manuscript preparation and peer review.",                       category: "Policy", days: 10 },
    { slug: "summer-internship-program",        title: "Lumex Summer Internship Program Now Open",                summary: "Applications are open for our 2026 summer internship program across editorial, tech, and research teams.",         category: "Careers", days: 20 },
    { slug: "preprint-server-launch",           title: "Lumex Launches Open Preprint Server",                     summary: "A free, open preprint server for rapid dissemination of research across all disciplines.",                        category: "Product Launch", days: 8 },
    { slug: "climate-research-award",           title: "Annual Climate Research Excellence Award Announced",      summary: "Nominations open for outstanding contributions to climate science and sustainability research.",                  category: "Awards", days: 12 },
  ];
  for (const n of newsData) {
    await prisma.news.create({
      data: {
        slug: n.slug, title: n.title, summary: n.summary,
        content: `${n.summary}\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
        category: n.category, isPublished: true, publishedAt: past(n.days),
      },
    });
  }
  console.log(`   ✅  ${newsData.length} news items\n`);

  // ══════════════════════════════════════════════════════════
  // 8. CAREERS  →  careers table
  // ══════════════════════════════════════════════════════════
  console.log("💼  Careers → careers table");
  const careerData = [
    { title: "Senior Backend Engineer",    dept: "Engineering", loc: "Remote",         type: "FULL_TIME",  desc: "Join our platform team building scalable APIs and data pipelines.", reqs: "5+ years Node.js, TypeScript, PostgreSQL.", days: 30 },
    { title: "Editorial Coordinator",       dept: "Editorial",   loc: "London, UK",     type: "FULL_TIME",  desc: "Coordinate manuscript review processes and liaise with editors and authors.", reqs: "2+ years publishing experience.", days: 14 },
    { title: "Data Science Intern",         dept: "Research",    loc: "Remote",         type: "INTERNSHIP", desc: "Summer internship working on citation analysis and recommendation systems.", reqs: "Enrolled in CS or Data Science program.", days: 7 },
    { title: "Frontend Developer",          dept: "Engineering", loc: "New York, USA",  type: "FULL_TIME",  desc: "Build responsive UIs for our research platform using React and TypeScript.", reqs: "3+ years React, TypeScript, Tailwind CSS.", days: 21 },
    { title: "Research Analyst",            dept: "Research",    loc: "Remote",         type: "PART_TIME",  desc: "Analyze publishing trends and generate insights for editorial strategy.", reqs: "Background in bibliometrics or information science.", days: 45 },
  ];
  for (const c of careerData) {
    await prisma.career.create({
      data: { title: c.title, department: c.dept, location: c.loc, type: c.type, description: c.desc, requirements: c.reqs, isActive: true, closingDate: future(c.days) },
    });
  }
  console.log(`   ✅  ${careerData.length} careers\n`);

  // ══════════════════════════════════════════════════════════
  // 9. CONFERENCES  →  conferences table
  // ══════════════════════════════════════════════════════════
  console.log("🎤  Conferences → conferences table");
  const confData = [
    { slug: "icml-2024",              title: "International Conference on Machine Learning (ICML) 2024", desc: "Premier academic conference in machine learning, presenting cutting-edge research.",              loc: "Vienna, Austria",        disc: "Computer Science", status: "PAST" as const,     startDays: -340, endDays: -333, virtual: false },
    { slug: "neurips-2023",           title: "Neural Information Processing Systems (NeurIPS) 2023",     desc: "A double-track meeting with invited talks and refereed papers in ML and neuroscience.",          loc: "New Orleans, USA",       disc: "Computer Science", status: "PAST" as const,     startDays: -540, endDays: -534, virtual: false },
    { slug: "lumex-ai-summit-2026",   title: "Lumex AI Summit 2026",                                     desc: "Annual summit on artificial intelligence and machine learning research.",                        loc: "San Francisco, CA",      disc: "Computer Science", status: "UPCOMING" as const, startDays: 60,   endDays: 63,   virtual: false },
    { slug: "biotech-world-2026",     title: "Biotech World Congress 2026",                               desc: "International congress on biotechnology innovations, gene therapy, and synthetic biology.",      loc: "London, UK",             disc: "Biology",          status: "UPCOMING" as const, startDays: 90,   endDays: 94,   virtual: true },
    { slug: "math-frontiers-2025",    title: "Mathematics Frontiers Conference 2025",                     desc: "Exploring new frontiers in pure and applied mathematics with emphasis on computational methods.", loc: "Tokyo, Japan",           disc: "Mathematics",      status: "PAST" as const,     startDays: -60,  endDays: -57,  virtual: false },
    { slug: "climate-action-2026",    title: "Climate Action Research Summit 2026",                       desc: "Interdisciplinary summit on climate science, policy, and technological solutions.",              loc: "Geneva, Switzerland",    disc: "Environmental Science", status: "UPCOMING" as const, startDays: 120, endDays: 123, virtual: true },
    { slug: "global-health-forum-2026", title: "Global Health Innovation Forum 2026",                     desc: "Forum on healthcare innovation, digital health, and global health equity.",                      loc: "Singapore",              disc: "Health Sciences",  status: "UPCOMING" as const, startDays: 150,  endDays: 153,  virtual: false },
  ];
  for (const c of confData) {
    await prisma.conference.create({
      data: {
        slug: c.slug, title: c.title, description: c.desc, location: c.loc,
        discipline: c.disc, status: c.status, isVirtual: c.virtual,
        startDate: c.startDays > 0 ? future(c.startDays) : past(-c.startDays),
        endDate: c.endDays > 0 ? future(c.endDays) : past(-c.endDays),
        submissionDeadline: c.status === "UPCOMING" ? future(c.startDays - 30) : undefined,
        website: `https://${c.slug}.lumex.io`,
      },
    });
  }
  console.log(`   ✅  ${confData.length} conferences\n`);

  // ══════════════════════════════════════════════════════════
  // 10. SITE CONFIG  →  site_configs table
  // ══════════════════════════════════════════════════════════
  console.log("⚙️   SiteConfig → site_configs table");
  const configs = [
    ["site_name", "Lumex Research Portal"],
    ["site_tagline", "Advancing Research, Connecting Minds"],
    ["total_articles", String(articleDefs.length)],
    ["social_twitter", "https://twitter.com/lumexpublishing"],
    ["social_linkedin", "https://linkedin.com/company/lumex"],
    ["contact_email", "support@lumex.io"],
    ["maintenance_mode", "false"],
  ];
  for (const [k, v] of configs) {
    await prisma.siteConfig.create({ data: { key: k, value: v } });
  }
  console.log(`   ✅  ${configs.length} config entries\n`);

  // ══════════════════════════════════════════════════════════
  // 11. HOMEPAGE CONTENT  →  homepage_contents table
  // ══════════════════════════════════════════════════════════
  console.log("🏠  HomepageContent → homepage_contents table");
  await prisma.homepageContent.create({
    data: { section: "hero", content: { headline: "Advancing Research, Connecting Minds", subheadline: "Discover cutting-edge research across every discipline.", ctaLabel: "Browse Articles", ctaUrl: "/articles" } },
  });
  await prisma.homepageContent.create({
    data: { section: "mission", content: { title: "Our Mission", body: "Lumex Publishing is committed to open science and equitable access to research." } },
  });
  console.log("   ✅  2 homepage sections\n");

  // ══════════════════════════════════════════════════════════
  // 12. SUBMISSIONS  →  submissions, submission_authors tables
  // ══════════════════════════════════════════════════════════
  console.log("📤  Submissions → submissions, submission_authors");
  const sub = await prisma.submission.create({
    data: {
      title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
      abstract: "We propose a federated learning framework for healthcare data that preserves patient privacy.",
      keywords: ["federated learning", "privacy", "healthcare"],
      status: "SUBMITTED", journalSlug: "artificial-intelligence-review",
      coverLetter: "We believe this work is a strong fit...",
      submittedAt: past(2), submittedBy: auth1.id,
      coAuthors: { create: [{ firstName: "Diana", lastName: "Author", email: auth2.email, affiliation: "Oxford", order: 1 }] },
    },
  });
  await prisma.submission.create({
    data: { title: "Quantum Key Distribution in 5G Networks", status: "DRAFT", keywords: ["quantum cryptography", "5G"], submittedBy: auth2.id },
  });
  console.log("   ✅  2 submissions\n");

  // ══════════════════════════════════════════════════════════
  // 13. ALERTS  →  alerts table
  // ══════════════════════════════════════════════════════════
  console.log("🔔  Alerts → alerts table");
  await Promise.all([
    prisma.alert.create({ data: { type: "NEW_ARTICLE", query: "machine learning", userId: reader.id } }),
    prisma.alert.create({ data: { type: "JOURNAL_UPDATE", journalId: journals[0].id, userId: reader.id } }),
    prisma.alert.create({ data: { type: "NEW_ARTICLE", discipline: "Biology", userId: auth1.id } }),
  ]);
  console.log("   ✅  3 alerts\n");

  // ══════════════════════════════════════════════════════════
  // 14. ORDERS  →  orders table
  // ══════════════════════════════════════════════════════════
  console.log("🛒  Orders → orders table");
  await Promise.all([
    prisma.order.create({ data: { userId: reader.id, amount: 29.99, currency: "USD", status: "COMPLETED", itemType: "ARTICLE", itemRef: articleDefs[1].doi, receiptUrl: "https://receipts.lumex.io/ord_001" } }),
    prisma.order.create({ data: { userId: auth1.id, amount: 1500, currency: "USD", status: "PENDING", itemType: "APC", itemRef: sub.id } }),
  ]);
  console.log("   ✅  2 orders\n");

  // ══════════════════════════════════════════════════════════
  // 15. CONTACT MESSAGES  →  contact_messages table
  // ══════════════════════════════════════════════════════════
  console.log("📨  ContactMessages → contact_messages table");
  await prisma.contactMessage.create({
    data: { firstName: "John", lastName: "Smith", email: "john.smith@example.com", subject: "Submission guidelines question", message: "Hi, I would like to know more about manuscript formatting requirements." },
  });
  console.log("   ✅  1 contact message\n");

  // ══════════════════════════════════════════════════════════
  // 16. LEGACY PAPERS  →  papers, reviewer_assignments, reviews, comments tables
  // ══════════════════════════════════════════════════════════
  console.log("📝  Legacy papers → papers, reviewer_assignments, reviews, comments");
  const paper = await prisma.paper.create({
    data: { title: "Blockchain for Academic Credential Verification", abstract: "A blockchain-based system for verifying academic credentials.", domain: "Computer Science", keywords: ["blockchain", "credentials"], status: "SUBMITTED", submittedBy: auth1.id },
  });
  const assignment = await prisma.reviewerAssignment.create({
    data: { paperId: paper.id, reviewerId: rev1.id, status: "COMPLETED" },
  });
  await prisma.review.create({
    data: { paperId: paper.id, reviewerId: rev1.id, assignmentId: assignment.id, strengths: "Well-structured argument, clear methodology.", weaknesses: "Limited scalability discussion.", score: 8, recommendation: "MINOR_REVISION" },
  });
  await prisma.comment.create({
    data: { paperId: paper.id, authorId: reader.id, body: "Fascinating approach. Looking forward to the revised version." },
  });
  console.log("   ✅  1 paper, 1 assignment, 1 review, 1 comment\n");

  // ── SUMMARY ───────────────────────────────────────────────
  const counts = await Promise.all([
    prisma.user.count(), prisma.journal.count(), prisma.article.count(),
    prisma.collection.count(), prisma.book.count(), prisma.bookChapter.count(),
    prisma.news.count(), prisma.career.count(), prisma.conference.count(),
    prisma.submission.count(), prisma.affiliation.count(),
  ]);
  console.log("━".repeat(50));
  console.log("🎉  Seed complete!\n");
  console.log(`   Users          : ${counts[0]}`);
  console.log(`   Journals       : ${counts[1]}`);
  console.log(`   Articles       : ${counts[2]}`);
  console.log(`   Collections    : ${counts[3]}`);
  console.log(`   Books          : ${counts[4]}`);
  console.log(`   Book Chapters  : ${counts[5]}`);
  console.log(`   News           : ${counts[6]}`);
  console.log(`   Careers        : ${counts[7]}`);
  console.log(`   Conferences    : ${counts[8]}`);
  console.log(`   Submissions    : ${counts[9]}`);
  console.log(`   Affiliations   : ${counts[10]}`);
  console.log("━".repeat(50));
}

main()
  .catch((e) => { console.error("❌  Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
