import React from 'react';

export function QuickActionUpload() {
  return (
    <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant rounded-xl p-8 flex flex-col justify-center items-center text-center border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group shadow-sm">
      <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-5 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
        <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
      </div>
      <h4 className="text-lg font-semibold mb-2 text-on-surface">Analyze New Paper</h4>
      <p className="text-sm text-on-surface-variant mb-6 px-4 leading-relaxed">Drag & drop PDF, or paste DOI/URL</p>
      <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 cursor-pointer transition-all active:scale-95 shadow-md">
        Browse Files
      </button>
    </div>
  );
}
