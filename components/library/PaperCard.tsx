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
    <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 card-hover flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <span className="text-label-sm font-label-sm text-on-surface-variant">
          {source} • {year}
        </span>
        {isComplete ? (
          <span className="material-symbols-outlined text-tertiary text-[16px] tooltip" title="AI Analysis Complete">
            check_circle
          </span>
        ) : (
          <span className="material-symbols-outlined text-outline text-[16px] animate-pulse tooltip" title="Processing...">
            sync
          </span>
        )}
      </div>
      <h4 className="font-body-md text-body-md font-medium mb-1 line-clamp-2 flex-1">
        {title}
      </h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
        {authors}
      </p>
      
      <div className={`border-t border-outline-variant pt-3 flex justify-between items-center ${!isComplete ? 'opacity-50' : ''}`}>
        <span className="text-label-sm font-label-sm text-on-surface-variant bg-surface px-2 py-0.5 rounded">
          {isComplete && matchScore ? `${matchScore} Match` : 'Processing'}
        </span>
        {isComplete && (
          <button 
            className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer"
            onClick={onReadSummary}
          >
            Read Summary
          </button>
        )}
      </div>
    </div>
  );
}
