import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { adminClient } from "../../lib/supabase/admin";

export default async function AdminPage() {
  const { userId, orgRole } = await auth();

  // Protect Admin Route: Ensure they are an org admin (or implement superadmin logic here)
  if (!userId || orgRole !== "org:admin") {
    redirect("/dashboard");
  }

  // Fetch some metrics
  const { count: usersCount } = await adminClient.from("users").select("*", { count: "exact", head: true });
  const { count: projectsCount } = await adminClient.from("projects").select("*", { count: "exact", head: true });
  const { count: papersCount } = await adminClient.from("papers").select("*", { count: "exact", head: true });

  const { data: usage } = await adminClient
    .from("org_usage")
    .select("monthly_generations")
    .order("monthly_generations", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">System Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface-container rounded-xl border border-outline-variant shadow-sm">
            <p className="text-sm text-on-surface-variant mb-1">Total Users</p>
            <p className="text-3xl font-bold text-primary">{usersCount || 0}</p>
          </div>
          <div className="p-6 bg-surface-container rounded-xl border border-outline-variant shadow-sm">
            <p className="text-sm text-on-surface-variant mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-primary">{projectsCount || 0}</p>
          </div>
          <div className="p-6 bg-surface-container rounded-xl border border-outline-variant shadow-sm">
            <p className="text-sm text-on-surface-variant mb-1">Total Papers Processed</p>
            <p className="text-3xl font-bold text-primary">{papersCount || 0}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Top Organizations by Usage</h2>
        <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-container-high border-b border-outline-variant">
              <tr>
                <th className="p-4 font-medium text-sm text-on-surface-variant">Rank</th>
                <th className="p-4 font-medium text-sm text-on-surface-variant">Generations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {usage?.map((u, i) => (
                <tr key={i} className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="p-4 text-sm text-on-surface">#{i + 1}</td>
                  <td className="p-4 text-sm font-medium text-primary">{u.monthly_generations}</td>
                </tr>
              ))}
              {(!usage || usage.length === 0) && (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-on-surface-variant text-sm">
                    No usage data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
