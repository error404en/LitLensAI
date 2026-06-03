import React from 'react';
import { PaperCard } from '@/components/library/PaperCard';

export function RecentLibrary() {
  const mockPapers = [
    {
      id: 1,
      title: "Emergent Abilities of Large Language Models",
      authors: "Wei, J., Tay, Y., Bommasani, R. et al.",
      source: "Nature",
      year: "2023",
      status: "complete" as const,
      matchScore: "98%"
    },
    {
      id: 2,
      title: "Constitutional AI: Harmlessness from AI Feedback",
      authors: "Bai, Y., Kadavath, S., Kundu, S. et al.",
      source: "ArXiv",
      year: "2024",
      status: "processing" as const,
    },
    {
      id: 3,
      title: "AlphaFold: Highly accurate protein structure prediction",
      authors: "Jumper, J., Evans, R., Pritzel, A. et al.",
      source: "Science",
      year: "2022",
      status: "complete" as const,
      matchScore: "85%"
    }
  ];

  return (
    <div className="md:col-span-12 space-y-4">
      <div className="flex justify-between items-end">
        <h3 className="font-headline-md text-headline-md">Recent Library</h3>
        <a className="text-primary font-label-sm text-label-sm hover:underline flex items-center gap-1 cursor-pointer" href="#">
          View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockPapers.map(paper => (
          <PaperCard 
            key={paper.id}
            title={paper.title}
            authors={paper.authors}
            source={paper.source}
            year={paper.year}
            status={paper.status}
            matchScore={paper.matchScore}
          />
        ))}
      </div>
    </div>
  );
}
