"use client";

import React, { useState, useEffect } from 'react';
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePaperStore } from "../../stores/paper.store";

export function TopNavBar() {
  const storeQuery = usePaperStore(state => state.searchQuery);
  const setSearchQuery = usePaperStore(state => state.setSearchQuery);
  const [query, setQuery] = useState(storeQuery);
  const router = useRouter();

  // Sync local input with store search query
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(storeQuery);
  }, [storeQuery]);

  const executeSearch = (searchVal: string) => {
    setSearchQuery(searchVal);
    router.push('/dashboard/papers');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch(query);
    }
  };

  return (
    <header className="bg-surface/70 dark:bg-surface/70 backdrop-blur-md fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-50 border-b border-outline-variant dark:border-outline-variant flex justify-between items-center px-8 py-3 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <span 
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] cursor-pointer hover:text-primary transition-colors"
            onClick={() => executeSearch(query)}
          >
            search
          </span>
          <input 
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 pl-10 py-1.5 font-body-sm text-body-sm outline-none" 
            placeholder="Search LitLens AI..." 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-on-surface-variant dark:text-on-surface-variant">
        <OrganizationSwitcher hidePersonal={false} />
        <button className="hover:text-primary dark:hover:text-primary transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <UserButton />
      </div>
    </header>
  );
}
