# Project Context: LitLens AI

## Overview
LitLens AI is an AI-powered literature survey assistant. It is a student MVP project optimized for learning and demonstrating modern software engineering practices. 

## Technology Stack
- **Frontend/Backend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL (Supabase) + Qdrant (Vector DB)
- **Authentication**: Clerk
- **AI**: OpenAI API (orchestrated via LangChain)
- **Background Jobs**: Inngest

## Project Structure
- `/app`: Next.js frontend pages and backend API routes.
- `/components`: UI and feature components.
- `/lib`: Utility functions, database configuration, and AI orchestration.
- `/docs`: Project documentation.

## Current State
- The documentation is fully aligned with the unified Next.js + Supabase + Qdrant stack.
- The Next.js frontend layout, dashboard structure, and Clerk authentication are fully integrated.
- MVP UI routes for projects, literature reviews, and comparisons are implemented with mock data.
- The Supabase client and schema types are set up.
- The backend PDF processing pipeline (Inngest) and semantic search (Qdrant) are pending implementation.

## Developer Guidelines
- **Simplicity**: Avoid unnecessary complexity. Keep solutions realistic for an MVP.
- **Modularity**: Maintain a clean separation between the frontend UI and backend AI/processing logic (e.g., encapsulating logic in `lib/ai`).
- **Security**: Rely on Clerk for authentication. Protect API routes using Clerk middleware. Enforce Supabase Row Level Security (RLS) for data integrity.
