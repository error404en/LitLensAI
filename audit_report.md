
# LITLENS AI AUDIT REPORT

## 1. Pages & Imported Components
- Route: app\(auth)\sign-in\[[...sign-in]]\page.tsx
  Imports: SignIn
- Route: app\(auth)\sign-up\[[...sign-up]]\page.tsx
  Imports: SignUp
- Route: app\dashboard\page.tsx
  Imports: HeroCommand, LatestSynthesis, QuickActionUpload, RecentLibrary
- Route: app\dashboard\papers\page.tsx
  Imports: usePapers, PaperGrid, PaperList, PaperToolbar, PaperSkeleton, PaperEmptyState, PaperPagination, DeletePaperDialog, ErrorState, Paper
- Route: app\dashboard\papers\[id]\page.tsx
  Imports: useParams, usePDF, usePDFAnnotations, usePapers, PDFToolbar, PDFSidebar, PDFRightSidebar, PDFViewer, PDFStatusBar, PDFLoading, PDFError, PDFSelectionMenu, PDFSidebarTab, RightSidebarTab, Button, ChevronLeft, Link, cn
- Route: app\dashboard\projects\new\page.tsx
  Imports: useRouter, useProjects, Button, Input, Textarea, ArrowLeft
- Route: app\dashboard\projects\page.tsx
  Imports: useRouter, useProjects, ProjectGrid, ProjectList, ProjectToolbar, ProjectSkeleton, ProjectEmptyState, CreateProjectDialog, ConfirmDialog, ErrorState
- Route: app\dashboard\projects\[id]\intelligence\page.tsx
  Imports: ResearchWorkspace
- Route: app\dashboard\projects\[projectId]\compare\page.tsx
  Imports: None
- Route: app\dashboard\projects\[projectId]\page.tsx
  Imports: useProject, ProjectHeader, ProjectOverview, ProjectTabs, ProjectSidebar, ProjectPaperList, ErrorState, Loading, ProjectNotesEditor
- Route: app\dashboard\projects\[projectId]\review\page.tsx
  Imports: None
- Route: app\dashboard\upload\page.tsx
  Imports: useUpload, useUploadQueue, UploadDropzone, UploadToolbar, UploadQueue, UploadSummary, UploadSuccess, UploadError, UploadEmpty, DuplicateDialog
- Route: app\page.tsx
  Imports: React, Link
- Route: app\test\page.tsx
  Imports: None

## 2. Unused Components (Not Rendered)
AIEmptyState, SourceReference, InsightCard, OverviewCards, QuickActions, RealtimeStatus, RecentPapers, SavedViews, PDFEmpty, PDFNavigation, PDFZoom, RenameProjectDialog, global-realtime

## 3. Pages Returning Placeholders
None

## 4. Unreachable Routes
(Requires manual verification, assuming all pages are routable in App Router)

## 5. Unused Services
AiOperationsService, AiPipelineService, AiService, HealthCheckService, PdfService

## 6. Unused Repositories
Ai-executionRepository, AiRepository, PdfRepository, PromptRepository

## 7. Unused Hooks
useProjectIntelligence, useProjectStats, useResearchFeed
