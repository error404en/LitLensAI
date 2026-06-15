import { z } from "zod";

export const HighlightColorSchema = z.enum(["yellow", "green", "blue", "pink"]);

export const CreateHighlightSchema = z.object({
  paperId: z.string().min(1),
  page: z.number().int().positive(),
  text: z.string().min(1, "Selected text is required"),
  color: HighlightColorSchema,
  position: z.object({
    startOffset: z.number().int().min(0),
    endOffset: z.number().int().min(0),
  }),
});

export const CreateAnnotationSchema = z.object({
  paperId: z.string().min(1),
  page: z.number().int().positive(),
  content: z.string().min(1, "Note content is required").max(5000),
  highlightId: z.string().optional(),
});

export const UpdateAnnotationSchema = z.object({
  content: z.string().min(1, "Note content is required").max(5000),
});

export const CreateBookmarkSchema = z.object({
  paperId: z.string().min(1),
  page: z.number().int().positive(),
  label: z.string().max(100).optional(),
});
