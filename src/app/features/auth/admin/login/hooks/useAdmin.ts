import { useState } from "react";
import { LoginSchema } from "../../../../../auth/typeSchema";
import { useAuthForm } from "../../../../../shared/hooks/useAuthForm";
import { useToast } from "@/app/hooks/useToast";
import { adminAction } from "../utils/adminAction";

const initialAdminLoginFormData = {
  email: "",
  password: "",
};

export const useAdmin = () => {
  const [isPending, setIsPending] = useState(false);

  const { handleToast } = useToast({
    toastType: null,
    message: null,
  });

  const { formData, setFormData } = useAuthForm(
    initialAdminLoginFormData,
    LoginSchema,
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);

    setIsPending(true);
    const res = await adminAction(submitData);
    setIsPending(false);

    handleToast(res, "/profile/admin?tab=dashboard");
  };

  return {
    isPending,
    handleFormSubmit,
    formData,
    setFormData,
  };
};
