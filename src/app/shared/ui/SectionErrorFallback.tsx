"use client";

import { AlertTriangle, ArrowLeft, Loader2, RefreshCcw } from "lucide-react";

interface SectionErrorFallbackProps {
  message?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  onGoBack?: () => void;
}

export default function SectionErrorFallback({
  message = "We're having trouble loading this content",
  description = "Please try again in a moment.",
  onRetry,
  isRetrying = false,
  onGoBack,
}: SectionErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
          <AlertTriangle className="h-6 w-6 text-zinc-500" />
        </div>

        <h3 className="text-lg font-semibold text-zinc-900">{message}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          {onGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
          )}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
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
          )}
        </div>
      </div>
    </div>
  );
}
