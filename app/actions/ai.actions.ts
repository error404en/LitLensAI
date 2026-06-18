"use server";

import { AIOperationsService } from "../../services/ai-operations.service";
import { auth } from "@clerk/nextjs/server";

const aiOps = new AIOperationsService();

export async function comparePapersAction(projectId: string, query: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const response = await aiOps.compare(userId, projectId, query);
  return response;
}

export async function reviewPapersAction(projectId: string, query: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const response = await aiOps.review(userId, projectId, query);
  return response;
}

export async function createProjectAction(title: string, description?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { adminClient } = await import("@/lib/supabase/admin");

  // Ensure user exists
  await adminClient.from("users").upsert({ clerk_id: userId, email: "user@example.com" }, { onConflict: "clerk_id" });

  const { data: userRow } = await adminClient.from("users").select("id").eq("clerk_id", userId).single();
  
  if (!userRow) throw new Error("User not synced");

  const { data, error } = await adminClient.from("projects").insert({
    user_id: userRow.id,
    title,
    description
  }).select("id, user_id, title, description, created_at").single();

  if (error) throw new Error(error.message);
  
  return data;
}
