import type { DragEvent, InputHTMLAttributes } from "react";

import { cn } from "../utils/classNames";

interface UploadBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  selectedFile: File | null;
  isDragging: boolean;
  onDropFile: (file: File) => void;
  onDragStateChange: (dragging: boolean) => void;
}

export function UploadBox({ selectedFile, isDragging, onDropFile, onDragStateChange, ...inputProps }: UploadBoxProps) {
  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    onDragStateChange(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onDropFile(file);
    }
  }

  return (
    <label
      className={cn(
        "relative flex min-h-[18rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed px-5 py-10 text-center transition sm:py-12",
        isDragging ? "border-brand-600 bg-brand-50 ring-4 ring-brand-100" : "border-brand-200 bg-white hover:border-brand-400 hover:bg-brand-50/40",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        onDragStateChange(true);
      }}
      onDragLeave={() => onDragStateChange(false)}
      onDrop={handleDrop}
    >
      <span className={cn("mb-4 grid h-14 w-14 place-items-center rounded-xl text-xs font-bold text-white shadow-soft", selectedFile ? "bg-emerald-600" : "bg-gradient-to-br from-violet-600 to-brand-600")}>{selectedFile ? "OK" : "PDF"}</span>
      <span className="max-w-full truncate text-base font-bold text-ink">{selectedFile ? "File selected" : isDragging ? "Drop resume to upload" : "Drop your resume here"}</span>
      <span className="mt-2 text-sm leading-6 text-muted">{selectedFile ? selectedFile.name : "PDF or DOCX only. Drag and drop or browse from device."}</span>
      <span className="app-action-secondary mt-5">{selectedFile ? "Replace file" : "Browse files"}</span>
      <input className="sr-only" type="file" {...inputProps} />
    </label>
  );
}
