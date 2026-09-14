interface SectionHeadingProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeading({ title, actionLabel, actionHref }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
      <h2 className="text-center text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
        {title}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-neutral-200" />
      {actionLabel && actionHref ? (
        <a
          href={actionHref}
          className="shrink-0 rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
        >
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}
