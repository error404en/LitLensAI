# Application Flow

## 1. Onboarding & Authentication
1. **Landing Page**: User arrives at the homepage.
2. **Authentication**: User signs up / logs in via Clerk (OAuth/Email).
3. **Dashboard**: Post-login, user is redirected to their project dashboard.

## 2. Project Management
1. **Create Project**: User creates a new research workspace/project.
2. **Upload Papers**: User uploads PDF research papers to the project.
   - Frontend sends the PDF to the FastAPI backend.
   - Backend processes the PDF (extracts text, chunks it, generates embeddings, saves to ChromaDB).

## 3. Paper Analysis
1. **View Paper**: User selects an uploaded paper.
2. **Auto-Summary**: System displays the auto-generated summary.
3. **Extraction**: System displays extracted methodology, datasets, and findings.

## 4. Synthesis & Comparison
1. **Select Papers**: User selects multiple papers within a project.
2. **Compare**: User initiates a comparison. Backend queries ChromaDB and uses OpenAI to generate a comparison matrix.
3. **Find Gaps**: User asks the system to identify research gaps based on the selected papers.

## 5. Review Generation
1. **Generate Draft**: User prompts the system to write a literature review draft.
2. **Export**: User exports the drafted review with generated citations.
