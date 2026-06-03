import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary/30">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">LitLens AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#why-us" className="hover:text-white transition-colors">Why us</a>
          </nav>
          <Link 
            href="/dashboard"
            className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors shadow-sm"
          >
            Launch App
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              LitLens AI 1.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Precision Literature Survey <br className="hidden md:block" /> at the Speed of AI.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload papers, extract methodologies, compare findings, and synthesize literature reviews instantly. The ultimate research assistant built for modern academics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard"
                className="bg-white text-black px-8 py-3.5 rounded-full font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <a 
                href="#how-it-works"
                className="bg-white/5 text-white border border-white/10 px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-t border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to master the literature.</h2>
              <p className="text-zinc-400 text-lg">Powerful AI tools designed specifically for rigorous academic research.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: 'summarize', title: 'Instant Synthesis', desc: 'Automatically extract key findings, methodologies, and limitations from any PDF.' },
                { icon: 'compare_arrows', title: 'Matrix Comparison', desc: 'Select multiple papers and generate side-by-side comparison tables instantly.' },
                { icon: 'insights', title: 'Research Gap Finder', desc: 'Let AI analyze your library to highlight conflicting results and unexplored areas.' },
              ].map((f, i) => (
                <div key={i} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:bg-white/5 transition-all hover:border-white/20">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[24px]">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 border-t border-white/5 relative overflow-hidden">
          <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-tertiary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">From raw PDFs to polished reviews in minutes.</h2>
                <div className="space-y-10">
                  {[
                    { step: '01', title: 'Upload your library', desc: 'Drag and drop your research PDFs into a secure project workspace.' },
                    { step: '02', title: 'Extract & Analyze', desc: 'Our AI processes every page, generating accurate summaries and extracting core datasets.' },
                    { step: '03', title: 'Draft your review', desc: 'Export beautifully formatted literature reviews complete with inline citations.' },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="text-sm font-bold text-primary bg-primary/10 w-10 h-10 flex items-center justify-center rounded-full shrink-0">{s.step}</div>
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{s.title}</h4>
                        <p className="text-zinc-400 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mt-10 md:mt-0">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                  {/* Abstract mock UI representation */}
                  <div className="w-3/4 h-3/4 bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl p-8 flex flex-col gap-6">
                    <div className="w-full h-8 bg-white/5 rounded-md" />
                    <div className="w-3/4 h-4 bg-white/5 rounded-md" />
                    <div className="w-5/6 h-4 bg-white/5 rounded-md" />
                    <div className="w-full flex-1 bg-primary/5 rounded-lg border border-primary/20 mt-4 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-5xl animate-pulse">auto_awesome</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Researchers Use It */}
        <section id="why-us" className="py-24 border-t border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16">Built for academic rigor.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { metric: '10x', label: 'Faster synthesis' },
                { metric: '0', label: 'Hallucinated citations' },
                { metric: '100%', label: 'Source traceability' },
                { metric: 'Infinite', label: 'Research scale' },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-3">{stat.metric}</div>
                  <div className="text-zinc-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/10 pointer-events-none" />
          <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Ready to accelerate your research?</h2>
            <p className="text-xl text-zinc-400 mb-10">Join thousands of students and researchers using LitLens AI to master their literature surveys.</p>
            <Link 
              href="/dashboard"
              className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-xl hover:shadow-2xl"
            >
              Start analyzing for free
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">science</span>
            <span className="font-semibold text-zinc-300">LitLens AI</span>
          </div>
          <p>© 2026 LitLens AI. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
