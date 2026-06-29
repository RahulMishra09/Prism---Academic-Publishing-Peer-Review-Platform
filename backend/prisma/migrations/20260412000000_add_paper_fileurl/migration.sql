-- Add missing fileUrl column to papers table
ALTER TABLE "papers" ADD COLUMN IF NOT EXISTS "fileUrl" TEXT;
