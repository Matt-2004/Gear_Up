"use client";

import { PlusCircle } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function DealerAddCarError({
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
      logPrefix="[Dealer Add Car Error]"
      icon={<PlusCircle className="h-7 w-7" />}
      iconBg="bg-teal-100"
      iconColor="text-teal-600"
      title="Add vehicle unavailable"
      description="We couldn't load the add vehicle form. Please try again or return home."
    />
  );
}
