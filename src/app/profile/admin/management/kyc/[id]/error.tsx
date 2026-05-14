"use client";

import { FileUser } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function AdminKycDetailError({
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
      logPrefix="[Admin KYC Detail Error]"
      icon={<FileUser className="h-7 w-7" />}
      iconBg="bg-violet-100"
      iconColor="text-violet-600"
      title="KYC review unavailable"
      description="We couldn't load the KYC verification details. Please try again or return home."
    />
  );
}
