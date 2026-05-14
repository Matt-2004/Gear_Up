"use client";

import { KeyRound } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      logPrefix="[Auth Error]"
      icon={<KeyRound className="h-7 w-7" />}
      iconBg="bg-amber-100"
      iconColor="text-amber-600"
      title="Authentication unavailable"
      description="We couldn't load the sign-in page. Please try again or return to the home page."
    />
  );
}
