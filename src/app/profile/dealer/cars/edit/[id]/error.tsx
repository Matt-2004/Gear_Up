"use client";

import { Wrench } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function DealerEditCarError({
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
      logPrefix="[Dealer Edit Car Error]"
      icon={<Wrench className="h-7 w-7" />}
      iconBg="bg-orange-100"
      iconColor="text-orange-600"
      title="Edit vehicle unavailable"
      description="We couldn't load the edit vehicle form. Please try again or return home."
    />
  );
}
