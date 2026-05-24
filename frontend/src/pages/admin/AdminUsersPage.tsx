import { useQuery } from "@tanstack/react-query";

import { adminApi } from "../../api/adminApi";
import { AdminTable } from "../../components/AdminTable";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";

export function AdminUsersPage() {
  const { data, error, isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.getAdminUsers });
  return (
    <>
      <PageHeader eyebrow="Admin" title="Users" description="User accounts, roles, and analysis usage counts." />
      {isLoading ? <LoadingState message="Loading users..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data?.length === 0 ? <EmptyState title="No users" message="Registered users will appear here." /> : null}
      {data?.length ? <AdminTable headers={["Name", "Email", "Role", "Joined", "Resumes", "Reports"]} rows={data.map((user) => [<span className="font-semibold text-ink">{user.name}</span>, user.email, user.role, new Date(user.created_at).toLocaleDateString(), user.total_resumes, user.total_reports])} /> : null}
    </>
  );
}
