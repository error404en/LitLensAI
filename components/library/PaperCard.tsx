import React from 'react';

export interface PaperCardProps {
  title: string;
  authors: string;
  source: string;
  year: string;
  status: 'complete' | 'processing';
  matchScore?: string;
  onReadSummary?: () => void;
}

export function PaperCard({
  title,
  authors,
  source,
  year,
  status,
  matchScore,
  onReadSummary
}: PaperCardProps) {
  const isComplete = status === 'complete';

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 card-hover flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium text-on-surface-variant bg-surface-variant px-2.5 py-1 rounded-md">
          {source} • {year}
        </span>
        {isComplete ? (
          <span className="material-symbols-outlined text-emerald-500 text-[18px] tooltip" title="AI Analysis Complete">
            check_circle
          </span>
        ) : (
          <span className="material-symbols-outlined text-amber-500 text-[18px] animate-spin-slow tooltip" title="Processing...">
            sync
          </span>
        )}
      </div>
      
      <h4 className="text-base font-semibold mb-2 line-clamp-2 flex-1 text-on-surface leading-snug hover:text-primary transition-colors cursor-pointer">
        {title}
      </h4>
      <p className="text-sm text-on-surface-variant mb-5 line-clamp-1">
        {authors}
      </p>
      
      <div className={`border-t border-outline-variant pt-4 flex justify-between items-center ${!isComplete ? 'opacity-70' : ''}`}>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${isComplete ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
          {isComplete && matchScore ? `${matchScore} Match` : 'Processing...'}
        </span>
        {isComplete && (
          <button 
            className="text-primary text-sm font-medium hover:underline hover:text-primary-container cursor-pointer transition-colors"
            onClick={onReadSummary}
          >
            Read Summary
          </button>
        )}
      </div>
    </div>
  );
}
