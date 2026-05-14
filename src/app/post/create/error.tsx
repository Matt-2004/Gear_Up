"use client";

import { PenLine } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function PostCreateError({
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
      logPrefix="[Post Create Error]"
      icon={<PenLine className="h-7 w-7" />}
      iconBg="bg-amber-100"
      iconColor="text-amber-600"
      title="Post creation unavailable"
      description="We couldn't load the post editor. Please try again or return home."
    />
  );
}
