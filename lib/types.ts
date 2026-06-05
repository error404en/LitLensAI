export type ProcessingStatus = 
  | 'queued'
  | 'processing'
  | 'embedding'
  | 'summarizing'
  | 'completed'
  | 'failed';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Paper {
  id: string;
  project_id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  status: ProcessingStatus;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaperSummary {
  id: string;
  paper_id: string;
  abstract_summary?: string;
  methodology?: string;
  datasets_used?: string[];
  key_findings?: string[];
  limitations?: string[];
  future_work?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProcessingJob {
  id: string;
  paper_id: string;
  project_id: string;
  user_id: string;
  status: ProcessingStatus;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ComparisonMatrixItem {
  paper_id: string;
  title: string;
  methodology_summary: string;
  key_findings_summary: string;
  limitations_summary: string;
}

export interface ComparisonResult {
  id: string;
  project_id: string;
  user_id: string;
  paper_ids: string[];
  matrix: ComparisonMatrixItem[];
  overall_synthesis: string;
  created_at: string;
}

export interface GapAnalysis {
  id: string;
  project_id: string;
  user_id: string;
  analyzed_paper_ids: string[];
  identified_gaps: string[];
  future_research_directions: string[];
  synthesis_summary: string;
  created_at: string;
}

export interface LiteratureReviewSection {
  title: string;
  content: string;
  citations: string[]; // references to paper IDs
}

export interface LiteratureReview {
  id: string;
  project_id: string;
  user_id: string;
  topic: string;
  included_paper_ids: string[];
  sections: LiteratureReviewSection[];
  conclusion: string;
  created_at: string;
  updated_at: string;
}
