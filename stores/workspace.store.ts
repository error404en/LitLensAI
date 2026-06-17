import { create } from "zustand";

export type WorkspaceView = "overview" | "timeline" | "papers" | "insights" | "conversations" | "collections";

interface WorkspaceState {
  selectedView: WorkspaceView;
  searchQuery: string;
  selectedTimelineEventId: string | null;
  pinnedInsights: string[]; // IDs of pinned insights
  savedCollections: string[]; // IDs of saved papers/searches
  isActionCenterExpanded: boolean;
  
  // Actions
  setSelectedView: (view: WorkspaceView) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTimelineEvent: (id: string | null) => void;
  togglePinnedInsight: (id: string) => void;
  toggleSavedCollection: (id: string) => void;
  setActionCenterExpanded: (expanded: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedView: "overview",
  searchQuery: "",
  selectedTimelineEventId: null,
  pinnedInsights: [],
  savedCollections: [],
  isActionCenterExpanded: false,
  
  setSelectedView: (view) => set({ selectedView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTimelineEvent: (id) => set({ selectedTimelineEventId: id }),
  togglePinnedInsight: (id) => set((state) => ({
    pinnedInsights: state.pinnedInsights.includes(id)
      ? state.pinnedInsights.filter(i => i !== id)
      : [...state.pinnedInsights, id]
  })),
  toggleSavedCollection: (id) => set((state) => ({
    savedCollections: state.savedCollections.includes(id)
      ? state.savedCollections.filter(c => c !== id)
      : [...state.savedCollections, id]
  })),
  setActionCenterExpanded: (expanded) => set({ isActionCenterExpanded: expanded })
}));
