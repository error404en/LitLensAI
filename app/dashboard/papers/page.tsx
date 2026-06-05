"use client";

import React, { useState, useMemo } from 'react';
import { PaperCard } from "@/components/library/PaperCard";

// Mock Data
const mockPapers = [
  {
    id: "1",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    source: "NeurIPS",
    year: "2017",
    status: "complete" as const,
    matchScore: "98%"
  },
  {
    id: "2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al.",
    source: "NAACL",
    year: "2019",
    status: "complete" as const,
    matchScore: "95%"
  },
  {
    id: "3",
    title: "Language Models are Few-Shot Learners",
    authors: "Brown et al.",
    source: "NeurIPS",
    year: "2020",
    status: "processing" as const,
  },
  {
    id: "4",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: "Lewis et al.",
    source: "NeurIPS",
    year: "2020",
    status: "complete" as const,
    matchScore: "92%"
  },
  {
    id: "5",
    title: "InstructGPT: Training language models to follow instructions",
    authors: "Ouyang et al.",
    source: "NeurIPS",
    year: "2022",
    status: "processing" as const,
  },
  {
    id: "6",
    title: "LoRA: Low-Rank Adaptation of Large Language Models",
    authors: "Hu et al.",
    source: "ICLR",
    year: "2022",
    status: "complete" as const,
    matchScore: "88%"
  }
];

export default function PapersLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPapers = useMemo(() => {
    return mockPapers.filter(paper => {
      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        paper.title.toLowerCase().includes(searchLower) || 
        paper.authors.toLowerCase().includes(searchLower) ||
        paper.source.toLowerCase().includes(searchLower);

      // Filter by status
      const matchesStatus = statusFilter === 'all' || paper.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="px-4 py-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paper Library</h1>
        <p className="text-on-surface-variant">Browse, search, and manage your uploaded research papers.</p>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
            search
          </span>
          <input 
            type="text" 
            placeholder="Search papers by title, author, or source..." 
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary transition-colors shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative md:w-48">
          <select 
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-4 pr-10 text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="complete">Complete</option>
            <option value="processing">Processing</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {/* Papers Grid */}
      {filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredPapers.map((paper) => (
            <PaperCard 
              key={paper.id} 
              title={paper.title}
              authors={paper.authors}
              source={paper.source}
              year={paper.year}
              status={paper.status}
              matchScore={paper.matchScore}
              onReadSummary={() => console.log(`Reading summary for ${paper.id}`)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-outline-variant rounded-2xl bg-surface-container-low/30">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 opacity-50">
            search_off
          </span>
          <h3 className="text-xl font-semibold mb-2">No papers found</h3>
          <p className="text-on-surface-variant max-w-md">
            We couldn't find any papers matching your search criteria. Try adjusting your search terms or filters.
          </p>
          {(searchQuery !== '' || statusFilter !== 'all') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-6 px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
