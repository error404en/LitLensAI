import React from 'react';
import { PaperCard } from "@/components/library/PaperCard";
import { LatestSynthesis } from "@/components/dashboard/LatestSynthesis";

export default async function ProjectWorkspacePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  // Mock Data
  const projectInfo = {
    title: "Large Language Model Reasoning Capabilities",
    description: "Investigating the emergent reasoning skills of scale in causal language models and evaluating their performance on complex mathematical tasks.",
    created: "2 weeks ago"
  };

  const stats = [
    { label: "Papers", value: "12", icon: "description" },
    { label: "Summaries", value: "10", icon: "summarize" },
    { label: "Reviews", value: "2", icon: "rate_review" },
  ];

  const recentPapers = [
    { id: "1", title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", authors: "Wei et al.", source: "NeurIPS", year: "2022", status: "complete" as const, matchScore: "99%" },
    { id: "2", title: "Self-Consistency Improves Chain of Thought Reasoning", authors: "Wang et al.", source: "ICLR", year: "2023", status: "complete" as const, matchScore: "95%" },
    { id: "3", title: "Tree of Thoughts: Deliberate Problem Solving", authors: "Yao et al.", source: "NeurIPS", year: "2023", status: "processing" as const }
  ];

  const recentSyntheses = [
    {
      title: "Impact of Chain-of-Thought on Mathematical Reasoning",
      snippet: "Comparing Wei et al. and Wang et al., it is evident that generating intermediate reasoning steps significantly boosts performance on GSM8K. Furthermore, self-consistency—sampling multiple reasoning paths—provides a reliable consensus that mitigates hallucinations.",
      tags: ["Chain-of-Thought", "Math", "Reasoning"],
      timeAgo: "2 days ago"
    }
  ];

  return (
    <div className="px-4 py-6 md:p-10 lg:p-12 max-w-[1440px] mx-auto space-y-10 md:space-y-12">
      
      {/* Project Header */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
              <span className="material-symbols-outlined text-primary text-3xl">folder_open</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-on-surface">{projectInfo.title}</h1>
          </div>
          <p className="text-lg text-on-surface-variant max-w-3xl leading-relaxed">
            {projectInfo.description}
          </p>
          <p className="text-sm text-on-surface-variant mt-4 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            Created {projectInfo.created} • ID: {projectId}
          </p>
        </div>
        
        {/* Action Buttons - Preparing for future AI features */}
        <div className="flex flex-wrap gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95">
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Upload Paper
          </button>
          <button className="flex items-center gap-2 bg-surface-container-high text-on-surface px-5 py-2.5 rounded-xl font-medium border border-outline-variant hover:bg-surface-variant transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">compare</span>
            Compare
          </button>
          <button className="flex items-center gap-2 bg-surface-container-high text-on-surface px-5 py-2.5 rounded-xl font-medium border border-outline-variant hover:bg-surface-variant transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">troubleshoot</span>
            Gap Analysis
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex items-center gap-5 shadow-sm hover:border-primary/50 transition-colors cursor-default">
            <div className="bg-primary/10 p-4 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
              <h4 className="text-3xl font-bold text-on-surface mt-1">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="space-y-12">
        
        {/* Recent Syntheses Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-outline-variant pb-4">
            <h3 className="text-xl font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              Recent AI Syntheses
            </h3>
            <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer transition-colors">
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {recentSyntheses.map((synth, idx) => (
              <LatestSynthesis 
                key={idx}
                title={synth.title}
                snippet={synth.snippet}
                tags={synth.tags}
                timeAgo={synth.timeAgo}
              />
            ))}
            {/* Empty placeholder to fill the rest of the 12-col grid alongside LatestSynthesis which spans 8 */}
            <div className="hidden lg:flex lg:col-span-4 bg-surface-container-low/50 border border-dashed border-outline-variant rounded-xl items-center justify-center text-center p-6 text-on-surface-variant">
              <div className="space-y-2">
                <span className="material-symbols-outlined text-3xl opacity-50">add_circle</span>
                <p className="text-sm font-medium">Generate new synthesis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Papers Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-outline-variant pb-4">
            <h3 className="text-xl font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant">library_books</span>
              Project Papers
            </h3>
            <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer transition-colors">
              View Library <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentPapers.map((paper) => (
              <PaperCard 
                key={paper.id}
                title={paper.title}
                authors={paper.authors}
                source={paper.source}
                year={paper.year}
                status={paper.status}
                matchScore={paper.matchScore}
              />
            ))}
            
            {/* Empty Paper Slot for Uploading */}
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-5 flex flex-col items-center justify-center min-h-[220px] text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors cursor-pointer group">
              <div className="bg-surface-variant group-hover:bg-primary/10 p-3 rounded-full mb-3 transition-colors">
                <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">upload</span>
              </div>
              <p className="font-medium text-sm">Upload new paper</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
