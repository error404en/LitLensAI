import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminClient } from "../../../lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { userId, orgId, orgRole } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { projectId, format } = body; // format: 'pdf', 'docx', 'json'

    if (!projectId || !format) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify access
    const { data: project } = await adminClient
      .from("projects")
      .select("id, org_id")
      .eq("id", projectId)
      .single();

    if (!project) return new NextResponse("Project not found", { status: 404 });
    if (project.org_id && project.org_id !== orgId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Fetch data to export
    const { data: papers } = await adminClient
      .from("papers")
      .select("title, authors, abstract, summary")
      .eq("project_id", projectId);

    const exportData = {
      projectId,
      exportedAt: new Date().toISOString(),
      papers: papers || [],
    };

    if (format === "json") {
      return NextResponse.json(exportData, {
        headers: {
          "Content-Disposition": `attachment; filename="export_${projectId}.json"`,
        },
      });
    }

    // Placeholder for actual PDF/DOCX generation
    // In a real implementation, you would use pdfkit or docx to generate the file buffer
    if (format === "pdf" || format === "docx") {
      const buffer = Buffer.from(`Export for Project ${projectId}\n\n${JSON.stringify(exportData, null, 2)}`);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="export_${projectId}.${format}"`,
        },
      });
    }

    return new NextResponse("Unsupported format", { status: 400 });
  } catch (error) {
    console.error("[EXPORT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
