import React from 'react';

export function QuickActionUpload() {
  return (
    <div className="md:col-span-4 bg-surface-container-low border border-outline-variant rounded-lg p-6 flex flex-col justify-center items-center text-center border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
      <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
      </div>
      <h4 className="font-headline-md text-headline-md mb-1">Analyze New Paper</h4>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Drag & drop PDF, or paste DOI/URL</p>
      <button className="bg-primary text-on-primary px-4 py-2 rounded-DEFAULT font-label-md text-label-md hover:brightness-110 cursor-pointer">
        Browse Files
      </button>
    </div>
  );
}
