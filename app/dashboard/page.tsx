import { HeroCommand } from "@/components/dashboard/HeroCommand";
import { LatestSynthesis } from "@/components/dashboard/LatestSynthesis";
import { QuickActionUpload } from "@/components/dashboard/QuickActionUpload";
import { RecentLibrary } from "@/components/dashboard/RecentLibrary";

export default function DashboardPage() {
  const mockSynthesis = {
    title: "Attention Is All You Need: Rethinking Sequence Transduction",
    snippet: "The proposed Transformer architecture relies entirely on an attention mechanism to draw global dependencies between input and output, dispensing with recurrence and convolutions entirely. This synthesis highlights its superior parallelization and reduced training times compared to state-of-the-art RNNs...",
    tags: ["Deep Learning", "NLP"],
    timeAgo: "Just Now"
  };

  return (
    <div className="px-4 py-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto space-y-8 md:space-y-12">
      {/* Hero / Command */}
      <HeroCommand />
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* AI Summary Preview (Span 8) */}
        <LatestSynthesis 
          title={mockSynthesis.title}
          snippet={mockSynthesis.snippet}
          tags={mockSynthesis.tags}
          timeAgo={mockSynthesis.timeAgo}
        />
        
        {/* Quick Actions (Span 4) */}
        <QuickActionUpload />
        
        {/* Recent Papers (Span 12) */}
        <RecentLibrary />
      </div>
    </div>
  );
}
