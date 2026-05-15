import type { ReactNode } from "react";

interface PageShellProps {
  badge?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function PageShell({
  badge,
  title,
  description,
  children,
  className = "",
}: PageShellProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto w-full px-4 py-12 md:py-16 lg:w-[90%] xl:w-[75%]">
          {badge && (
            <span className="mb-3 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold tracking-wide text-primary-700">
              {badge}
            </span>
          )}
          <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-base text-gray-500">
              {description}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className={className}>
        <div className="mx-auto w-full px-4 py-12 md:py-16 lg:w-[90%] xl:w-[75%]">
          {children}
        </div>
      </section>
    </main>
  );
}
