interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-card border border-red-200 bg-danger-50 p-4 text-sm font-medium text-danger-700" role="alert">
      {message}
    </div>
  );
}
