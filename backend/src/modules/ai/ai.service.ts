import Groq from "groq-sdk";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
import { env } from "../../config/env.js";
import { AppError } from "../../middleware/error.middleware.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

const SUMMARY_PROMPT = `You are an academic research paper summarizer. Analyze the paper text below and return a structured summary in the following JSON format:

{
  "title": "Paper title",
  "summary": "2-3 sentence overview of what the paper is about",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "methodology": "Brief description of the research methodology used",
  "conclusion": "Main conclusion of the paper",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Rules:
- Keep the summary concise and clear
- Extract 3-5 key findings
- Identify the methodology accurately
- Conclusion should be 1-2 sentences
- Suggest 5 relevant keywords
- Return ONLY valid JSON, no markdown or extra text`;

export interface PaperSummary {
  title: string;
  summary: string;
  keyFindings: string[];
  methodology: string;
  conclusion: string;
  keywords: string[];
}

// ── extractTextFromBuffer ───────────────────────────────────
const extractTextFromBuffer = async (fileBuffer: Buffer, mimeType: string): Promise<string> => {
  if (mimeType === "application/pdf") {
    const data = await pdfParse(fileBuffer);
    // Limit to ~12000 chars for Groq context window
    return data.text.slice(0, 12000);
  }

  // DOCX — extract text from XML
  const raw = fileBuffer.toString("utf-8");
  const cleaned = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/[^\x20-\x7E\n\r\t]/g, " ")
    .replace(/\s{3,}/g, "\n")
    .trim();

  return cleaned.slice(0, 12000);
};

// ── summarizePaper ──────────────────────────────────────────
export const summarizePaper = async (
  fileBuffer: Buffer,
  mimeType: string
): Promise<PaperSummary> => {
  if (!env.GROQ_API_KEY) {
    throw new AppError("Groq API key is not configured", 500);
  }

  const text = await extractTextFromBuffer(fileBuffer, mimeType);

  if (text.trim().length < 50) {
    throw new AppError(
      "Could not extract enough text from the file. Please upload a text-based PDF (not scanned images).",
      422
    );
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SUMMARY_PROMPT },
      { role: "user", content: `Here is the paper text:\n\n${text}` },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  });

  const response = completion.choices[0]?.message?.content ?? "";

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new AppError("Failed to parse AI response", 500);
  }

  const parsed = JSON.parse(jsonMatch[0]) as PaperSummary;
  return parsed;
};

// ── askPaperQuestion ────────────────────────────────────────
export const askPaperQuestion = async (
  fileBuffer: Buffer,
  mimeType: string,
  question: string
): Promise<string> => {
  if (!env.GROQ_API_KEY) {
    throw new AppError("Groq API key is not configured", 500);
  }

  const text = await extractTextFromBuffer(fileBuffer, mimeType);

  if (text.trim().length < 50) {
    throw new AppError(
      "Could not extract enough text from the file. Please upload a text-based PDF (not scanned images).",
      422
    );
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a research paper assistant. Answer the following question about the paper concisely and accurately. If the answer is not in the paper, say so.",
      },
      {
        role: "user",
        content: `Paper text:\n\n${text}\n\n---\nQuestion: ${question}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content ?? "No answer generated.";
};
