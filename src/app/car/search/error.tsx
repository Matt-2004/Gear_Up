"use client";

import { Search } from "lucide-react";
import ErrorPage from "@/app/shared/ui/ErrorPage";

export default function SearchError({
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
      logPrefix="[Search Error]"
      icon={<Search className="h-7 w-7" />}
      iconBg="bg-blue-100"
      iconColor="text-blue-600"
      title="Search unavailable"
      description="We couldn't load the search page. Please try again or browse featured cars from the home page."
    />
  );
}
