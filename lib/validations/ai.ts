import { z } from "zod";

export const AIContextSchema = z.object({
  paperId: z.string().min(1),
  projectId: z.string().optional(),
  selectedText: z.string().optional(),
  selectedPage: z.number().int().positive().optional(),
  highlightId: z.string().optional(),
  annotationId: z.string().optional(),
});

export const SendMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1, "Message cannot be empty").max(10000),
  context: AIContextSchema.optional(),
});

export const CreateConversationSchema = z.object({
  paperId: z.string().min(1),
  projectId: z.string().optional(),
  title: z.string().min(1).max(255).optional(),
});

export const UpdateConversationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
});
