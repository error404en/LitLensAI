import React from 'react';

export function HeroCommand() {
  return (
    <section className="space-y-4">
      <h2 className="font-headline-lg text-headline-lg text-on-surface">Good Morning, Researcher.</h2>
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex items-center gap-4 focus-within:border-primary/50 transition-colors">
        <span className="material-symbols-outlined text-primary">auto_awesome</span>
        <input 
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md p-0 outline-none" 
          placeholder="Ask LitLens a question, synthesize a topic, or paste a DOI..." 
          type="text" 
        />
        <button className="bg-surface-variant text-on-surface px-3 py-1.5 rounded text-label-sm font-label-sm flex items-center gap-1 border border-outline-variant hover:bg-surface-bright cursor-pointer">
          <span className="material-symbols-outlined text-[14px]">keyboard_return</span>
          Run
        </button>
      </div>
    </section>
  );
}
