import { Project, ProjectActivity, ProjectStatus, ActivityType } from "../types";
import { createClient } from "../supabase/client";
import { DatabaseError } from "../errors";

export interface ProjectRow {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface ActivityRow {
  id: string;
  project_id: string;
  type: ActivityType;
  description: string;
  created_at: string;
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    status: "active" as ProjectStatus,
    isFavorite: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  };
}

function mapActivity(row: ActivityRow): ProjectActivity {
  return {
    id: row.id,
    projectId: row.project_id,
    type: row.type,
    description: row.description,
    createdAt: row.created_at,
  };
}

export const ProjectsRepository = {
  async findAll(): Promise<Project[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, user_id, title, description, created_at")
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);
    return data.map(mapProject);
  },

  async findById(id: string): Promise<Project | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, user_id, title, description, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new DatabaseError(error.message, error);
    }
    if (!data) return null;
    return mapProject(data);
  },

  async create(project: Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">): Promise<Project> {
    const supabase = createClient();
    
    // We get user_id from Clerk session -> Supabase RPC
    // Wait, we need the UUID of the user.
    // If the RLS policies use clerk_id via jwt claim, we might need an RPC to create project.
    // Actually, `user_id` is NOT NULL in projects.
    // Let's assume the user_id matches the clerk user_id for simplicity, or we have a trigger to create the user record.
    // Let's fetch the current user UUID.
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    if (!userUUID) {
      throw new DatabaseError("User not authenticated or user mapping missing", undefined);
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userUUID,
        title: project.title,
        description: project.description,
      })
      .select("id, user_id, title, description, created_at")
      .single();

    if (error) throw new DatabaseError(error.message, error);
    
    const newProject = mapProject(data);

    // Add activity
    await this.addActivity({
      projectId: newProject.id,
      type: "project_created",
      description: `Project "${newProject.title}" was created.`
    });

    return newProject;
  },

  async update(id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">>): Promise<Project> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');
    
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userUUID)
      .select("id, user_id, title, description, created_at")
      .maybeSingle();

    if (error) throw new DatabaseError(error.message, error);
    if (!data) throw new DatabaseError(`Project with ID ${id} not found`, undefined);
    return mapProject(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError(error.message, error);
  },

  async archive(id: string): Promise<Project> {
    return this.update(id, { status: "archived" });
  },

  async favorite(id: string, isFavorite: boolean): Promise<Project> {
    return this.update(id, { isFavorite });
  },

  async addActivity(activity: Omit<ProjectActivity, "id" | "createdAt">): Promise<ProjectActivity> {
    const supabase = createClient();
    const { data: userUUID } = await supabase.rpc('get_current_user_id');

    const { data, error } = await supabase
      .from("activities")
      .insert({
        project_id: activity.projectId,
        user_id: (userUUID && userUUID !== "null" && userUUID !== "undefined") ? userUUID : undefined,
        type: activity.type,
        description: activity.description,
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return mapActivity(data);
  },

  async getActivities(projectId: string): Promise<ProjectActivity[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);
    return data.map(mapActivity);
  }
};
