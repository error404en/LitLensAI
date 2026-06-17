import React from "react";

interface HubLayoutProps {
  header: React.ReactNode;
  leftSidebar: React.ReactNode;
  center: React.ReactNode;
  rightSidebar: React.ReactNode;
  bottom: React.ReactNode;
}

export function HubLayout({ header, leftSidebar, center, rightSidebar, bottom }: HubLayoutProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex-none border-b shrink-0 bg-surface/50 backdrop-blur-sm z-10">
        {header}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 flex-none border-r bg-surface/30 overflow-y-auto hidden md:block">
          {leftSidebar}
        </aside>

        {/* Center */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {center}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 flex-none border-l bg-surface/30 overflow-y-auto hidden lg:block">
          {rightSidebar}
        </aside>
      </div>

      {/* Bottom Bar */}
      <div className="flex-none border-t bg-surface shrink-0">
        {bottom}
      </div>
    </div>
  );
}
