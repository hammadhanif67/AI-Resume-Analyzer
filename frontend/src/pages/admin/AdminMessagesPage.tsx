import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { adminApi } from "../../api/adminApi";
import { AdminTable } from "../../components/AdminTable";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { PageHeader } from "../../components/PageHeader";

export function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<{ name: string; subject: string; message: string } | null>(null);
  const { data, error, isLoading } = useQuery({ queryKey: ["admin-contact-messages"], queryFn: adminApi.getContactMessages });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => adminApi.updateContactMessageStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
    },
  });

  return (
    <>
      <PageHeader eyebrow="Admin" title="Contact Messages" description="Messages submitted from the public contact page." />
      {isLoading ? <LoadingState message="Loading contact messages..." /> : null}
      {error ? <ErrorState message={error.message} /> : null}
      {data?.length === 0 ? <EmptyState title="No messages" message="Contact form submissions will appear here." /> : null}
      {data?.length ? (
        <AdminTable
          headers={["Name", "Email", "Subject", "Message", "Status", "Created"]}
          rows={data.map((message) => [
            <div className="min-w-0">
              <span className="font-semibold text-ink">{message.name}</span>
              {message.status === "new" ? <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">new</span> : null}
            </div>,
            message.email,
            message.subject,
            <div className="min-w-0">
              <p className="text-sm text-slate-700">{truncateMessage(message.message)}</p>
              <button className="app-action-link mt-1 justify-start text-xs" onClick={() => setSelectedMessage({ name: message.name, subject: message.subject, message: message.message })} type="button">
                View full message
              </button>
            </div>,
            <div className="flex flex-wrap gap-2">
              {["new", "read", "resolved"].map((status) => (
                <button
                  className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 transition ${message.status === status ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:bg-brand-50 hover:text-ink"}`}
                  disabled={statusMutation.isPending}
                  key={status}
                  onClick={() => statusMutation.mutate({ id: message.id, status })}
                  type="button"
                >
                  {status}
                </button>
              ))}
            </div>,
            new Date(message.created_at).toLocaleDateString(),
          ])}
        />
      ) : null}
      {selectedMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="card max-h-[85vh] w-full max-w-xl overflow-auto p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-brand-700">Message Detail</p>
                <h3 className="mt-1 truncate text-lg font-bold text-ink">{selectedMessage.subject}</h3>
                <p className="mt-1 text-sm text-muted">From: {selectedMessage.name}</p>
              </div>
              <button className="app-action-secondary" onClick={() => setSelectedMessage(null)} type="button">
                Close
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{selectedMessage.message}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function truncateMessage(value: string, maxLength = 120) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength).trimEnd()}...`;
}
