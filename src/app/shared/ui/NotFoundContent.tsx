"use client";

import { Search, Home, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RedirectTarget = "home" | "cars" | null;

export default function NotFoundContent() {
  const router = useRouter();
  const [redirectingTo, setRedirectingTo] = useState<RedirectTarget>(null);

  const isRedirecting = Boolean(redirectingTo);
  const isRedirectingHome = redirectingTo === "home";
  const isRedirectingCars = redirectingTo === "cars";

  const handleRedirect = (target: Exclude<RedirectTarget, null>) => {
    if (redirectingTo) return;

    setRedirectingTo(target);

    const path = target === "home" ? "/" : "/car/search";

    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <p className="mb-2 text-8xl font-extrabold text-gray-200 select-none">
          404
        </p>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Search className="h-7 w-7 text-blue-600" />
        </div>

        <h1 className="mb-2 text-xl font-bold text-gray-900">Page not found</h1>

        <p className="mb-8 text-sm text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => handleRedirect("home")}
            disabled={isRedirecting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRedirectingHome ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Home className="h-4 w-4" />
                Go home
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleRedirect("cars")}
            disabled={isRedirecting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRedirectingCars ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Browse cars
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
