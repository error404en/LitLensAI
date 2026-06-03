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
    <div className="p-margin-mobile md:p-margin-desktop max-w-max-width mx-auto space-y-gutter">
      {/* Hero / Command */}
      <HeroCommand />
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
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
