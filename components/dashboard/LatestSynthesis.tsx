import React from 'react';

export interface LatestSynthesisProps {
  title: string;
  snippet: string;
  tags: string[];
  timeAgo: string;
}

export function LatestSynthesis({ title, snippet, tags, timeAgo }: LatestSynthesisProps) {
  return (
    <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant border-l-4 border-l-primary rounded-xl p-6 md:p-8 space-y-5 card-hover shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-primary text-[18px]">summarize</span>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Latest AI Synthesis</span>
        </div>
        <span className="text-xs font-medium text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full border border-outline-variant">
          {timeAgo}
        </span>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl md:text-2xl font-semibold leading-tight text-on-surface">{title}</h3>
        <p className="text-base text-on-surface-variant leading-relaxed line-clamp-3">
          {snippet}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 pt-3">
        {tags.map((tag, idx) => (
          <span key={idx} className="text-xs font-medium px-3 py-1 bg-surface-variant text-on-surface-variant border border-outline-variant rounded-md">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
