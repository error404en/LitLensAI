"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePaperStore } from '../../stores/paper.store';

export function HeroCommand() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const setSearchQuery = usePaperStore(state => state.setSearchQuery);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
      router.push('/dashboard/papers');
    }
  };

  return (
    <section className="space-y-5">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-on-surface">Good Morning, Researcher.</h2>
      <form onSubmit={handleSearch} className="bg-surface-container-low border border-outline-variant rounded-xl p-3 md:p-4 flex items-center gap-4 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all shadow-sm">
        <span className="material-symbols-outlined text-primary ml-2">auto_awesome</span>
        <input 
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant text-base md:text-lg p-0 outline-none" 
          placeholder="Ask LitLens a question, synthesize a topic, or paste a DOI..." 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-outline-variant hover:bg-surface-bright cursor-pointer transition-colors">
          <span className="material-symbols-outlined text-[18px]">keyboard_return</span>
          <span className="hidden sm:inline">Run</span>
        </button>
      </form>
    </section>
  );
}
