"use client";

import { UserCheck } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function DealerRegisterError({
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
      logPrefix="[Dealer Register Error]"
      icon={<UserCheck className="h-7 w-7" />}
      iconBg="bg-sky-100"
      iconColor="text-sky-600"
      title="Dealer registration unavailable"
      description="We couldn't load the registration steps. Please try again or return home."
    />
  );
}
