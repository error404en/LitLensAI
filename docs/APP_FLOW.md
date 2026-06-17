# Application Flow

## 1. Onboarding & Authentication
1. **Landing Page**: User arrives at the homepage.
2. **Authentication**: User signs up / logs in via Clerk (OAuth/Email).
3. **Dashboard**: Post-login, user is redirected to their project dashboard.

## 2. Project Management & Uploads
1. **Create Project**: User creates a new research workspace/project in Supabase.
2. **Upload Papers**: User uploads PDF research papers to the project.
   - Frontend validates the upload (via Arcjet) and uploads the PDF directly to Supabase Storage.
   - A database record is created in PostgreSQL (Supabase) marking the paper as pending.
   - An Inngest background event is triggered to process the document asynchronously.
   - The background worker (via LangChain) extracts text, chunks it, generates OpenAI embeddings, and saves the vectors to Qdrant.
   - A structured summary (abstract, methodology, findings) is generated and saved to PostgreSQL.

## 3. Research Intelligence Hub (The Central Workspace)
1. **Dashboard Overview**: User enters the project's Intelligence Hub.
2. **Real-time Stats**: The UI aggregates project health (papers processed, knowledge coverage) and chronological timeline activities using local state caching via Zustand.
3. **Dynamic AI Insights**: User clicks to expand Insight Cards (e.g., "Research Trends"). The frontend requests the `AIOrchestrator` to generate specific insights via streaming.

## 4. Synthesis & Comparison
1. **Select Papers**: User selects multiple papers within a project.
2. **Compare**: User initiates a comparison. The system retrieves paper summaries from PostgreSQL and utilizes the orchestration layer to generate a structured comparison matrix.
3. **Find Gaps**: User asks the system to identify research gaps. The system analyzes the limitations and future work sections from selected papers to synthesize a comprehensive gap analysis report.

## 5. Literature Review Generation
1. **Generate Draft**: User prompts the system to write a literature review draft based on a topic and selected papers (RAG pipeline leveraging Qdrant vector search).
2. **Export**: User exports the drafted review with generated inline citations linking back to the specific uploaded source papers.
