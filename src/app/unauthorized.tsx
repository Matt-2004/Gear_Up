"use client";

import { Home, Loader2, LogIn, ShieldUser } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RedirectTarget = "login" | "home" | null;

const Unauthorized = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [redirectingTo, setRedirectingTo] = useState<RedirectTarget>(null);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    const countdownTimer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(countdownTimer);
    };
  }, []);

  const handleRedirect = (target: Exclude<RedirectTarget, null>) => {
    if (redirectingTo) return;

    setRedirectingTo(target);

    const path = target === "login" ? "/auth/login" : "/";

    setTimeout(() => {
      router.push(path);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600">
            Verifying Access
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Checking your session
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
            Please wait while we verify your access before showing the available
            options.
          </p>

          <p className="mt-6 text-xs font-medium text-gray-400">
            Showing options in {secondsLeft}...
          </p>
        </div>
      </div>
    );
  }

  const isRedirectingLogin = redirectingTo === "login";
  const isRedirectingHome = redirectingTo === "home";
  const isRedirecting = Boolean(redirectingTo);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-red-600">
          Unauthorized
        </p>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <ShieldUser className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Session expired
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
          Your session has expired or you are not signed in. Please log in again
          to continue using your account.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => handleRedirect("login")}
            disabled={isRedirecting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRedirectingLogin ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Login
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleRedirect("home")}
            disabled={isRedirecting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
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
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Error code: 401 Unauthorized
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
