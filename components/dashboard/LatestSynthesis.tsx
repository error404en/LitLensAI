import React from 'react';

export interface LatestSynthesisProps {
  title: string;
  snippet: string;
  tags: string[];
  timeAgo: string;
}

export function LatestSynthesis({ title, snippet, tags, timeAgo }: LatestSynthesisProps) {
  return (
    <div className="md:col-span-8 bg-surface-container-low border border-outline-variant border-l-2 border-l-primary rounded-lg p-6 space-y-4 card-hover">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">summarize</span>
          <span className="font-label-md text-label-md text-primary uppercase tracking-wider">Latest AI Synthesis</span>
        </div>
        <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded border border-outline-variant">
          {timeAgo}
        </span>
      </div>
      <div>
        <h3 className="font-headline-md text-headline-md mb-2">{title}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">
          {snippet}
        </p>
      </div>
      <div className="flex gap-2 pt-2">
        {tags.map((tag, idx) => (
          <span key={idx} className="text-label-sm font-label-sm px-2 py-1 bg-primary-container/10 text-primary border border-primary/20 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
