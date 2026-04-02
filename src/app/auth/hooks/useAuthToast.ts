import { useCallback } from "react";
import { useToast, ToastType } from "@/app/hooks/useToast";

interface AuthToastConfig {
  onSuccess?: {
    message: string;
    redirectPath?: string;
  };
  onError?: {
    message: string;
  };
}

/**
 * Custom hook to manage authentication-specific toast notifications
 * Provides callbacks for handling success and error states independently
 */
export const useAuthToast = (config: AuthToastConfig) => {
  const { addToastMessage, removeToastMessage, ToastComponent } = useToast({
    toastType: null,
    message: null,
  });

  const showSuccessToast = useCallback(
    (message?: string) => {
      const toastMessage =
        message || config.onSuccess?.message || "Operation successful!";
      addToastMessage("success", toastMessage, 3000);
    },
    [addToastMessage, config.onSuccess?.message],
  );

  const showErrorToast = useCallback(
    (message?: string) => {
      const toastMessage =
        message || config.onError?.message || "An error occurred.";
      addToastMessage("error", toastMessage, 6000);
    },
    [addToastMessage, config.onError?.message],
  );

  const showInfoToast = useCallback(
    (message: string) => {
      addToastMessage("info", message, 3000);
    },
    [addToastMessage],
  );

  const hideToast = useCallback(
    (delay?: number) => {
      // If a specific delay is passed use it, otherwise don't arbitrarily hide at 2.5s.
      // We typically use hideToast to clean up before transitioning, or we can just let it persist via animation.
      if (delay !== undefined) {
        setTimeout(() => {
          removeToastMessage();
        }, delay);
      }
    },
    [removeToastMessage],
  );

  return {
    ToastComponent,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    hideToast,
  };
};
