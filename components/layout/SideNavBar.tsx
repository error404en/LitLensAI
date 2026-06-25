"use client";

import React from 'react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';

export function SideNavBar() {
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const getLinkClass = (path: string, exact = false) => {
    const isActive = exact ? pathname === path : pathname?.startsWith(path);
    return `flex items-center gap-3 px-3 py-2.5 rounded-DEFAULT active:scale-95 duration-100 transition-colors ${
      isActive 
        ? "text-primary dark:text-primary font-bold bg-primary-container/10 dark:bg-primary-container/10" 
        : "text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 dark:hover:bg-surface-variant/50"
    }`;
  };

  const isLinkActive = (path: string, exact = false) => {
    return exact ? pathname === path : pathname?.startsWith(path);
  };

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
        <Link href="/dashboard" className={getLinkClass("/dashboard", true)}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isLinkActive("/dashboard", true) ? "'FILL' 1" : undefined }}>home</span>
          <span className="font-label-md text-label-md">Dashboard</span>
        </Link>
        <Link href="/dashboard/projects" className={getLinkClass("/dashboard/projects")}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isLinkActive("/dashboard/projects") ? "'FILL' 1" : undefined }}>library_books</span>
          <span className="font-label-md text-label-md">My Projects</span>
        </Link>
        <Link href="/dashboard/papers" className={getLinkClass("/dashboard/papers")}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isLinkActive("/dashboard/papers") ? "'FILL' 1" : undefined }}>article</span>
          <span className="font-label-md text-label-md">All Papers</span>
        </Link>
        <Link href="/dashboard/gaps" className={getLinkClass("/dashboard/gaps")}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isLinkActive("/dashboard/gaps") ? "'FILL' 1" : undefined }}>insights</span>
          <span className="font-label-md text-label-md">Research Gaps</span>
        </Link>
        <Link href="/dashboard/settings" className={getLinkClass("/dashboard/settings")}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isLinkActive("/dashboard/settings") ? "'FILL' 1" : undefined }}>settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-1 pt-4 border-t border-outline-variant">
        <Link href="/dashboard/help" className="flex items-center justify-between px-3 py-2 rounded-DEFAULT text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 dark:hover:bg-surface-variant/50 transition-colors active:scale-95 duration-100">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span className="font-label-md text-label-md">Help</span>
          </div>
        </Link>
        <button 
          onClick={() => signOut(() => router.push("/"))}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant/50 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-label-md text-label-md">Logout</span>
        </button>
      </div>
    </aside>
  );
}
