"use client";

import { Tokens } from "@/app/features/auth/signIn/types/sign-in-response";
import { MainResponse } from "@/app/shared/types.ts/main-response";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ToastType = "success" | "error" | "info";

interface ToastState {
  toastType: ToastType | null;
  message: string | null;
  duration?: number;
}

interface ToastContextValue {
  toast: ToastState;
  setToast: React.Dispatch<React.SetStateAction<ToastState>>;
  addToastMessage: (
    toastType: ToastType,
    message: string,
    duration?: number,
  ) => void;
  removeToastMessage: () => void;
  handleToast: (
    res: MainResponse<string | null | Tokens>,
    pathAfterSuccess?: string,
  ) => void;
}

const DEFAULT_TOAST_DURATION = 2500;

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);

export default function ToastProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>({
    toastType: null,
    message: null,
    duration: DEFAULT_TOAST_DURATION,
  });

  const addToastMessage = useCallback(
    (
      toastType: ToastType,
      message: string,
      duration: number = DEFAULT_TOAST_DURATION,
    ) => {
      setToast({ toastType, message, duration });
    },
    [],
  );

  const removeToastMessage = useCallback(() => {
    setToast({
      toastType: null,
      message: null,
      duration: DEFAULT_TOAST_DURATION,
    });
  }, []);

  const handleToast = (
    res: MainResponse<string | null | Tokens>,
    pathAfterSuccess?: string,
  ) => {
    const duration = DEFAULT_TOAST_DURATION;

    if (res.isSuccess) {
      addToastMessage("success", res.message, duration);
      if (pathAfterSuccess) {
        setTimeout(() => {
          router.push(pathAfterSuccess);
        }, duration + 150);
      }
    } else {
      addToastMessage("error", res.message, duration);
    }
  };

  useEffect(() => {
    if (!toast.toastType || !toast.message) return;

    const timeout = window.setTimeout(() => {
      removeToastMessage();
    }, toast.duration ?? DEFAULT_TOAST_DURATION);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast.toastType, toast.message, toast.duration, removeToastMessage]);

  const contextValue = useMemo(
    () => ({
      toast,
      setToast,
      addToastMessage,
      removeToastMessage,
      handleToast,
    }),
    [toast, addToastMessage, removeToastMessage],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <AnimatePresence initial={false} mode="wait">
        {toast.toastType !== null && toast.message !== null && (
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -14, opacity: 0, scale: 0.98 }}
            transition={{
              duration: 0.22,
              ease: "easeInOut",
            }}
            className="fixed top-5 left-1/2 z-9999 w-[min(92vw,30rem)] -translate-x-1/2"
          >
            <div
              role="status"
              aria-live="polite"
              className={clsx(
                "relative w-full overflow-hidden rounded-lg shadow-sm bg-white px-4 py-3.5 ",
                "ring-1 ring-black/5",
                {
                  "border-emerald-200 text-slate-800":
                    toast.toastType === "success",
                  " text-slate-800": toast.toastType === "error",
                  "border-sky-200 text-slate-800": toast.toastType === "info",
                },
              )}
            >
              <span
                className={clsx("absolute top-0 left-0 h-full w-1.5 bg-white")}
              />

              <div className="flex items-start justify-between gap-3">
                <div
                  className={clsx(
                    "mt-0.5 ml-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    {
                      "bg-emerald-100 text-emerald-600":
                        toast.toastType === "success",
                      "bg-rose-100 text-rose-600": toast.toastType === "error",
                      "bg-sky-100 text-sky-600": toast.toastType === "info",
                    },
                  )}
                >
                  {toast.toastType === "success" ? (
                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
                  ) : toast.toastType === "error" ? (
                    <XCircle className="h-5 w-5" strokeWidth={2.2} />
                  ) : (
                    <Info className="h-5 w-5" strokeWidth={2.2} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-5 tracking-wide text-slate-900">
                    {toast.toastType?.charAt(0).toUpperCase() +
                      toast.toastType?.substring(1)}
                  </p>
                  <p className="mt-0.5 text-sm leading-5 text-slate-600">
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeToastMessage}
                  aria-label="Dismiss notification"
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-4 w-4" strokeWidth={2.3} />
                </button>
              </div>

              <motion.div
                key={`${toast.toastType}-${toast.message}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: (toast.duration ?? DEFAULT_TOAST_DURATION) / 1000,
                  ease: "linear",
                }}
                className={clsx("absolute right-0 bottom-0 h-1", {
                  "bg-emerald-500/70": toast.toastType === "success",
                  "bg-rose-500/70": toast.toastType === "error",
                  "bg-sky-500/70": toast.toastType === "info",
                })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
