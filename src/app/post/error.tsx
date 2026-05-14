"use client";

import { FileText } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function PostError({
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
      logPrefix="[Post Error]"
      icon={<FileText className="h-7 w-7" />}
      iconBg="bg-purple-100"
      iconColor="text-purple-600"
      title="Posts unavailable"
      description="We couldn't load the community posts. Please try again or return to the home page."
    />
  );
}
