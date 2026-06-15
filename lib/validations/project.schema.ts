import { z } from "zod"

export const ProjectStatusSchema = z.enum(["active", "archived", "deleted"])

export const ProjectSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500).optional(),
  status: ProjectStatusSchema,
  isFavorite: z.boolean().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  isFavorite: z.boolean().optional(),
})

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  status: ProjectStatusSchema.optional()
})
