"use client";

import { useEffect } from "react";
import { Store, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DealerError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Dealer Profile Error]", error);
  }, [error]);

  const isServerActionMismatch = error.message
    .toLowerCase()
    .includes("failed to find server action");

  const onHardRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Store className="h-7 w-7 text-blue-600" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">
          Dealer dashboard unavailable
        </h1>
        {isServerActionMismatch ? (
          <p className="mb-6 text-sm text-amber-700">
            Your session is using an outdated page build. Refresh to sync with
            the latest deployment.
          </p>
        ) : (
          <p className="mb-6 text-sm text-gray-500">
            We couldn&apos;t load your dealer dashboard. Please try again.
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {isServerActionMismatch ? (
            <button
              onClick={onHardRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh page
            </button>
          ) : (
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Try again
            </button>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
