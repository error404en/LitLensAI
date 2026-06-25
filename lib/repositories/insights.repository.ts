import { createClient } from "../supabase/client";
import { DatabaseError } from "../errors";
import { InsightType, ProjectInsight } from "../../services/insights.service";

export const InsightsRepository = {
  async getInsights(projectId: string): Promise<ProjectInsight[]> {
    const supabase = createClient();
    // We use the `notes` table to cache insights, identified by the title prefix.
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("project_id", projectId)
      .like("title", "Insight:%")
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);

    return data.map((note) => {
      const typeStr = note.title.replace("Insight:", "");
      return {
        id: note.id,
        type: typeStr as InsightType,
        title: typeStr.replace("_", " ").toUpperCase(),
        content: note.content || "",
        isPinned: false, // Not supported in notes table schema
        isSaved: true,
        updatedAt: note.updated_at || note.created_at,
      };
    });
  },

  async saveInsight(projectId: string, type: InsightType, content: string): Promise<ProjectInsight> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    if (!userUUID) {
      throw new DatabaseError("User not authenticated", undefined);
    }

    const title = `Insight:${type}`;

    // Check if it already exists to overwrite cache
    const { data: existing } = await supabase
      .from("notes")
      .select("id")
      .eq("project_id", projectId)
      .eq("title", title)
      .maybeSingle();

    let savedData;

    if (existing) {
      const { data, error } = await supabase
        .from("notes")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select("*")
        .single();
      if (error) throw new DatabaseError(error.message, error);
      savedData = data;
    } else {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          project_id: projectId,
          user_id: userUUID,
          title,
          content,
        })
        .select("*")
        .single();
      if (error) throw new DatabaseError(error.message, error);
      savedData = data;
    }

    return {
      id: savedData.id,
      type: type,
      title: type.replace("_", " ").toUpperCase(),
      content: savedData.content || "",
      isPinned: false,
      isSaved: true,
      updatedAt: savedData.updated_at || savedData.created_at,
    };
  }
};
