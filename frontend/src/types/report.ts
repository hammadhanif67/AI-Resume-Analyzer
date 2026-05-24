import type { MissingSkillItem, ScoreBreakdownItem, SkillItem } from "./analysis";

export interface ReportResumeInfo {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  processing_status: string;
  uploaded_at: string;
}

export interface ReportSummary {
  id: number;
  report_id: number;
  resume_id: number;
  resume_file_name: string | null;
  overall_score: number;
  ats_score: number;
  job_match_score: number;
  created_at: string;
}

export interface ReportDetail extends ReportSummary {
  user_id: number;
  grammar_score: number;
  readability_score: number;
  score_breakdown: Record<string, ScoreBreakdownItem>;
  resume: ReportResumeInfo | null;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skills_found: SkillItem[];
  missing_skills: MissingSkillItem[];
  enhanced_analysis?: Record<string, unknown>;
}
