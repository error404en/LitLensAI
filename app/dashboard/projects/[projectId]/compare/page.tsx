"use client";

import React, { useState } from 'react';

import { useParams } from 'next/navigation';
import { usePapers } from '../../../../../hooks/usePapers';
import { comparePapersAction } from '../../../../actions/ai.actions';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ComparePage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { papers, isLoading: isPapersLoading } = usePapers(projectId);
  
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const togglePaper = (id: string) => {
    if (selectedPaperIds.includes(id)) {
      setSelectedPaperIds(selectedPaperIds.filter(p => p !== id));
    } else {
      if (selectedPaperIds.length < 3) {
        setSelectedPaperIds([...selectedPaperIds, id]);
      }
    }
  };

  const handleRegenerate = async () => {
    if (selectedPaperIds.length === 0) return;
    setIsGenerating(true);
    setComparisonResult(null);
    try {
      const selectedTitles = papers.filter(p => selectedPaperIds.includes(p.id)).map(p => p.title).join(", ");
      const query = `Compare the following papers: ${selectedTitles}`;
      const result = await comparePapersAction(projectId, query);
      if (typeof result === 'object' && result !== null && 'error' in result) {
        setComparisonResult(`**Error:** ${(result as { error: string }).error}`);
      } else {
        setComparisonResult(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error(error);
      setComparisonResult("Failed to generate comparison. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
        <button 
          onClick={handleRegenerate}
          disabled={isGenerating || selectedPaperIds.length === 0}
          className="flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm shrink-0 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <span className="material-symbols-outlined text-[20px]">sync</span>}
          {isGenerating ? "Comparing..." : "Generate Comparison"}
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
              {isPapersLoading ? (
                <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>
              ) : papers.length === 0 ? (
                <div className="p-4 text-sm text-on-surface-variant">No papers in this project.</div>
              ) : (
                papers.map((paper) => (
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
                        {paper.authors?.[0]?.name} • {paper.year}
                      </p>
                    </div>
                  </label>
                ))
              )}
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
              {isGenerating ? (
                <div className="p-16 flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-on-surface">Analyzing methodologies and findings...</h3>
                </div>
              ) : comparisonResult ? (
                <div className="p-8 prose prose-invert max-w-none text-on-surface">
                  <ReactMarkdown>{comparisonResult}</ReactMarkdown>
                </div>
              ) : (
                <div className="p-16 flex flex-col items-center text-center h-full justify-center min-h-[400px]">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 opacity-50">compare_arrows</span>
                  <h3 className="text-xl font-semibold mb-2 text-on-surface">Ready to Compare</h3>
                  <p className="text-on-surface-variant max-w-md">Select up to 3 papers and click Generate Comparison to synthesize their findings.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
