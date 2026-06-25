# Performance Optimization Guidelines

LitLens AI is built to handle heavy literature processing while maintaining a zero-latency feel for the end user. This document outlines the strategies implemented to achieve high performance.

## 1. Frontend Optimizations

### React 19 Concurrent Features
We utilize React 19's concurrent rendering features, specifically `useTransition`, to keep the UI responsive while heavy rendering tasks (like rendering the PDF canvas) happen in the background.

### Zustand State Management
By moving complex application state out of React Context and into Zustand stores, we eliminate unnecessary re-renders. Component subscriptions are localized strictly to the slices of state they need.

### Optimistic UI Mutations
All data mutations (creating projects, deleting papers) via TanStack React Query or Zustand are optimistic. The UI updates instantly, and the backend synchronizes silently.

## 2. AI Orchestration & Backend

### Background Offloading (Inngest)
PDF text extraction and Vector Embedding are CPU/Memory intensive. Rather than blocking the main thread or Vercel Serverless Function bounds, these tasks are offloaded to Inngest background workers.

### Hybrid Caching Architecture
The `AIOrchestrator` implements a dual-cache strategy:
1. **PromptCache**: Deduplicates identical user queries, avoiding redundant LLM generation cycles.
2. **RetrievalCache**: Temporarily stores Qdrant vector search results for frequent queries within a session to reduce database egress.

## 3. Database Performance

### Postgres Indexing
All Supabase queries utilize appropriate foreign key constraints and `created_at` indexes to ensure `O(log N)` search times on large projects.

### Vector Search Thresholds
Qdrant similarity search is configured with specific `score_threshold` limits to prevent the system from parsing completely irrelevant chunks, accelerating the LLM context-building phase.
