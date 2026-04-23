"use client";

import { ToastContext } from "@/app/features/toast/provider/ToastProvider";
import { useContext } from "react";
import type { ToastType } from "@/app/features/toast/provider/ToastProvider";

export type { ToastType } from "@/app/features/toast/provider/ToastProvider";

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
