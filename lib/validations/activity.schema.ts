import { z } from "zod"

export const ActivityTypeSchema = z.enum([
  "project_created", 
  "paper_added", 
  "paper_removed", 
  "summary_generated", 
  "review_generated", 
  "chat_started"
])

export const ProjectActivitySchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  type: ActivityTypeSchema,
  description: z.string().min(1),
  createdAt: z.string().datetime(),
})

export const CreateActivitySchema = ProjectActivitySchema.omit({ 
  id: true, 
  createdAt: true 
})
