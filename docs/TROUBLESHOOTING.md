# Troubleshooting & Known Limitations

## Common Issues

### 1. UI Hangs on "Uploading..."
- **Symptom:** The paper uploads successfully, but the AI status remains stuck on "processing" indefinitely.
- **Root Cause:** The Inngest background webhook failed to execute.
- **Resolution:** 
  - Locally: Ensure the Inngest dev server is running (`npx inngest-cli@latest dev`).
  - Production: Check the Vercel logs for `/api/inngest` and the Inngest dashboard. Ensure `INNGEST_SIGNING_KEY` is correctly configured.

### 2. "Missing Environment Variables" Crash
- **Symptom:** Server immediately throws a 500 error or crashes on boot with `[ZodError]`.
- **Root Cause:** A required API key was not supplied to `lib/env.ts`.
- **Resolution:** Compare your `.env.local` against `.env.example`. Ensure `SUPABASE_SERVICE_ROLE_KEY` is present.

### 3. AI Comparisons Returning Empty Results
- **Symptom:** Generating a comparison matrix succeeds, but the AI says "I cannot find any information."
- **Root Cause:** Qdrant Cloud cluster memory exhausted, or the semantic retriever threshold was too strict.
- **Resolution:** Verify Qdrant Cloud dashboard limits.

### 4. Hydration Mismatch Warnings in Console
- **Symptom:** Console warns: `A tree hydrated but some attributes of the server rendered HTML didn't match`.
- **Root Cause:** A browser extension (like Dashlane or 1Password) is injecting `fdprocessedid` into `<button>` or `<input>` tags before React hydrates.
- **Resolution:** This is completely harmless and does not affect production users. Disable the extension in development if it's annoying.

## Known Limitations

1. **Token Limits**: Currently, we use `GPT-4o` with a large context window. However, generating a synthesis for 50+ papers simultaneously may exceed token limits. The system will gracefully catch this, but it cannot automatically scale beyond the model's max tokens.
2. **PDF Parsing Constraints**: Image-heavy or scanned PDFs without OCR layers will return empty text during `pdf-parse`. The AI will note that it cannot summarize image data.
3. **Local Testing of Webhooks**: Inngest webhooks cannot be natively tested without the local `inngest dev` proxy routing requests to `localhost:3000`.

## 🛠️ Resolved Issues (Phase 18)

During Phase 18 Enterprise Polish and subsequent bug-fixing rounds, all major placeholders, mocked logic, and blocking pipeline issues were resolved:
- Alternative AI providers (`claude`, `gemini`, `local`) now use graceful fallback modes instead of throwing 500 errors.
- Project Health metrics and Insights now dynamically aggregate from the `AnnotationRepository` and `InsightsRepository`.
- The interactive AI Chat tab within projects has been fully wired to the orchestrator via `ChatPanel` and `useChat`.
- Chat responses and citations are now securely rendered with `react-markdown` instead of fragile Regex parsing.
- PDF Text Selection logic accurately maps bounding rects to real coordinates for highlights.
- AI token telemetry now performs dynamic character-based length estimations instead of using static mocks.
- `alert()` popups in navigation and paper comparison views have been replaced with proper UI states.
- Resolved an infinite render loop in `useConversation` by storing auto-creation flags globally in the Zustand store to prevent concurrent component mounts from launching redundant Server Actions.
- Resolved a PDF Upload failure on general pages by implementing a fallback that maps papers to the user's first existing project or a new "Default Project" if no project context is specified, avoiding `NOT NULL` database constraints.
- Resolved a duplicate check loop in `resolveDuplicate` by introducing a `skipDuplicateCheck` parameter that allows duplicate replacement.
- Fixed non-responsive topbar searches and the static "Upload PDF" button in papers library.
