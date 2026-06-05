"use client";

import React, { useState } from 'react';

// Mock Data
const mockPapers = [
  { id: '1', title: 'Chain-of-Thought Prompting Elicits Reasoning', author: 'Wei et al.', year: '2022' },
  { id: '2', title: 'Self-Consistency Improves Chain of Thought', author: 'Wang et al.', year: '2023' },
  { id: '3', title: 'Tree of Thoughts: Deliberate Problem Solving', author: 'Yao et al.', year: '2023' },
  { id: '4', title: 'Constitutional AI: Harmlessness from AI Feedback', author: 'Bai et al.', year: '2024' },
];

const mockComparisonData = {
  '1': {
    methodology: 'Introduces standard Chain-of-Thought (CoT) prompting. Uses zero-shot and few-shot examples with intermediate reasoning steps to guide autoregressive generation.',
    datasets: 'GSM8K, SVAMP, MAWPS, AQuA, CommonsenseQA, StrategyQA',
    findings: 'CoT significantly improves performance on complex reasoning tasks compared to standard prompting. Emergent property in models >100B parameters.',
    limitations: 'Susceptible to isolated hallucination paths. High dependence on the quality of few-shot exemplars.'
  },
  '2': {
    methodology: 'Proposes Self-Consistency. Samples multiple diverse reasoning paths instead of greedy decoding, then marginalizes paths to select the most consistent answer.',
    datasets: 'GSM8K, AQuA, StrategyQA, ARC-c',
    findings: 'Remarkably boosts CoT performance across all tasks. Acts as a universal ensemble method that doesn\'t require additional training.',
    limitations: 'Increases computational cost linearly with the number of sampled paths. Marginal performance gains on simple tasks.'
  },
  '3': {
    methodology: 'Proposes Tree of Thoughts (ToT). Maintains a tree of intermediate reasoning steps, allowing the LM to self-evaluate (via value functions) and backtrack or search (BFS/DFS).',
    datasets: 'Game of 24, Creative Writing, Mini Crosswords',
    findings: 'Solves tasks where standard CoT fails completely (e.g., Game of 24 increases from 4% to 74%). Enables lookahead and deliberate planning.',
    limitations: 'Highly complex prompt engineering required per task. Significantly higher inference cost and latency than standard CoT.'
  },
  '4': {
    methodology: 'Trains a harmless AI assistant using only a list of rules (a constitution) and AI feedback, removing the need for human labels in the RLHF fine-tuning phase.',
    datasets: 'Helpful and Harmless (HH) RLHF dataset, Anthropic internal red-teaming',
    findings: 'Models trained with RLAIF (Constitutional AI) are significantly less harmful and less evasive than models trained purely on human feedback.',
    limitations: 'Performance tax on helpfulness; model may become overly cautious on safe but controversial topics.'
  }
};

type ComparisonAttribute = 'methodology' | 'datasets' | 'findings' | 'limitations';

