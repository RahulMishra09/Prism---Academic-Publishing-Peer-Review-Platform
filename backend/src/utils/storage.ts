import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/error.middleware.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

/**
 * Upload a file buffer to Supabase Storage.
 *
 * @param buffer      - Raw file buffer
 * @param storagePath - Full storage path (e.g. "papers/{id}/file.pdf")
 * @param contentType - MIME type of the file
 * @returns           Public URL of the uploaded file
 */
export const uploadFile = async (
  buffer: Buffer,
  storagePath: string,
  contentType: string
): Promise<string> => {
  const { error } = await supabase.storage
    .from(env.SUPABASE_BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: false });

  if (error) {
    throw new AppError(`Failed to upload file: ${error.message}`, 500);
  }

  const { data: urlData } = supabase.storage
    .from(env.SUPABASE_BUCKET)
    .getPublicUrl(storagePath);

  return urlData.publicUrl;
};

/**
 * Upload a paper file (legacy helper used by the papers module).
 * Wraps uploadFile with the papers/{paperId}/... path convention.
 */
export const uploadPaperFile = async (
  file: Buffer,
  filename: string,
  paperId: string,
  contentType = "application/pdf"
): Promise<string> => {
  const storagePath = `papers/${paperId}/${Date.now()}-${filename}`;
  return uploadFile(file, storagePath, contentType);
};

/**
 * Delete a file from Supabase Storage by its public URL.
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  const urlParts = fileUrl.split(`${env.SUPABASE_BUCKET}/`);
  if (urlParts.length < 2 || !urlParts[1]) {
    throw new AppError("Invalid file URL", 400);
  }

  const { error } = await supabase.storage
    .from(env.SUPABASE_BUCKET)
    .remove([urlParts[1]!]);

  if (error) {
    throw new AppError(`Failed to delete file: ${error.message}`, 500);
  }
};

/**
 * Get a signed URL for temporary private file access.
 */
export const getSignedUrl = async (
  filePath: string,
  expiresIn = 3600
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(env.SUPABASE_BUCKET)
    .createSignedUrl(filePath, expiresIn);

  if (error || !data) {
    throw new AppError(`Failed to generate signed URL: ${error?.message}`, 500);
  }

  return data.signedUrl;
};
