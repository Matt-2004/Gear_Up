"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCcw, ShieldAlert, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => reset(), 600);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)] text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <ShieldAlert className="h-7 w-7 text-gray-500" />
        </div>

        <h1 className="text-lg font-semibold text-gray-900">
          Admin panel is temporarily unavailable
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          We&apos;re having trouble loading the admin dashboard. Please try again
          in a moment.
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
      </div>
    </div>
  );
}
