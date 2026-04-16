import { useState } from "react";
import { RegisterSchema } from "../../../../auth/typeSchema";
import { useAuthForm } from "../../../../shared/hooks/useAuthForm";
import { useToast } from "@/app/hooks/useToast";
import { signInAction } from "../utils/signInAction";
import {
  token_integration,
  user_data_integration,
} from "@/utils/Auth/CookieIntegration";
import { UserFetch } from "@/utils/User/UserFetch";
import { encrypt } from "@/utils/encryption";

// formData --> handleFromSubmit() --> signUpAction --> toast

const initialLoginFormData = {
  usernameOrEmail: "",
  password: "",
  rememberMe: false,
};

export const useSignIn = () => {
  const [isPending, setIsPending] = useState(false);

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
    console.log("Sign In action response:: ", res);
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
