import { useState } from "react";
import { LoginSchema } from "../../../utils/typeSchema";
import { useAuthForm } from "../../../../../shared/hooks/useAuthForm";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { adminAction } from "../utils/adminAction";
import {
  token_integration,
  user_data_integration,
} from "@/app/shared/utils/AuthUtils/CookieIntegration";
import { UserFetch } from "@/app/shared/utils/AuthUtils/UserFetch";
import { encrypt } from "@/app/shared/utils/AuthUtils/encryption";
import { UserMapper } from "@/app/features/profiles/user/types/user.mapper";
import { u } from "framer-motion/client";

const initialAdminLoginFormData = {
  email: "",
  password: "",
};

export const useAdminLogin = () => {
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
    if (res.isSuccess && res.data) {
      await token_integration(res.data);
      const userRes = await UserFetch();
      const userData = UserMapper(userRes.data);
      const encryptedUserData = await encrypt(userData);
      await user_data_integration(encryptedUserData);
    }
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
function refreshUserData() {
  throw new Error("Function not implemented.");
}
