import { useState } from "react";
import { RegisterSchema } from "../../../../auth/typeSchema";
import { useAuthForm } from "../../../../shared/hooks/useAuthForm";
import { signUpAction } from "../utils/signUpAction";
import { useToast } from "@/app/hooks/useToast";

// formData --> handleFromSubmit() --> signUpAction --> toast

const initialRegisterFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

export const useSignUp = () => {
  const [isPending, setIsPending] = useState(false);

  const { handleToast } = useToast({
    toastType: null,
    message: null,
  });
  const { formData, setFormData, validationErrors, isFormValid } = useAuthForm(
    initialRegisterFormData,
    RegisterSchema,
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("firstName", formData.firstName);
    submitData.append("lastName", formData.lastName);
    submitData.append("username", formData.username);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("confirmPassword", formData.confirmPassword);
    submitData.append("agreeToTerms", String(formData.agreeToTerms));
    setIsPending(true);
    const res = await signUpAction(submitData);
    setIsPending(false);
    handleToast(res, "/auth/login");
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
