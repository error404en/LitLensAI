import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopNavBar } from "@/components/layout/TopNavBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      <SideNavBar />
      <TopNavBar />
      
      {/* Main Content Canvas */}
      <main className="flex-1 ml-0 md:ml-64 mt-[60px] h-[calc(100vh-60px)] overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
