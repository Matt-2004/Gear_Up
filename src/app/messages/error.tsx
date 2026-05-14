"use client";

import { MessageCircle } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function MessagesError({
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
      logPrefix="[Messages Error]"
      icon={<MessageCircle className="h-7 w-7" />}
      iconBg="bg-green-100"
      iconColor="text-green-600"
      title="Messages unavailable"
      description="We couldn't load your messages. Please try again or return to the home page."
    />
  );
}
