/**
 * Production-safe user-facing messages.
 *
 * In production, raw server error details (stack traces, SQL errors,
 * connection strings) must never reach the user. This utility maps
 * categories to generic, friendly messages while preserving raw
 * details for server-side logging.
 */

const isDev = process.env.NODE_ENV !== "production";

const FALLBACKS = {
  network: "Unable to connect. Please check your internet and try again.",
  auth: "Your session has expired. Please sign in again.",
  forbidden: "You don't have permission to perform this action.",
  notFound: "The requested resource was not found.",
  server: "Something went wrong. Please try again in a moment.",
  validation: "Please check your input and try again.",
  default: "Something went wrong. Please try again.",
};

function categorize(status: number): keyof typeof FALLBACKS {
  if (status === 0) return "network";
  if (status === 401) return "auth";
  if (status === 403) return "forbidden";
  if (status === 404) return "notFound";
  if (status === 422) return "validation";
  if (status >= 500) return "server";
  return "default";
}

/**
 * Return a safe message for display in toasts / alerts.
 * In development the raw message is passed through so developers
 * can see actual errors. In production a generic message is shown.
 */
export function safeErrorMessage(
  rawMessage: string | undefined | null,
  status?: number,
): string {
  if (isDev && rawMessage) return rawMessage;
  return FALLBACKS[categorize(status ?? 500)];
}

/**
 * Return a safe success message. Success messages are usually
 * intentional and safe, but we still fall back for empty strings.
 */
export function safeSuccessMessage(raw: string | undefined | null): string {
  return raw || "Done.";
}
