"use client";

import { useEffect, useMemo } from "react";
import { Store, RefreshCcw, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface ErrorProps {
  error: Error & {
    digest?: string;
    cause?: unknown;
  };
  reset: () => void;
}

const SENSITIVE_QUERY_KEYS = [
  "token",
  "access_token",
  "refresh_token",
  "reset_token",
  "code",
  "password",
];

function createErrorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `err_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function safeStringify(value: unknown) {
  try {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }

    if (typeof value === "object" && value !== null) {
      return JSON.parse(JSON.stringify(value));
    }

    return value;
  } catch {
    return String(value);
  }
}

function redactSearchParams(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams.toString());

  for (const key of Array.from(params.keys())) {
    const lowerKey = key.toLowerCase();

    if (
      SENSITIVE_QUERY_KEYS.some((sensitive) => lowerKey.includes(sensitive))
    ) {
      params.set(key, "[REDACTED]");
    }
  }

  return params.toString();
}

function normalizeError(error: ErrorProps["error"]) {
  return {
    name: error.name,
    message: error.message,
    digest: error.digest,
    stack: error.stack,
    cause: safeStringify(error.cause),
  };
}

export default function DealerError({ error, reset }: ErrorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const errorId = useMemo(() => createErrorId(), []);

  const errorMessage = error.message ?? "";

  const isServerActionMismatch =
    errorMessage.toLowerCase().includes("failed to find server action") ||
    errorMessage.toLowerCase().includes("server action") ||
    errorMessage.toLowerCase().includes("deployment");

  useEffect(() => {
    const redactedQuery = redactSearchParams(searchParams);

    const payload = {
      errorId,
      area: "dealer-dashboard",
      error: normalizeError(error),
      page: {
        pathname,
        query: redactedQuery,
        url:
          typeof window !== "undefined"
            ? `${window.location.origin}${pathname}${
                redactedQuery ? `?${redactedQuery}` : ""
              }`
            : pathname,
      },
      browser:
        typeof navigator !== "undefined"
          ? {
              userAgent: navigator.userAgent,
              language: navigator.language,
              online: navigator.onLine,
            }
          : null,
      app: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV,
        commitSha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      },
      time: new Date().toISOString(),
    };

    console.groupCollapsed(`[Dealer Error Boundary] ${errorId}`);
    console.table({
      errorId,
      name: payload.error.name,
      message: payload.error.message,
      digest: payload.error.digest,
      pathname: payload.page.pathname,
      query: payload.page.query,
      time: payload.time,
    });
    console.log("Full error payload:", payload);
    console.groupEnd();

    fetch("/api/client-error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Never throw inside error boundary logging.
    });
  }, [error, errorId, pathname, searchParams]);

  const onHardRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          {isServerActionMismatch ? (
            <RefreshCcw className="h-7 w-7 text-blue-600" />
          ) : (
            <Store className="h-7 w-7 text-blue-600" />
          )}
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

        <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <div>
              <p className="text-xs font-medium text-gray-700">
                Error reference
              </p>
              <p className="mt-1 break-all font-mono text-xs text-gray-500">
                {errorId}
              </p>

              {error.digest && (
                <p className="mt-2 break-all font-mono text-xs text-gray-400">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-left">
            <summary className="cursor-pointer text-sm font-medium text-red-700">
              Developer error details
            </summary>

            <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap break-words text-xs text-red-700">
              {JSON.stringify(normalizeError(error), null, 2)}
            </pre>
          </details>
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
