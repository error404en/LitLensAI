import { adminClient } from "../../supabase/admin";

export class RateLimiter {
  /**
   * Basic local rate limiter and billing quota enforcer for demonstration.
   */
  static async checkRateLimit(userId: string, orgId?: string): Promise<boolean> {
    if (!orgId) return true; // Personal workspaces might have a different limit logic

    const { data: usage } = await adminClient
      .from("org_usage")
      .select("monthly_generations, plan_type")
      .eq("org_id", orgId)
      .single();

    if (usage) {
      const limits: Record<string, number> = { free: 50, pro: 1000, team: 5000, enterprise: 999999 };
      const limit = limits[usage.plan_type] || 50;
      if (usage.monthly_generations >= limit) {
        throw new Error(`QuotaExhausted: Your organization has reached its monthly generation limit for the ${usage.plan_type} plan.`);
      }
    }
    return true;
  }
}
