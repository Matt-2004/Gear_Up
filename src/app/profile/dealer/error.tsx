"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCcw, Store, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DealerError({ error, reset }: ErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error("[Dealer Profile Error]", error);
  }, [error]);

  const isServerActionMismatch = error.message
    .toLowerCase()
    .includes("failed to find server action");

  const handleHardRefresh = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => reset(), 600);
  };

  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)] text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <Store className="h-7 w-7 text-gray-500" />
        </div>

        <h1 className="text-lg font-semibold text-gray-900">
          Dealer dashboard unavailable
        </h1>

        {isServerActionMismatch ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-amber-600">
              Your session is using an outdated page build. Refresh to sync with
              the latest deployment.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Go home
              </Link>
              <button
                type="button"
                onClick={handleHardRefresh}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-700"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh page
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              We couldn&apos;t load your dealer dashboard. Please try again in a
              moment.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Go home
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
          </>
        )}
      </div>
    </div>
  );
}
