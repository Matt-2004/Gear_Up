"use client";

import { Car } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function DealerCarsError({
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
      logPrefix="[Dealer Cars Error]"
      icon={<Car className="h-7 w-7" />}
      iconBg="bg-slate-100"
      iconColor="text-slate-600"
      title="Vehicle inventory unavailable"
      description="We couldn't load your inventory. Please try again or return home."
    />
  );
}
