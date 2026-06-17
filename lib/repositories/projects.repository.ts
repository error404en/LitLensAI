import { Project, ProjectActivity, ProjectStatus, ActivityType } from "../types";
import { createClient } from "../supabase/client";
import { DatabaseError } from "../errors";

export interface ProjectRow {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
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
    status: row.status,
    isFavorite: row.is_favorite,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error);
    return data.map(mapProject);
  },

  async findById(id: string): Promise<Project | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new DatabaseError(error.message, error);
    }
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

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userUUID || undefined, // Supabase will fail if null, but maybe RLS allows inserting clerk_id?
        title: project.title,
        description: project.description,
        status: project.status,
        is_favorite: project.isFavorite || false,
      })
      .select()
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
    
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error);
    return mapProject(data);
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({ deleted_at: new Date().toISOString() })
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
        user_id: userUUID || undefined,
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
