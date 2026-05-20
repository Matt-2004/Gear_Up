"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PostError({ error, reset }: ErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error("[Post Page Error]", error);
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => reset(), 600);
  };

  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
          <FileText className="h-7 w-7 text-zinc-500" />
        </div>

        <h1 className="text-lg font-semibold text-zinc-900">
          We&apos;re having trouble loading this post
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          It may have been deleted or there was a connection problem. Please try
          again in a moment.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
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
