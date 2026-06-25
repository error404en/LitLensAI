"use client";

import React from 'react';
import Link from 'next/link';
import { PaperCard } from '@/components/library/PaperCard';
import { usePapers } from '@/hooks/usePapers';
import { Paper } from '@/lib/types';
import { AddToProjectDialog } from '@/components/projects/AddToProjectDialog';

export function RecentLibrary() {
  const { papers, isLoading } = usePapers();
  const [addingPaper, setAddingPaper] = React.useState<{ id: string; title: string } | null>(null);

  // Take the first 3 papers as recent
  const recentPapers = papers.slice(0, 3);

  return (
    <div className="lg:col-span-12 space-y-6 pt-4">
      <div className="flex justify-between items-center border-b border-outline-variant pb-4">
        <h3 className="text-xl font-semibold text-on-surface">Recent Library</h3>
        <Link href="/dashboard/papers" className="text-primary text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer transition-colors">
          View All <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="h-40 bg-surface-variant animate-pulse rounded-xl" />
          ))
        ) : recentPapers.length > 0 ? (
          recentPapers.map((paper: Paper) => (
            <PaperCard 
              key={paper.id}
              title={paper.title}
              authors={paper.authors?.map((a) => a.name).join(', ') || 'Unknown'}
              source={paper.journal || 'Unknown Source'}
              year={paper.year ? paper.year.toString() : 'Unknown Year'}
              status={paper.status as "complete" | "processing"}
              matchScore={undefined}
              onAddToProject={() => setAddingPaper({ id: paper.id, title: paper.title })}
            />
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-surface-container-low border border-dashed border-outline-variant rounded-xl text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/50 mb-3">auto_stories</span>
            <h4 className="text-lg font-medium text-on-surface">Your library is empty</h4>
            <p className="text-on-surface-variant max-w-sm mt-1">
              Upload your first document to start building your research repository.
            </p>
          </div>
        )}
      </div>

      {addingPaper && (
        <AddToProjectDialog
          isOpen={!!addingPaper}
          onClose={() => setAddingPaper(null)}
          paperId={addingPaper.id}
          paperTitle={addingPaper.title}
        />
      )}
    </div>
  );
}
