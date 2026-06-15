import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_MIME_TYPES = ["application/pdf"] as const;
const ACCEPTED_EXTENSIONS = [".pdf"] as const;

export const UploadFileSchema = z.object({
  name: z
    .string()
    .min(1, "Filename is required")
    .refine(
      (name) => ACCEPTED_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext)),
      { message: "Only PDF files are accepted" }
    ),
  size: z
    .number()
    .positive("File cannot be empty")
    .max(MAX_FILE_SIZE, `File size must be under ${MAX_FILE_SIZE / 1024 / 1024}MB`),
  type: z.enum(ACCEPTED_MIME_TYPES, "Only PDF files are accepted"),
});

export function validateUploadFile(file: File): { success: boolean; error?: string } {
  const result = UploadFileSchema.safeParse({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  if (!result.success) {
    const issues = result.error.issues;
    return { success: false, error: issues[0]?.message || "Invalid file" };
  }

  return { success: true };
}

export { MAX_FILE_SIZE, ACCEPTED_MIME_TYPES, ACCEPTED_EXTENSIONS };
