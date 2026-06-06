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
  iconClassName = "bg-white/5 text-zinc-500",
  badge = "Search Result",
  title,
  description,
  helperText,
  action,
  "data-testid": dataTestId,
}: SearchFallbackProps) {
  return (
    <div className="relative z-10 flex items-center justify-center py-10 sm:py-16">
      <div
        className="w-full max-w-xl rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)] sm:p-8"
        data-testid={dataTestId}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${iconClassName}`}
          >
            {icon}
          </div>

          <span className="mb-3 inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-500">
            {badge}
          </span>

          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
            {description}
          </p>

          {helperText && (
            <p className="mt-2 text-sm text-zinc-500">{helperText}</p>
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
