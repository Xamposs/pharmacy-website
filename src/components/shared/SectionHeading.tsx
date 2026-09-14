interface SectionHeadingProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeading({ title, actionLabel, actionHref }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <h2 className="text-center text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        {title}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      {actionLabel && actionHref ? (
        <a
          href={actionHref}
          className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted hover:border-primary hover:text-primary"
        >
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}
