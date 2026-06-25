"use server";

import { AIOperationsService } from "../../services/ai-operations.service";
import { auth } from "@clerk/nextjs/server";

const aiOps = new AIOperationsService();

export async function comparePapersAction(projectId: string, query: string) {
  try {
    const { userId, orgRole } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (orgRole && orgRole !== "org:admin" && orgRole !== "org:editor") {
      throw new Error("Insufficient organization permissions to run comparisons");
    }

    const response = await aiOps.compare(userId, projectId, query);
    return response;
  } catch (error) {
    console.error("comparePapersAction error:", error);
    return { error: error instanceof Error ? error.message : "Failed to compare papers" };
  }
}

export async function reviewPapersAction(projectId: string, query: string) {
  try {
    const { userId, orgRole } = await auth();
    if (!userId) throw new Error("Unauthorized");
    if (orgRole && orgRole !== "org:admin" && orgRole !== "org:editor") {
      throw new Error("Insufficient organization permissions to run reviews");
    }

    const response = await aiOps.review(userId, projectId, query);
    return response;
  } catch (error) {
    console.error("reviewPapersAction error:", error);
    return { error: error instanceof Error ? error.message : "Failed to review papers" };
  }
}

export async function createProjectAction(title: string, description?: string) {
  const { userId, orgId, orgRole } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (orgId && orgRole !== "org:admin" && orgRole !== "org:editor") {
    throw new Error("Only organization admins or editors can create projects.");
  }

  const { adminClient } = await import("@/lib/supabase/admin");

  // Ensure user exists
  await adminClient.from("users").upsert({ clerk_id: userId, email: "user@example.com" }, { onConflict: "clerk_id" });

  const { data: userRow } = await adminClient.from("users").select("id").eq("clerk_id", userId).single();

  if (!userRow) throw new Error("User not synced");

  const { data, error } = await adminClient.from("projects").insert({
    user_id: userRow.id,
    org_id: orgId || null,
    title,
    description
  }).select("id, user_id, org_id, title, description, created_at").single();

  if (error) throw new Error(error.message);

  return data;
}

export async function analyzeGapsAction(projectId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const response = await aiOps.executeTask("Analytics", {
      userId,
      projectId,
      query: "Identify research gaps, novel contributions, and key insights across all papers in this project."
    });
    return response;
  } catch (error) {
    console.error("analyzeGapsAction error:", error);
    return { error: error instanceof Error ? error.message : "Failed to analyze research gaps" };
  }
}
