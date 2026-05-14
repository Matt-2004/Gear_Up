"use client";

import { useEffect, type ReactNode } from "react";
import { RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Lucide icon element (e.g., `<Car className="h-7 w-7" />`) */
  icon: ReactNode;
  /** Background colour for the icon circle (Tailwind bg class) */
  iconBg: string;
  /** Colour for the icon (Tailwind text class) */
  iconColor: string;
  title: string;
  description: string;
  /** Link target for the secondary button (default "/") */
  homeHref?: string;
  /** Label for the secondary button (default "Go home") */
  homeLabel?: string;
  /** Optional error-logging prefix */
  logPrefix?: string;
}

export default function ErrorPage({
  error,
  reset,
  icon,
  iconBg,
  iconColor,
  title,
  description,
  homeHref = "/",
  homeLabel = "Go home",
  logPrefix = "[Error]",
}: ErrorPageProps) {
  useEffect(() => {
    console.error(logPrefix, error);
  }, [error, logPrefix]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}
        >
          <div className={iconColor}>{icon}</div>
        </div>

        <h1 className="mb-2 text-xl font-bold text-gray-900">{title}</h1>
        <p className="mb-6 text-sm text-gray-500">{description}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
