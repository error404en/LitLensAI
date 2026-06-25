import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk Publishable Key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk Secret Key is required"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Supabase URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase Anon Key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase Service Role Key is required"),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  QDRANT_URL: z.string().url("Qdrant URL must be a valid URL").optional(),
  QDRANT_API_KEY: z.string().optional(),
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:", error.flatten().fieldErrors);
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
};

export const env = envSchema.parse(process.env);
