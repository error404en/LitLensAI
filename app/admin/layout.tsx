import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface text-on-surface flex flex-col">
      <header className="border-b border-outline-variant p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">LitLens AI Admin Panel</h1>
      </header>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
