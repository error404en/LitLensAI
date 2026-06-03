import React from 'react';
import Link from 'next/link';

export function SideNavBar() {
  return (
    <aside className="bg-surface dark:bg-surface h-screen w-64 fixed left-0 top-0 border-r border-outline-variant dark:border-outline-variant flex-col p-6 z-40 hidden md:flex">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
          <span className="material-symbols-outlined text-[20px]">science</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary">LitLens AI</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Precision Literature Survey</p>
        </div>
      </div>

      {/* CTA */}
      <Link href="/dashboard/upload" className="w-full bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-DEFAULT mb-8 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
        <span className="material-symbols-outlined text-[18px]">upload_file</span>
        Upload Paper
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {/* Active Tab: Home */}
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-DEFAULT text-primary dark:text-primary font-bold bg-primary-container/10 dark:bg-primary-container/10 active:scale-95 duration-100">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-md text-label-md">Home</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-DEFAULT text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 dark:hover:bg-surface-variant/50 transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-md text-label-md">Search</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-DEFAULT text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 dark:hover:bg-surface-variant/50 transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">library_books</span>
          <span className="font-label-md text-label-md">My Library</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-DEFAULT text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 dark:hover:bg-surface-variant/50 transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">insights</span>
          <span className="font-label-md text-label-md">Research Gaps</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-DEFAULT text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 dark:hover:bg-surface-variant/50 transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-1 pt-4 border-t border-outline-variant">
        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 transition-colors">
          <span className="material-symbols-outlined text-[18px]">help</span>
          <span className="font-label-md text-label-md">Help</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </button>
      </div>
    </aside>
  );
}
