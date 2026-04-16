import { useEffect, useState } from "react";
import { ZodSchema } from "zod";

interface UseAuthFormResult<T> {
  isFormValid: boolean;
  formData: T;
  setFormData: (value: T | ((prev: T) => T)) => void;
  validationErrors: Record<string, string>;
}

/**
 * Custom hook for managing authentication form state and validation.
 * Separates form logic from toast notifications for better modularity.
 *
 * NOTE: Use `onSubmit` (not `action`) on the <form> element so that
 * errors thrown by the submit function propagate correctly to callers.
 */
export const useAuthForm = <T>(
  initialFormData: T,
  schema: ZodSchema,
): UseAuthFormResult<T> => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<T>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Validate form data whenever it changes
  useEffect(() => {
    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten()
        .fieldErrors as Record<string, string[]>;

      const formattedErrors = Object.keys(fieldErrors).reduce(
        (acc: Record<string, string>, key) => {
          acc[key] = fieldErrors[key]?.[0] || "Invalid input";
          return acc;
        },
        {} as Record<string, string>,
      );

      setValidationErrors(formattedErrors);
      setIsFormValid(false);
    } else {
      setValidationErrors({});
      setIsFormValid(true);
    }
  }, [formData, schema]);

  return {
    isFormValid,
    formData,
    setFormData,
    validationErrors,
  };
};
