"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Loader2, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description: string;
  homeHref?: string;
  homeLabel?: string;
  logPrefix?: string;
}

export default function ErrorPage({
  error,
  reset,
  icon,
  iconBg = "bg-red-50",
  iconColor = "text-red-500",
  title,
  description,
  homeHref = "/",
  homeLabel = "Go home",
  logPrefix = "[Error]",
}: ErrorPageProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error(logPrefix, error);
  }, [error, logPrefix]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => reset(), 600);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div
          className={`mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <div className={`${iconColor} [&>svg]:h-8 [&>svg]:w-8`}>{icon}</div>
        </div>

        <h1 className="text-xl font-bold tracking-wide text-gray-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {description}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            {homeLabel}
          </Link>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRetrying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            {isRetrying ? "Retrying..." : "Try again"}
          </button>
        </div>
      </div>
    </div>
  );
}
