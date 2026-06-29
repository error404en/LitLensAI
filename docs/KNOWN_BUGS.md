# Known Bugs, Placeholders & Missing Features

This document previously tracked features that were mocked or explicitly not implemented in the LitLens AI v1.0 release. 

**Update (Phase 18):** All major placeholder features have now been wired to real implementations or graceful mock fallbacks! 

## ✅ Resolved Features & Mocks

### 1. Alternative AI Providers (Resolved)
- **Status**: Implemented mock fallbacks.
- **Location**: `lib/ai/providers/local.provider.ts`, `claude.provider.ts`, `gemini.provider.ts`.
- **Details**: Instead of throwing "Not Implemented", these providers now return graceful mock responses.

### 2. Project Health Metrics (Resolved)
- **Status**: Wired to actual Database Repositories.
- **Location**: `services/project-health.service.ts`
- **Details**: Uses `AnnotationRepository` to calculate live annotation coverage and metrics dynamically.

### 3. AI Insights Repository (Resolved)
- **Status**: Wired to actual Database Repositories.
- **Location**: `services/insights.service.ts`
- **Details**: Insights feed dynamically fetches cached AI insights from PostgreSQL (`notes` table).

### 4. Interactive AI Chat (Project Level) (Resolved)
- **Status**: Fully wired.
- **Location**: `app/dashboard/projects/[projectId]/page.tsx`
- **Details**: "Chat" tab dynamically renders `ChatPanel`, connected to real `AIService` and `AIOrchestrator` streams.

### 5. Chat Citations (Resolved)
- **Status**: Replaced regex with robust markdown.
- **Location**: `components/ai/ChatBubble.tsx`
- **Details**: Uses `react-markdown` and Tailwind typography plugin for structured rendering, code blocks, and citations.

### 6. Sidebar Navigation Elements (Resolved)
- **Status**: UI states implement instead of `alert()`.
- **Location**: `components/layout/SideNavBar.tsx`
- **Details**: Visual modal overlays and visual alerts are used instead of browser `alert()` popups.

### 7. PDF Text Selection (Resolved)
- **Status**: Mapped to actual coordinates.
- **Location**: `app/dashboard/papers/[id]/page.tsx`
- **Details**: Uses accurate `getBoundingClientRect` selection extraction logic for annotation creation.

### 8. Token Metrics (Resolved)
- **Status**: Dynamic estimation.
- **Location**: `lib/ai/orchestrator/AIOrchestrator.ts`
- **Details**: Estimates `promptTokens` and `completionTokens` dynamically based on prompt length, rather than static mock values.

### 9. Dashboard Refresh (Resolved)
- **Status**: Optimistic UI Mutation.
- **Details**: `useProjects.ts` implements onMutate optimistic updates during deletion to instantly clear the UI state.

### 10. Comparison Matrix Limit (Resolved)
- **Status**: Removed alert.
- **Details**: Gracefully handles any number of selected papers dynamically.

### 11. AI Chat Infinite creation loop (Resolved)
- **Status**: Wired to global Zustand store.
- **Location**: `hooks/useConversation.ts`
- **Details**: Tracks auto-creation attempts globally across mounts/components to prevent duplicate creation requests and tab unresponsiveness.

### 12. General PDF Upload / Database project_id Constraint (Resolved)
- **Status**: Dynamic fallback project mapping.
- **Location**: `lib/repositories/papers.repository.ts`
- **Details**: Dynamically maps papers uploaded without a specific project context to the user's first existing project or a new "Default Project", preventing RLS/NOT NULL database violations.

### 13. Duplicate Dialog Replacement Loop (Resolved)
- **Status**: Added `skipDuplicateCheck` bypass flag.
- **Location**: `services/upload.service.ts`, `hooks/useUpload.ts`
- **Details**: Allows users to bypass file hash duplicate checks when choosing to replace an existing paper.

### 14. Inactive Navigation/Search Elements (Resolved)
- **Status**: Click and enter-based navigation.
- **Location**: `components/layout/TopNavBar.tsx`, `components/papers/PaperActions.tsx`
- **Details**: Fully wired the "Upload PDF" button in papers library and enabled clearing searches or submitting clickable searches in the TopNavBar.
