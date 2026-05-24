import { Link } from "react-router-dom";

import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";

export function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-panel p-6">
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Access Denied" description="You do not have permission to open the admin area." />
        <SectionCard title="Admin role required">
          <Link className="app-action-secondary" to="/dashboard">Return to dashboard</Link>
        </SectionCard>
      </div>
    </main>
  );
}
