"use client";

import { User } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function UserError({
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
      logPrefix="[User Error]"
      icon={<User className="h-7 w-7" />}
      iconBg="bg-sky-100"
      iconColor="text-sky-600"
      title="Profile unavailable"
      description="We couldn't load your profile. Please try again or return to the home page."
    />
  );
}
