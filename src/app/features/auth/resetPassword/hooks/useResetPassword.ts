import { useState } from "react";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { ResetPasswordSchema } from "@/app/features/auth/utils/typeSchema";
import { useAuthForm } from "@/app/shared/hooks/useAuthForm";
import { resetPasswordAction } from "../utils/resetPasswordAction";

const initialResetPasswordFormData = {
  newPassword: "",
  confirmPassword: "",
};

export const useResetPassword = (token: string | null) => {
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

    const normalizedToken = token?.replace(/ /g, "+").trim();

    if (!normalizedToken) {
      handleToast(
        {
          isSuccess: false,
          message: "Reset token is missing or invalid.",
          data: null,
          status: 400,
        },
        "/auth/login",
      );
      return;
    }

    const submitData = new FormData();
    submitData.append("newPassword", formData.newPassword);
    submitData.append("confirmPassword", formData.confirmPassword);
    submitData.append("token", normalizedToken);

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
