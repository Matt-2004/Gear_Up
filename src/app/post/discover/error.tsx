"use client";

import { FileText } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function DiscoverError({
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
      logPrefix="[Discover Error]"
      icon={<FileText className="h-7 w-7" />}
      iconBg="bg-indigo-100"
      iconColor="text-indigo-600"
      title="Discover feed unavailable"
      description="We couldn't load the latest posts. Please try again or return home."
    />
  );
}
