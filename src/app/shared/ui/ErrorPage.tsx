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
  iconBg = "bg-gray-100",
  iconColor = "text-gray-500",
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
    <div className="flex items-center justify-center py-24">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)] text-center">
        <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>

        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            {homeLabel}
          </Link>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
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
