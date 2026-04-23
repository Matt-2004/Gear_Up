import { useState } from "react";
import { RegisterSchema } from "../../utils/typeSchema";
import { useAuthForm } from "../../../../shared/hooks/useAuthForm";
import { useToast } from "@/app/features/toast/hooks/useToast";
import { signInAction } from "../utils/signInAction";
import {
  token_integration,
  user_data_integration,
} from "@/app/shared/utils/AuthUtils/CookieIntegration";
import { UserFetch } from "@/app/shared/utils/AuthUtils/UserFetch";
import { encrypt } from "@/app/shared/utils/AuthUtils/encryption";
import { useUserData } from "@/app/features/navbar/context/UserDataContext";

// formData --> handleFromSubmit() --> signUpAction --> toast

const initialLoginFormData = {
  usernameOrEmail: "",
  password: "",
  rememberMe: false,
};

export const useSignIn = () => {
  const [isPending, setIsPending] = useState(false);
  const { refreshUserData } = useUserData();

  const { handleToast } = useToast({
    toastType: null,
    message: null,
  });
  const { formData, setFormData, validationErrors } = useAuthForm(
    initialLoginFormData,
    RegisterSchema,
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("usernameOrEmail", formData.usernameOrEmail);
    submitData.append("password", formData.password);
    setIsPending(true);

    // signInAction will return access_token & refresh_token
    const res = await signInAction(submitData);
    // to reduce server load for fetching user data, save the user encrypted data in cookie
    if (res.isSuccess && res.data) {
      // set tokens in cookie
      await token_integration(res.data, initialLoginFormData.rememberMe);

      // promise-chain for setting user data in cookie
      const userRes = await UserFetch(res.data.accessToken);
      const encryptedUserData = await encrypt(userRes.data);
      await user_data_integration(
        encryptedUserData,
        initialLoginFormData.rememberMe,
      );

      await refreshUserData();
    }

    setIsPending(false);
    handleToast(res, "/");
  };

  return {
    isPending,
    handleFormSubmit,
    formData,
    setFormData,
  };
};
