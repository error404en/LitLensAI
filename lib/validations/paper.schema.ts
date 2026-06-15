import { z } from "zod"

export const PaperStatusSchema = z.enum(["queued", "processing", "embedding", "summarizing", "completed", "failed"])

export const AuthorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Author name is required"),
  affiliation: z.string().optional(),
})

export const PaperSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  userId: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  authors: z.array(AuthorSchema),
  abstract: z.string().min(10, "Abstract must be at least 10 characters"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  journal: z.string().optional(),
  tags: z.array(z.string()),
  status: PaperStatusSchema,
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileSize: z.number().positive().optional(),
  mimeType: z.string().optional(),
  isFavorite: z.boolean().optional(),
  embeddingCreated: z.boolean().optional(),
  uploadedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreatePaperSchema = PaperSchema.omit({ 
  id: true, 
  uploadedAt: true,
  createdAt: true, 
  updatedAt: true 
})
