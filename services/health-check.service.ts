import { providerRegistry } from "../lib/ai/providers/registry";
import { createClient } from "../lib/supabase/client";
import { QdrantRepository } from "../lib/ai/vector/qdrant.client";

export interface HealthStatus {
  status: "healthy" | "degraded" | "down";
  components: {
    database: "up" | "down";
    vectorDb: "up" | "down";
    providers: Record<string, "up" | "down">;
  };
}

export class HealthCheckService {
  async checkHealth(): Promise<HealthStatus> {
    const status: HealthStatus = {
      status: "healthy",
      components: {
        database: "down",
        vectorDb: "down",
        providers: {}
      }
    };

    // 1. Check Database
    try {
      const supabase = createClient();
      const { error } = await supabase.from("projects").select("id").limit(1);
      if (!error) status.components.database = "up";
    } catch (e) {
      status.components.database = "down";
      status.status = "degraded";
    }

    // 2. Check Vector DB
    try {
      const qdrant = new QdrantRepository();
      // Assume healthy if init collection runs without throwing
      await qdrant.initCollection();
      status.components.vectorDb = "up";
    } catch (e) {
      status.components.vectorDb = "down";
      status.status = "degraded";
    }

    // 3. Check Providers
    try {
      const gemini = providerRegistry.getProvider("gemini");
      const isUp = await gemini.health();
      status.components.providers["gemini"] = isUp ? "up" : "down";
      if (!isUp) status.status = "degraded";
    } catch (e) {
      status.components.providers["gemini"] = "down";
      status.status = "degraded";
    }

    if (status.components.database === "down" && status.components.vectorDb === "down") {
      status.status = "down";
    }

    return status;
  }
}
