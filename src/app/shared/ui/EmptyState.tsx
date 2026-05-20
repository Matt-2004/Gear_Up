import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  "data-testid"?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  "data-testid": dataTestId,
}: EmptyStateProps) {
  return (
    <div
      className="flex items-center justify-center py-16"
      data-testid={dataTestId}
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
          <div className="text-zinc-500">{icon}</div>
        </div>

        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          {description}
        </p>

        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
