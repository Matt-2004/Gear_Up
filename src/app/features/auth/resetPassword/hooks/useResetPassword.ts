import { useState } from "react";
import { useToast } from "@/app/hooks/useToast";
import { ResetPasswordSchema } from "@/app/auth/typeSchema";
import { useAuthForm } from "@/app/shared/hooks/useAuthForm";
import { resetPasswordAction } from "../utils/resetPasswordAction";

const initialResetPasswordFormData = {
  newPassword: "",
  confirmPassword: "",
};

export const useResetPassword = () => {
  const [isPending, setIsPending] = useState(false);

  const { handleToast } = useToast({
    toastType: null,
    message: null,
  });

  const { formData, setFormData, validationErrors, isFormValid } = useAuthForm(
    initialResetPasswordFormData,
    ResetPasswordSchema,
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("newPassword", formData.newPassword);
    submitData.append("confirmPassword", formData.confirmPassword);

    setIsPending(true);
    const response = await resetPasswordAction(submitData);
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
