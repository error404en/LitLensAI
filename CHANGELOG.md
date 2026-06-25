# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-20
### Added
- Enterprise-grade AI Research platform out of beta.
- Complete Production Rollout with comprehensive observability via `StructuredLogger`.
- Zod-based Environment Variable validation at boot.
- `/api/health` load-balancer endpoint.
- Global Error Boundaries for graceful UI failure recovery.

### Changed
- Refactored `ProjectsRepository` and `PapersRepository` payload payloads for `O(1)` frontend latency.
- Migrated Dashboard from primitive `useEffect` tracking to native `useQuery` via Tanstack Query.

## [0.9.0] - 2026-06-18
### Added
- Background AI execution Parallelization for Embeddings and Metadata extraction.
- Caching layer (`PromptCache`, `RetrievalCache`) for massive token cost reduction and latency improvements.

## [0.8.0] - 2026-06-15
### Added
- Feature validation: Complete Project Flows, Library Flows, Upload Flows, and AI features.

## [0.7.0] - 2026-06-10
### Added
- RAG Vector Database integration via Qdrant.
- Semantic Retriever logic for context assembly.

## [0.1.0] - 2026-05-01
### Added
- Initial project scaffold and Clean Architecture implementation.
