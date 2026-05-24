export interface SkillItem {
  skill_name: string;
  skill_category: string;
  confidence_score: number;
}

export interface MissingSkillItem {
  skill_name: string;
  priority: string;
  reason: string;
}

export interface ScoreBreakdownItem {
  points: number;
  max_points: number;
  reason: string;
}

export interface AnalysisResult {
  report_id: number;
  overall_score: number;
  ats_score: number;
  job_match_score: number;
  grammar_score: number;
  readability_score: number;
  score_breakdown: Record<string, ScoreBreakdownItem>;
  skills_found: SkillItem[];
  missing_skills: MissingSkillItem[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  suggestion_groups?: Record<string, string[]>;
  readability_analysis?: {
    readability_score: number;
    readability_issues: string[];
    readability_suggestions: string[];
  };
  enhanced_analysis?: Record<string, unknown>;
}

export interface JobMatchRequest {
  resume_id: number;
  job_title: string;
  job_description: string;
}

export interface JobMatchResult {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  missing_skill_priorities?: Array<{ skill_name: string; priority: string; reason: string }>;
  matched_keywords: string[];
  missing_keywords: string[];
  matched_phrases?: string[];
  suggestions: string[];
}
