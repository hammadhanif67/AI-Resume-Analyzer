import { useQuery } from "@tanstack/react-query";

import { adminApi } from "../../api/adminApi";
import { AdminTable } from "../../components/AdminTable";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";

export function AdminLogsPage() {
  const { data, error, isLoading } = useQuery({ queryKey: ["admin-logs"], queryFn: adminApi.getAdminLogs });
  return (
    <>
      <PageHeader eyebrow="Admin" title="Activity Logs" description="Recent user and system activity in a monitoring-friendly view." />
      {isLoading ? <LoadingState message="Loading logs..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data?.length === 0 ? <EmptyState title="No logs" message="Activity logs will appear here." /> : null}
      {data?.length ? <AdminTable headers={["User", "Action", "Status", "Message", "Created"]} rows={data.map((log) => [log.user.email, <span className="font-semibold text-ink">{log.action}</span>, log.status, log.message, new Date(log.created_at).toLocaleDateString()])} /> : null}
    </>
  );
}
