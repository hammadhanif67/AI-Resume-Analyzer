import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, id, ...props }: TextareaProps) {
  const textareaId = id ?? label.toLowerCase().replaceAll(" ", "-");

  return (
    <label className="label" htmlFor={textareaId}>
      {label}
      <textarea id={textareaId} className="form-field mt-1.5 min-h-28 resize-y" {...props} />
    </label>
  );
}
