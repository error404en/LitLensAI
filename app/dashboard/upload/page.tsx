'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type UploadStep = 'idle' | 'uploading' | 'processing' | 'success';

export default function UploadPage() {
  const [step, setStep] = useState<UploadStep>('idle');
  const [progress, setProgress] = useState(0);

  // Mock the upload and processing flow
  useEffect(() => {
    if (step === 'uploading') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('processing'), 500);
            return 100;
          }
          return prev + 5; // increment progress
        });
      }, 100);
      return () => clearInterval(interval);
    }

    if (step === 'processing') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 3000); // simulate 3 seconds of AI processing
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleStartUpload = () => {
    setProgress(0);
    setStep('uploading');
  };

  const handleReset = () => {
    setStep('idle');
    setProgress(0);
  };

  return (
    <div className="px-4 py-6 md:p-10 lg:p-12 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-2xl font-bold text-on-surface">Upload Research Paper</h1>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 md:p-12 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center transition-all">
        
        {/* Step 1: IDLE / DROPZONE */}
        {step === 'idle' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center mb-6 text-primary border-4 border-surface">
              <span className="material-symbols-outlined text-[40px]">note_add</span>
            </div>
            <h2 className="text-2xl font-semibold mb-3">Upload your PDF</h2>
            <p className="text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
              Drag and drop your research paper here, or browse your computer. We'll automatically extract the text, analyze the methodology, and prepare a synthesis.
            </p>
            
            <div className="w-full max-w-md border-2 border-dashed border-outline-variant rounded-xl p-10 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group" onClick={handleStartUpload}>
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary mb-3 transition-colors">cloud_upload</span>
              <p className="font-medium text-on-surface">Click to browse or drag file</p>
              <p className="text-sm text-on-surface-variant mt-1">PDF up to 50MB</p>
            </div>

            <div className="mt-8 flex items-center gap-4 w-full max-w-md">
              <div className="flex-1 h-px bg-outline-variant"></div>
              <span className="text-sm text-on-surface-variant uppercase tracking-wider font-semibold">OR</span>
              <div className="flex-1 h-px bg-outline-variant"></div>
            </div>

            <div className="mt-8 w-full max-w-md flex gap-3">
              <input 
                type="text" 
                placeholder="Paste DOI or URL..." 
                className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
              />
              <button onClick={handleStartUpload} className="bg-surface-variant text-on-surface px-4 py-2 rounded-lg font-medium hover:bg-surface-bright transition-colors">
                Import
              </button>
            </div>
          </div>
        )}

        {/* Step 2: UPLOADING */}
        {step === 'uploading' && (
          <div className="w-full max-w-md flex flex-col items-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <span className="material-symbols-outlined text-[32px] animate-bounce">upload</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Uploading Document...</h2>
            <p className="text-sm text-on-surface-variant mb-8">attention_is_all_you_need.pdf</p>

            <div className="w-full bg-surface-variant rounded-full h-2 mb-3 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-sm font-medium text-on-surface-variant">
              <span>{progress}%</span>
              <span>2.4 MB / 2.4 MB</span>
            </div>
          </div>
        )}

        {/* Step 3: PROCESSING */}
        {step === 'processing' && (
          <div className="w-full max-w-md flex flex-col items-center animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-surface-variant rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px] animate-pulse">auto_awesome</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-3">AI Synthesis in Progress</h2>
            
            <div className="space-y-4 text-left w-full bg-surface rounded-xl p-5 border border-outline-variant">
              <div className="flex items-center gap-3 text-sm text-emerald-500">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Text extracted successfully
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-500">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Embeddings generated
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface animate-pulse">
                <span className="material-symbols-outlined text-[18px] text-amber-500 animate-spin-slow">sync</span>
                Extracting core methodologies...
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">pending</span>
                Generating paper summary...
              </div>
            </div>
          </div>
        )}

        {/* Step 4: SUCCESS */}
        {step === 'success' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500 border-4 border-emerald-500/20">
              <span className="material-symbols-outlined text-[48px]">check</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
            <p className="text-on-surface-variant mb-10 max-w-sm mx-auto">
              "Attention Is All You Need" has been successfully added to your library and fully synthesized by LitLens AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <Link 
                href="/dashboard" 
                className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                View Dashboard
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <button 
                onClick={handleReset}
                className="flex-1 bg-surface-variant text-on-surface px-6 py-3 rounded-xl font-semibold hover:bg-surface-bright transition-colors"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
