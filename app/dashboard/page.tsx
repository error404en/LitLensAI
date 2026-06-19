import { HeroCommand } from "@/components/dashboard/HeroCommand";
import { LatestSynthesis } from "@/components/dashboard/LatestSynthesis";
import { QuickActionUpload } from "@/components/dashboard/QuickActionUpload";
import { RecentLibrary } from "@/components/dashboard/RecentLibrary";

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto space-y-8 md:space-y-12">
      {/* Hero / Command */}
      <HeroCommand />
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* AI Summary Preview (Span 8) */}
        <LatestSynthesis />
        
        {/* Quick Actions (Span 4) */}
        <QuickActionUpload />
        
        {/* Recent Papers (Span 12) */}
        <RecentLibrary />
      </div>
    </div>
  );
}
