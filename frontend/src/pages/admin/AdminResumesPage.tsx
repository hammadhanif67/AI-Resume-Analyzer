import { useQuery } from "@tanstack/react-query";

import { adminApi } from "../../api/adminApi";
import { AdminTable } from "../../components/AdminTable";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";

export function AdminResumesPage() {
  const { data, error, isLoading } = useQuery({ queryKey: ["admin-resumes"], queryFn: adminApi.getAdminResumes });
  return (
    <>
      <PageHeader eyebrow="Admin" title="Resumes" description="Uploaded resume processing status and file metadata." />
      {isLoading ? <LoadingState message="Loading resumes..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data?.length === 0 ? <EmptyState title="No resumes" message="Uploaded resumes will appear here." /> : null}
      {data?.length ? <AdminTable headers={["User", "File", "Type", "Size", "Status", "Uploaded"]} rows={data.map((resume) => [resume.user.email, <span className="font-semibold text-ink">{resume.file_name}</span>, resume.file_type, resume.file_size, resume.processing_status, new Date(resume.uploaded_at).toLocaleDateString()])} /> : null}
    </>
  );
}
