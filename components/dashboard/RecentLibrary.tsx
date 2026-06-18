"use client";

import React from 'react';
import Link from 'next/link';
import { PaperCard } from '@/components/library/PaperCard';
import { usePapers } from '@/hooks/usePapers';

export function RecentLibrary() {
  const { papers, isLoading } = usePapers();

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
          recentPapers.map((paper: any) => (
            <PaperCard 
              key={paper.id}
              title={paper.title}
              authors={paper.authors?.map((a: any) => a.name).join(', ') || 'Unknown'}
              source={paper.journal || 'Unknown Source'}
              year={paper.year ? paper.year.toString() : 'Unknown Year'}
              status={paper.status as "complete" | "processing"}
              matchScore={undefined}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-on-surface-variant">
            No recent papers found. Upload a document to get started.
          </div>
        )}
      </div>
    </div>
  );
}
