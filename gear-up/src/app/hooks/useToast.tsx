"use client";

import { CircleCheck, CircleXMark, XIcon } from "@/components/Common/SVGs";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  toastType: ToastType | null;
  message: string | null;
}

export function useToast({ toastType, message }: Toast) {
  const [toast, setToast] = useState<Toast>({
    toastType: toastType,
    message: message,
  });

  const addToastMessage = (toastType: ToastType, message: string) => {
    setToast({ toastType, message });
  };

  const removeToastMessage = () => {
    setToast({ toastType: null, message: null });
  };

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
                className={`flex w-full max-w-sm items-start justify-between gap-3 border px-4 py-3 shadow-md ${toast.toastType === "success" ? "border-green-500 bg-[#00a973]" : ""} ${toast.toastType === "error" ? "border-red-500 bg-red-400" : ""} ${toast.toastType === "info" ? "border-blue-500 bg-blue-400" : ""} `}
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

              {/* ✅ Smooth progress animation handled by Framer Motion */}
              <div className="h-1 overflow-hidden bg-gray-200">
                <motion.div
                  className={clsx(
                    toast.toastType === "success"
                      ? "bg-green-500"
                      : "bg-[#ff0000]",
                    "h-1",
                  )}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4000 / 1000, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }
  };

  return { ToastComponent, setToast, addToastMessage, removeToastMessage };
}
