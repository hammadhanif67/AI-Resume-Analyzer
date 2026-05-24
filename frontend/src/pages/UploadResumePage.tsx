import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { resumeApi } from "../api/resumeApi";
import { Button } from "../components/Button";
import { ErrorState } from "../components/ErrorState";
import { PageHeader } from "../components/PageHeader";
import { SectionCard } from "../components/SectionCard";
import { UploadBox } from "../components/UploadBox";

const allowedTypes = [".pdf", ".docx"];

export function UploadResumePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const mutation = useMutation({
    mutationFn: resumeApi.upload,
    onSuccess: (resume) => {
      navigate(`/analysis/${resume.id}`);
    },
  });

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setValidationError("");
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  }

  function selectFile(selectedFile: File) {
    setValidationError("");
    setFile(selectedFile);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setValidationError("Select a PDF or DOCX resume first.");
      return;
    }
    const isAllowed = allowedTypes.some((type) => file.name.toLowerCase().endsWith(type));
    if (!isAllowed) {
      setValidationError("Only PDF and DOCX files are supported.");
      return;
    }
    mutation.mutate(file);
  }

  return (
    <>
      <PageHeader eyebrow="Resume intake" title="Upload Resume" description="A focused upload flow with validation, file preview, and direct handoff into AI analysis." />
      <form className="grid gap-4 lg:grid-cols-[1fr_340px]" onSubmit={handleSubmit}>
        {(validationError || mutation.error) ? (
          <div className="lg:col-span-2"><ErrorState message={validationError || mutation.error?.message || "Upload failed"} /></div>
        ) : null}
        <SectionCard title="Resume file" description="Drag and drop the file or browse from your device.">
          <UploadBox
            accept=".pdf,.docx"
            aria-label="Upload resume file"
            isDragging={isDragging}
            onChange={handleFileChange}
            onDragStateChange={setIsDragging}
            onDropFile={selectFile}
            selectedFile={file}
          />
          {file ? (
            <div className="mt-4 rounded-card border border-line bg-white p-3 text-sm text-muted shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="min-w-0 truncate"><span className="font-semibold text-ink">Selected:</span> {file.name}</p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          ) : null}
          {mutation.isSuccess ? <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-success-700">Upload completed. Opening analysis...</p> : null}
          {mutation.isPending ? <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-brand-600" /></div> : null}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button disabled={mutation.isPending} type="submit">{mutation.isPending ? "Uploading..." : "Upload and Analyze"}</Button>
            <p className="text-sm text-muted">Supported formats: PDF, DOCX.</p>
          </div>
        </SectionCard>
        <aside className="glass-panel h-fit p-5 sm:p-6">
          <h2 className="text-lg font-bold text-ink">What happens next</h2>
          <div className="mt-4 space-y-3.5">
            {["Text extraction", "ATS scoring", "Skill detection", "Report creation"].map((step, index) => (
              <div className="flex items-start gap-3" key={step}>
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{index + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{step}</p>
                  <p className="text-xs leading-5 text-muted">Handled by the existing analysis pipeline.</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </form>
    </>
  );
}
