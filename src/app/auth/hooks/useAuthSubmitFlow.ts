"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseAuthSubmitFlowConfig {
  submitForm: (formData: FormData) => Promise<unknown>;
  showSuccessToast: (message?: string) => void;
  showErrorToast: (error?: unknown) => void;
  successRedirectPath?: string;
  successRedirectDelay?: number;
  onSuccess?: (formData: FormData) => Promise<void> | void;
  onError?: (error: unknown) => void;
}

export const useAuthSubmitFlow = (config: UseAuthSubmitFlowConfig) => {
  const router = useRouter();

  const handleAuthSubmit = useCallback(
    async (formData: FormData) => {
      try {
        await config.submitForm(formData);

        try {
          await config.onSuccess?.(formData);
        } catch (error) {
          console.error("Auth post-success side effect failed:", error);
        }

        config.showSuccessToast();

        if (config.successRedirectPath) {
          const delay = config.successRedirectDelay ?? 2000;
          setTimeout(() => {
            router.push(config.successRedirectPath as string);
          }, delay);
        }
      } catch (error) {
        config.showErrorToast(error);
        config.onError?.(error);
      }
    },
    [config, router],
  );

  return { handleAuthSubmit };
};
