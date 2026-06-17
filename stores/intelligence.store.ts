import { create } from "zustand";

export type IntelligenceView = "recent" | "favorites" | "unread" | "annotated" | "ai_ready" | "archived";
export type LayoutState = "sidebar_open" | "sidebar_closed";

export interface IntelligenceState {
  selectedProject: string | null;
  filters: {
    status: readonly string[];
    tags: readonly string[];
  };
  savedView: IntelligenceView;
  selectedInsight: string | null;
  expandedCards: readonly string[];
  searchQuery: string;
  layout: LayoutState;
  
  // Actions
  setSelectedProject: (id: string | null) => void;
  setFilters: (filters: { status: readonly string[]; tags: readonly string[] }) => void;
  setSavedView: (view: IntelligenceView) => void;
  setSelectedInsight: (id: string | null) => void;
  toggleCardExpansion: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setLayout: (layout: LayoutState) => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set) => ({
  selectedProject: null,
  filters: { status: [], tags: [] },
  savedView: "recent",
  selectedInsight: null,
  expandedCards: [],
  searchQuery: "",
  layout: "sidebar_open",

  setSelectedProject: (id) => set({ selectedProject: id }),
  setFilters: (filters) => set({ filters }),
  setSavedView: (view) => set({ savedView: view }),
  setSelectedInsight: (id) => set({ selectedInsight: id }),
  toggleCardExpansion: (id) =>
    set((state) => ({
      expandedCards: state.expandedCards.includes(id)
        ? state.expandedCards.filter((c) => c !== id)
        : [...state.expandedCards, id],
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLayout: (layout) => set({ layout }),
}));
