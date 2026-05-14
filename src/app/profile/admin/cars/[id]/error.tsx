"use client";

import { ShieldCheck } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function AdminCarDetailError({
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
      logPrefix="[Admin Car Detail Error]"
      icon={<ShieldCheck className="h-7 w-7" />}
      iconBg="bg-rose-100"
      iconColor="text-rose-600"
      title="Car review unavailable"
      description="We couldn't load the car verification details. Please try again or return home."
    />
  );
}
