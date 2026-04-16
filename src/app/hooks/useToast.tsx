"use client";

import { ToastContext } from "@/provider/ToastProvider";
import { useContext } from "react";
import type { ToastType } from "@/provider/ToastProvider";

export type { ToastType } from "@/provider/ToastProvider";

interface UseToastConfig {
  toastType?: ToastType | null;
  message?: string | null;
  duration?: number;
}

export function useToast(_config?: UseToastConfig) {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return {
    handleToast: context.handleToast,
    addToastMessage: context.addToastMessage,
    removeToastMessage: context.removeToastMessage,
  };
}
