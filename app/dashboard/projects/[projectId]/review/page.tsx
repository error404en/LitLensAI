"use client";

import React, { useState } from 'react';

// Mock Data
const mockPapers = [
  { id: '1', title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models', author: 'Wei et al.', year: '2022', selected: true },
  { id: '2', title: 'Self-Consistency Improves Chain of Thought Reasoning', author: 'Wang et al.', year: '2023', selected: true },
  { id: '3', title: 'Tree of Thoughts: Deliberate Problem Solving', author: 'Yao et al.', year: '2023', selected: false },
  { id: '4', title: 'Constitutional AI: Harmlessness from AI Feedback', author: 'Bai et al.', year: '2024', selected: false },
];

export default function LiteratureReviewGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [papers, setPapers] = useState(mockPapers);

  const togglePaper = (id: string) => {
    setPapers(papers.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2000);
  };

  return (
    <div className="px-4 py-6 md:p-10 lg:p-12 max-w-[1600px] mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">menu_book</span>
            <h1 className="text-3xl font-bold text-on-surface">Literature Review Generator</h1>
          </div>
          <p className="text-on-surface-variant max-w-2xl">
            Synthesize your selected papers into a cohesive, structured literature review draft complete with inline citations.
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-sm space-y-6">
            
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">Topic</label>
              <input 
                type="text" 
                defaultValue="Evolution of Chain-of-Thought Reasoning"
                placeholder="e.g. Impact of sleep on memory consolidation"
                className="w-full bg-surface-variant/50 border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

            {/* Research Question */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">Research Question</label>
              <textarea 
                rows={3}
                defaultValue="How does explicit reasoning tracing improve the reliability and factual accuracy of large language models?"
                placeholder="What specific question should this review address?"
                className="w-full bg-surface-variant/50 border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors text-sm resize-none"
              />
            </div>

            {/* Paper Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-on-surface">Selected Papers</label>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {papers.filter(p => p.selected).length} selected
                </span>
              </div>
              
              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {papers.map((paper) => (
                  <label 
                    key={paper.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      paper.selected 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-surface-variant/30 border-outline-variant hover:bg-surface-variant'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="mt-1 shrink-0 accent-primary" 
                      checked={paper.selected}
                      onChange={() => togglePaper(paper.id)}
                    />
                    <div className="space-y-1 flex-1">
                      <p className={`text-sm font-medium line-clamp-2 leading-tight ${paper.selected ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {paper.title}
                      </p>
                      <p className="text-xs text-on-surface-variant/80">
                        {paper.author} • {paper.year}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t border-outline-variant">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || papers.filter(p => p.selected).length === 0}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin-slow">sync</span>
                    Synthesizing Literature...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">magic_button</span>
                    Generate Review
                  </>
                )}
              </button>
            </div>
            
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col h-full min-h-[600px] shadow-sm overflow-hidden">
            
            {/* Output Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-variant/30">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-primary">edit_document</span>
                Draft
              </h2>
              
              <div className="flex items-center gap-2">
                <button 
                  disabled={!hasGenerated}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  Copy
                </button>
                <button 
                  disabled={!hasGenerated}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export
                </button>
              </div>
            </div>

            {/* Output Content */}
            <div className="p-8 flex-1 bg-background/50 overflow-y-auto">
              {!hasGenerated && !isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant opacity-60">
                  <span className="material-symbols-outlined text-5xl mb-4">history_edu</span>
                  <p className="text-lg font-medium mb-1">Ready to draft your review</p>
                  <p className="text-sm max-w-sm">Configure your topic and select papers on the left, then click Generate to synthesize a literature review.</p>
                </div>
              ) : isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-primary">
                  <div className="relative">
                    <span className="material-symbols-outlined text-6xl animate-spin-slow opacity-20">settings</span>
                    <span className="material-symbols-outlined text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">auto_awesome</span>
                  </div>
                  <p className="mt-6 text-lg font-medium animate-pulse">Analyzing papers and drafting synthesis...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-on-surface">
                  <h1 className="text-3xl font-bold mb-6 text-on-surface">The Evolution of Chain-of-Thought in Large Language Models</h1>
                  
                  <p className="mb-4 leading-relaxed text-on-surface-variant">
                    Recent advancements in large language models (LLMs) have demonstrated emergent reasoning capabilities, heavily influenced by prompting strategies. This review synthesizes key findings from seminal papers, focusing on the Chain-of-Thought (CoT) prompting methodology and its enhancements.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 mt-8 text-on-surface">1. Foundational Mechanisms</h3>
                  <p className="mb-4 leading-relaxed text-on-surface-variant">
                    The foundational introduction of CoT by Wei et al. (2022) established that prompting an LLM to generate intermediate reasoning steps significantly improves performance on complex tasks. This simple intervention bypasses the need for task-specific fine-tuning on standard mathematical and logic benchmarks <span className="text-primary bg-primary/10 px-1 rounded cursor-pointer hover:bg-primary/20">[1]</span>.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 mt-8 text-on-surface">2. Reliability and Self-Consistency</h3>
                  <p className="mb-4 leading-relaxed text-on-surface-variant">
                    While standard CoT is powerful, it is susceptible to isolated hallucinations. Wang et al. (2023) addressed this by introducing Self-Consistency, where multiple reasoning paths are sampled and aggregated. Their results showed a marked increase in reliability on GSM8K and other reasoning benchmarks, establishing consensus as a critical mechanism for truth-finding in autoregressive models <span className="text-primary bg-primary/10 px-1 rounded cursor-pointer hover:bg-primary/20">[2]</span>.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3 mt-8 text-on-surface">Conclusion</h3>
                  <p className="mb-4 leading-relaxed text-on-surface-variant">
                    The integration of explicit reasoning traces (CoT) and ensembling (Self-Consistency) represents a paradigm shift in eliciting reliable outputs from LLMs. Future research directions suggested across the literature include reducing the computational overhead of sampling multiple paths and extending these techniques to multimodal inputs.
                  </p>
                  
                  <hr className="border-outline-variant my-8" />
                  
                  <h4 className="font-semibold mb-4 text-on-surface">References</h4>
                  <ol className="list-decimal pl-5 text-sm text-on-surface-variant space-y-2">
                    <li>Wei, J. et al. (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. NeurIPS.</li>
                    <li>Wang, X. et al. (2023). Self-Consistency Improves Chain of Thought Reasoning. ICLR.</li>
                  </ol>
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
