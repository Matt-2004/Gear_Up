interface SearchFallbackProps {
  icon: React.ReactNode;
  iconClassName?: string;
  badge?: string;
  title: string;
  description: string;
  helperText?: string;
  action?: React.ReactNode;
  "data-testid"?: string;
}

export function SearchFallback({
  icon,
  iconClassName = "bg-zinc-100 text-zinc-600",
  badge = "Search Result",
  title,
  description,
  helperText,
  action,
  "data-testid": dataTestId,
}: SearchFallbackProps) {
  return (
    <div className="flex items-center justify-center py-10 sm:py-16">
      <div
        className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)] sm:p-8"
        data-testid={dataTestId}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${iconClassName}`}
          >
            {icon}
          </div>

          <span className="mb-3 inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-500">
            {badge}
          </span>

          <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            {title}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
            {description}
          </p>

          {helperText && (
            <p className="mt-2 text-sm text-zinc-400">{helperText}</p>
          )}

          {action && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
