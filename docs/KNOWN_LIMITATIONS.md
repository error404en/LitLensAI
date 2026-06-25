# Known Limitations

While LitLens AI v1.0 is engineered for enterprise-grade performance, there are several hard constraints and architectural limitations you should be aware of.

## 1. AI Context Window Restrictions

LitLens AI utilizes LLMs (e.g., `GPT-4o`) for semantic synthesis and literature reviews. Every LLM has a strict maximum context window (token limit).
- **Issue**: Attempting to generate a "Cross-Paper Synthesis" on a project containing 50+ extensive papers may exceed the LLM's token capacity, even after intelligent chunking and RAG filtering.
- **Workaround**: The `AIOrchestrator` limits retrieval to the top `K` most relevant chunks per query. If a paper is not semantically relevant to the explicit query, it may be omitted from the context. 

## 2. PDF Parsing Reliability

LitLens AI uses `pdf-parse` for text extraction. 
- **Scanned Documents**: PDFs that are entirely image-based (e.g., scanned historical documents) without a pre-existing OCR (Optical Character Recognition) text layer cannot be parsed. The text extraction will return empty.
- **Complex Formatting**: Multi-column layouts or complex mathematical formulas may be parsed in an unintended order, slightly impacting the quality of the LangChain embeddings.

## 3. Alternative AI Providers

The system is architected to support multiple providers (OpenAI, Claude, Gemini, Local Ollama).
- **Status**: The abstract `AIProvider` interface is fully defined, but only `OpenAIProvider` is completely integrated for production. The other providers (`claude.provider.ts`, `gemini.provider.ts`, `local.provider.ts`) currently operate in a graceful "mock fallback" mode. Full API integration for alternative models is planned for v2.0.

## 4. Local Webhook Testing

Because PDF processing relies on Inngest background workers via webhooks, local development testing of file uploads requires the Inngest local dev server to be running (`npx inngest-cli@latest dev`). Without it, uploads will be saved to Supabase, but the vector chunking and summarization will not execute.