export default function ComparePage() {
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>(['1', '2']);

  const togglePaper = (id: string) => {
    if (selectedPaperIds.includes(id)) {
      setSelectedPaperIds(selectedPaperIds.filter(p => p !== id));
    } else {
      if (selectedPaperIds.length < 3) {
        setSelectedPaperIds([...selectedPaperIds, id]);
      } else {
        alert("Maximum of 3 papers can be compared at once for optimal viewing.");
      }
    }
  };

  const attributes: { key: ComparisonAttribute, label: string, icon: string }[] = [
    { key: 'methodology', label: 'Methodology', icon: 'account_tree' },
    { key: 'datasets', label: 'Datasets', icon: 'database' },
    { key: 'findings', label: 'Key Findings', icon: 'lightbulb' },
    { key: 'limitations', label: 'Limitations', icon: 'warning' }
  ];

  return (
    <div className="px-4 py-6 md:p-10 lg:p-12 max-w-[1600px] mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">compare</span>
            <h1 className="text-3xl font-bold text-on-surface">Comparison Engine</h1>
          </div>
          <p className="text-on-surface-variant max-w-2xl">
            Select up to 3 papers from your project to generate a side-by-side AI comparison matrix of methodologies, datasets, and findings.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm shrink-0">
          <span className="material-symbols-outlined text-[20px]">sync</span>
          Regenerate Comparison
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Paper Selection */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-on-surface">Select Papers</h3>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {selectedPaperIds.length}/3
              </span>
            </div>
            <div className="space-y-2">
              {mockPapers.map((paper) => (
                <label 
                  key={paper.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPaperIds.includes(paper.id) 
                      ? 'bg-primary/5 border-primary/30' 
                      : 'bg-surface-variant/30 border-outline-variant hover:bg-surface-variant'
                  } ${!selectedPaperIds.includes(paper.id) && selectedPaperIds.length >= 3 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                >
                  <input 
                    type="checkbox" 
                    className="mt-1 shrink-0 accent-primary" 
                    checked={selectedPaperIds.includes(paper.id)}
                    disabled={!selectedPaperIds.includes(paper.id) && selectedPaperIds.length >= 3}
                    onChange={() => togglePaper(paper.id)}
                  />
                  <div className="space-y-1 flex-1">
                    <p className={`text-sm font-medium leading-tight line-clamp-2 ${selectedPaperIds.includes(paper.id) ? 'text-on-surface' : 'text-on-surface-variant'}`}>
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
        </div>

        {/* Right Panel: Comparison Matrix */}
        <div className="xl:col-span-9 overflow-x-auto custom-scrollbar pb-4">
          {selectedPaperIds.length === 0 ? (
            <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-2xl p-16 flex flex-col items-center text-center h-full justify-center min-h-[400px]">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 opacity-50">compare_arrows</span>
              <h3 className="text-xl font-semibold mb-2 text-on-surface">No papers selected</h3>
              <p className="text-on-surface-variant max-w-md">Please select at least one paper from the left panel to begin the comparison.</p>
            </div>
          ) : (
            <div className="min-w-[800px] border border-outline-variant rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
              {/* Table Header (Papers) */}
              <div 
                className="grid border-b border-outline-variant bg-surface-variant/30" 
                style={{ gridTemplateColumns: `150px repeat(${selectedPaperIds.length}, minmax(280px, 1fr))` }}
              >
                <div className="p-5 border-r border-outline-variant flex items-end">
                  <span className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Attribute</span>
                </div>
                {selectedPaperIds.map(id => {
                  const paper = mockPapers.find(p => p.id === id);
                  return (
                    <div key={id} className="p-5 border-r border-outline-variant last:border-r-0 bg-surface-container-low">
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <span className="material-symbols-outlined text-lg">description</span>
                        <span className="text-xs font-semibold uppercase">{paper?.year}</span>
                      </div>
                      <h4 className="font-semibold text-on-surface leading-snug line-clamp-2" title={paper?.title}>{paper?.title}</h4>
                      <p className="text-sm text-on-surface-variant mt-1">{paper?.author}</p>
                    </div>
                  );
                })}
              </div>

              {/* Table Body (Attributes) */}
              <div className="flex flex-col">
                {attributes.map((attr) => (
                  <div 
                    key={attr.key} 
                    className="grid border-b border-outline-variant last:border-b-0" 
                    style={{ gridTemplateColumns: `150px repeat(${selectedPaperIds.length}, minmax(280px, 1fr))` }}
                  >
                    <div className="p-5 border-r border-outline-variant bg-surface-variant/10">
                      <div className="sticky top-5 flex flex-col gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant">{attr.icon}</span>
                        <span className="text-sm font-semibold text-on-surface">{attr.label}</span>
                      </div>
                    </div>
                    {selectedPaperIds.map(id => {
                      const data = mockComparisonData[id as keyof typeof mockComparisonData];
                      return (
                        <div key={id} className="p-6 border-r border-outline-variant last:border-r-0 hover:bg-surface-variant/20 transition-colors">
                          <p className="text-sm text-on-surface-variant leading-relaxed">
                            {data[attr.key]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
