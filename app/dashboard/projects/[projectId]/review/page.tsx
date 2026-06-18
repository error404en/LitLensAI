"use client";

import React, { useState } from 'react';

import { useParams } from 'next/navigation';
import { usePapers } from '../../../../../hooks/usePapers';
import { reviewPapersAction } from '../../../../actions/ai.actions';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function LiteratureReviewGeneratorPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { papers, isLoading: isPapersLoading } = usePapers(projectId);
  
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);

  const [topic, setTopic] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");

  const togglePaper = (id: string) => {
    if (selectedPaperIds.includes(id)) {
      setSelectedPaperIds(selectedPaperIds.filter(p => p !== id));
    } else {
      setSelectedPaperIds([...selectedPaperIds, id]);
    }
  };

  const handleGenerate = async () => {
    if (selectedPaperIds.length === 0) return;
    setIsGenerating(true);
    setReviewResult(null);
    try {
      const selectedTitles = papers.filter(p => selectedPaperIds.includes(p.id)).map(p => p.title).join(", ");
      const query = `Write a literature review on "${topic}". Research Question: "${researchQuestion}". Synthesize these papers: ${selectedTitles}`;
      const result = await reviewPapersAction(projectId, query);
      setReviewResult(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error);
      setReviewResult("Failed to generate literature review. Please try again.");
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
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Impact of sleep on memory consolidation"
                className="w-full bg-surface-variant/50 border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

            {/* Research Question */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface block">Research Question</label>
              <textarea 
                rows={3}
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                placeholder="What specific question should this review address?"
                className="w-full bg-surface-variant/50 border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors text-sm resize-none"
              />
            </div>

            {/* Paper Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-on-surface">Selected Papers</label>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {selectedPaperIds.length} selected
                </span>
              </div>
              
              <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {isPapersLoading ? (
                  <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : papers.length === 0 ? (
                  <div className="p-4 text-sm text-on-surface-variant">No papers in this project.</div>
                ) : (
                  papers.map((paper) => (
                    <label 
                      key={paper.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPaperIds.includes(paper.id) 
                          ? 'bg-primary/5 border-primary/30' 
                          : 'bg-surface-variant/30 border-outline-variant hover:bg-surface-variant'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="mt-1 shrink-0 accent-primary" 
                        checked={selectedPaperIds.includes(paper.id)}
                        onChange={() => togglePaper(paper.id)}
                      />
                      <div className="space-y-1 flex-1">
                        <p className={`text-sm font-medium line-clamp-2 leading-tight ${selectedPaperIds.includes(paper.id) ? 'text-on-surface' : 'text-on-surface-variant'}`}>
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

            {/* Generate Button */}
            <div className="pt-4 border-t border-outline-variant">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || selectedPaperIds.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
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
                  disabled={!reviewResult}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  Copy
                </button>
                <button 
                  disabled={!reviewResult}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export
                </button>
              </div>
            </div>

            {/* Output Content */}
            <div className="p-8 flex-1 bg-background/50 overflow-y-auto">
              {!reviewResult && !isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant opacity-60">
                  <span className="material-symbols-outlined text-5xl mb-4">history_edu</span>
                  <p className="text-lg font-medium mb-1">Ready to draft your review</p>
                  <p className="text-sm max-w-sm">Configure your topic and select papers on the left, then click Generate to synthesize a literature review.</p>
                </div>
              ) : isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-primary">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <p className="text-lg font-medium animate-pulse">Analyzing papers and drafting synthesis...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-on-surface">
                  <ReactMarkdown>{reviewResult || ""}</ReactMarkdown>
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
