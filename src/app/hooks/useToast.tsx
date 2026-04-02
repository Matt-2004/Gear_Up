"use client";

import { CircleCheck, CircleXMark, XIcon } from "@/components/Common/SVGs";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  toastType: ToastType | null;
  message: string | null;
  duration?: number;
}

export function useToast({ toastType, message }: Toast) {
  const [toast, setToast] = useState<Toast>({
    toastType: toastType,
    message: message,
    duration: 2500,
  });

  const addToastMessage = useCallback(
    (toastType: ToastType, message: string, duration: number = 2500) => {
      setToast({ toastType, message, duration });
    },
    [],
  );

  const removeToastMessage = useCallback(() => {
    setToast({ toastType: null, message: null, duration: 2500 });
  }, []);

  const ToastComponent = () => {
    if (toast?.toastType !== null && toast?.message !== null) {
      return (
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`fixed top-6 left-1/2 z-9999 w-87.5 -translate-x-1/2`}
            >
              <div
                className={`flex w-full max-w-sm items-start rounded-xl justify-between gap-3 border px-4 py-3 shadow-md ${toast.toastType === "success" ? "border-green-500 bg-[#00a973]" : ""} ${toast.toastType === "error" ? "border-red-500 bg-red-400" : ""} ${toast.toastType === "info" ? "border-blue-500 bg-blue-400" : ""} `}
              >
                <div className="mt-1 text-green-500">
                  {toast.toastType === "success" ? (
                    <CircleCheck />
                  ) : (
                    <CircleXMark />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-200">
                    {toast.toastType?.charAt(0).toUpperCase() +
                      toast.toastType?.substring(1)}
                  </div>
                  <div className="text-sm text-gray-100">{toast.message}</div>
                </div>
                <button
                  onClick={() => removeToastMessage()}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <XIcon />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }
  };

  return { ToastComponent, setToast, addToastMessage, removeToastMessage };
}
