# Project Context: LitLens AI

## Overview
LitLens AI is an AI-powered literature survey assistant. It is a student MVP project optimized for learning and demonstrating modern software engineering practices. 

## Technology Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (Relational) + ChromaDB (Vector)
- **Authentication**: Clerk
- **AI**: OpenAI API

## Project Structure
- `/frontend`: Next.js application.
- `/backend` *(to be created)*: FastAPI application.
- `/docs` *(to be organized)*: Project documentation (PRD, TRD, Schema, etc.).

## Current State
- The documentation has been generated and aligned with the target stack.
- The Next.js frontend has been minimally initialized.
- The FastAPI backend, PostgreSQL schema, ChromaDB, and Clerk integration are pending implementation.

## Developer Guidelines
- **Simplicity**: Avoid unnecessary complexity. Keep solutions realistic for an MVP.
- **Modularity**: Maintain a clean separation between the frontend UI and the backend AI/processing logic.
- **Security**: Rely on Clerk for auth; do not roll custom authentication logic. Protect FastAPI routes using Clerk's JWT validation.
