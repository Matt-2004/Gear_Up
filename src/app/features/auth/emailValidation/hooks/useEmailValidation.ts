import { useState } from "react";
import { useToast } from "@/app/hooks/useToast";
import { sendEmailSchema } from "@/app/auth/typeSchema";
import { useAuthForm } from "@/app/shared/hooks/useAuthForm";
import { emailValidationAction } from "../utils/emailValidationAction";
import { EmailValidationVariant } from "../types/email-validation-request";

const initialEmailValidationFormData = {
  email: "",
};

export const useEmailValidation = (variant: EmailValidationVariant) => {
  const [isPending, setIsPending] = useState(false);

  const { handleToast } = useToast({
    toastType: null,
    message: null,
  });

  const { formData, setFormData, validationErrors, isFormValid } = useAuthForm(
    initialEmailValidationFormData,
    sendEmailSchema,
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("email", formData.email);

    setIsPending(true);
    const response = await emailValidationAction(submitData, variant);
    setIsPending(false);

    handleToast(response, "/auth/login");
  };

  return {
    isPending,
    handleFormSubmit,
    formData,
    setFormData,
    validationErrors,
    isFormValid,
  };
};
