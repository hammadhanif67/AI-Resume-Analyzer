import type { ReportDetail } from "./report";

export interface AdminUserRef {
  id: number;
  name: string;
  email: string;
}

export interface AdminResume {
  id: number;
  user: AdminUserRef;
  file_name: string;
  file_type: string;
  file_size: number;
  processing_status: string;
  uploaded_at: string;
}

export interface AdminReport {
  id: number;
  report_id: number;
  user: AdminUserRef;
  resume_id: number;
  resume_name: string;
  overall_score: number;
  ats_score: number;
  job_match_score: number;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
  total_resumes: number;
  total_reports: number;
}

export interface AdminLog {
  id: number;
  user: AdminUserRef;
  action: string;
  status: string;
  message: string;
  created_at: string;
}

export interface AdminContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface AdminOverview {
  total_users: number;
  total_resumes: number;
  total_reports: number;
  latest_uploads: AdminResume[];
  latest_reports: AdminReport[];
  backend_status: string;
}

export interface AdminReportDetail extends ReportDetail {
  user: AdminUserRef | null;
}
