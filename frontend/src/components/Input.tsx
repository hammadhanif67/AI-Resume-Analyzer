import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(" ", "-");

  return (
    <label className="label" htmlFor={inputId}>
      {label}
      <input id={inputId} className="form-field mt-1.5" {...props} />
    </label>
  );
}
