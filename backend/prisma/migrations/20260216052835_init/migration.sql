-- CreateEnum
CREATE TYPE "Role" AS ENUM ('READER', 'AUTHOR', 'REVIEWER', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "PaperStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'READER',
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "keywords" TEXT[],
    "status" "PaperStatus" NOT NULL DEFAULT 'DRAFT',
    "rejectionReason" TEXT,
    "aiSummary" TEXT,
    "embedding" DOUBLE PRECISION[],
    "reviewAISuggestion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "submittedBy" TEXT NOT NULL,

    CONSTRAINT "papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviewer_assignments" (
    "id" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paperId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,

    CONSTRAINT "reviewer_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "recommendation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paperId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "papers_status_idx" ON "papers"("status");

-- CreateIndex
CREATE INDEX "papers_domain_idx" ON "papers"("domain");

-- CreateIndex
CREATE INDEX "papers_createdAt_idx" ON "papers"("createdAt");

-- CreateIndex
CREATE INDEX "papers_submittedBy_idx" ON "papers"("submittedBy");

-- CreateIndex
CREATE INDEX "reviewer_assignments_paperId_idx" ON "reviewer_assignments"("paperId");

-- CreateIndex
CREATE INDEX "reviewer_assignments_reviewerId_idx" ON "reviewer_assignments"("reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "reviewer_assignments_paperId_reviewerId_key" ON "reviewer_assignments"("paperId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_assignmentId_key" ON "reviews"("assignmentId");

-- CreateIndex
CREATE INDEX "reviews_paperId_idx" ON "reviews"("paperId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_paperId_reviewerId_key" ON "reviews"("paperId", "reviewerId");

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "papers_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewer_assignments" ADD CONSTRAINT "reviewer_assignments_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "papers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewer_assignments" ADD CONSTRAINT "reviewer_assignments_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "papers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "reviewer_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
