interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <div className="mb-5 max-w-3xl">
      {eyebrow ? <p className="mb-1.5 text-[11px] font-bold uppercase text-brand-700">{eyebrow}</p> : null}
      <h1 className="text-2xl font-bold tracking-normal text-ink sm:text-3xl">{title}</h1>
      {description ? <p className="mt-2 text-sm leading-6 text-muted">{description}</p> : null}
    </div>
  );
}
