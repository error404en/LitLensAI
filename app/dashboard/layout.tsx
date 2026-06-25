import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { GlobalRealtime } from "@/components/providers/global-realtime";
import { auth, currentUser } from "@clerk/nextjs/server";
import { adminClient } from "@/lib/supabase/admin";

async function ensureUserExists() {
  try {
    const { userId } = await auth();
    if (!userId) return;

    let email = "";
    try {
      const user = await currentUser();
      email = user?.emailAddresses?.[0]?.emailAddress || "";
    } catch (clerkErr) {
      console.warn("Clerk currentUser() failed, proceeding with empty email:", clerkErr instanceof Error ? clerkErr.message : "Unknown error");
    }

    await adminClient
      .from("users")
      .upsert(
        { clerk_id: userId, email },
        { onConflict: "clerk_id" }
      );
  } catch (e) {
    console.error("ensureUserExists Supabase sync failed:", e instanceof Error ? e.message : "Unknown error");
  }
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ensureUserExists();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      <SideNavBar />
      <TopNavBar />
      <GlobalRealtime />
      
      {/* Main Content Canvas */}
      <main className="flex-1 ml-0 md:ml-64 mt-[60px] h-[calc(100vh-60px)] overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
