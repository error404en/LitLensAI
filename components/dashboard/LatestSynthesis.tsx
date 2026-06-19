"use client"

import React, { useMemo } from 'react';
import { usePapers } from '@/hooks/usePapers';

export function LatestSynthesis() {
  const { papers, isLoading } = usePapers();

  const latestPaper = useMemo(() => {
    if (!papers || papers.length === 0) return null;
    return [...papers].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  }, [papers]);

  if (isLoading) {
    return (
      <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant border-l-4 border-l-primary/30 rounded-xl p-6 md:p-8 space-y-5 animate-pulse">
        <div className="h-6 w-32 bg-surface-variant rounded-full" />
        <div className="h-8 w-3/4 bg-surface-variant rounded-md" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-surface-variant rounded-md" />
          <div className="h-4 w-5/6 bg-surface-variant rounded-md" />
        </div>
      </div>
    );
  }

  if (!latestPaper) {
    return (
      <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant border-l-4 border-l-primary rounded-xl p-6 md:p-8 space-y-5 card-hover shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-primary text-[18px]">summarize</span>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Latest AI Synthesis</span>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-semibold leading-tight text-on-surface">No Papers Yet</h3>
          <p className="text-base text-on-surface-variant leading-relaxed">
            Upload your first paper to get an AI synthesis of its contents.
          </p>
        </div>
      </div>
    );
  }

  const title = latestPaper.title;
  const snippet = latestPaper.summary?.abstract || latestPaper.abstract || "No abstract available for this paper.";
  const tags = latestPaper.tags || [];
  const timeAgo = new Date(latestPaper.uploadedAt).toLocaleDateString();

  return (
    <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant border-l-4 border-l-primary rounded-xl p-6 md:p-8 space-y-5 card-hover shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-primary text-[18px]">summarize</span>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Latest Document</span>
        </div>
        <span className="text-xs font-medium text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full border border-outline-variant">
          {timeAgo}
        </span>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl md:text-2xl font-semibold leading-tight text-on-surface line-clamp-2">{title}</h3>
        <p className="text-base text-on-surface-variant leading-relaxed line-clamp-3">
          {snippet}
        </p>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-medium px-3 py-1 bg-surface-variant text-on-surface-variant border border-outline-variant rounded-md">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
