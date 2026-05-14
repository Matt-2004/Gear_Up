"use client";

import { Calendar } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function DealerAppointmentsError({
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
      logPrefix="[Dealer Appointments Error]"
      icon={<Calendar className="h-7 w-7" />}
      iconBg="bg-emerald-100"
      iconColor="text-emerald-600"
      title="Appointments unavailable"
      description="We couldn't load appointment management. Please try again or return home."
    />
  );
}
