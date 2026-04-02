"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  FormContainer,
} from "../component";
import { authAPI } from "@/utils/Auth/authAPI";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LoginSchema } from "../typeSchema";
import { useAuthForm } from "../useAuthForm";
import { useAuthToast } from "../hooks/useAuthToast";
import { useUserData } from "@/Context/UserDataContext";
import {
  getClientAccessToken,
  setSessionAccessToken,
} from "@/utils/Auth/clientTokenUtils";

const Login = () => {
  const router = useRouter();
  const { refreshUserData } = useUserData();

  const { ToastComponent, showSuccessToast, showErrorToast, hideToast } =
    useAuthToast({
      onSuccess: { message: "Login successful! Redirecting to dashboard..." },
      onError: { message: "Invalid credentials. Please try again." },
    });

  // authAPI --> return data || error
  // submit --> get data and catch error
  // handleSubmit --> get data and catch error

  // authAPI --> return data || error
  // submit --> get data and rethrow error
  // handleSubmit --> catch error and show relevant toast
  async function action(formData: FormData) {
    const usernameOrEmail = formData.get("usernameOrEmail") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "on";

    await authAPI(
      `/api/auth/login`,
      {
        usernameOrEmail,
        password,
      },
      { rememberMe },
    );
  }

  const {
    formData,
    setFormData,
    handleSubmit: handleFormSubmit,
    isPending,
  } = useAuthForm(
    {
      usernameOrEmail: "",
      password: "",
      rememberMe: false,
    },
    LoginSchema,
    action,
  );

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      await handleFormSubmit(formData);

      const rememberMe = formData.get("rememberMe") === "on";

      // Dynamic token handling:
      // - rememberMe=true  -> clear sessionStorage token (use persistent cookie)
      // - rememberMe=false -> mirror token in sessionStorage for session-only usage
      if (rememberMe) {
        setSessionAccessToken("");
      } else {
        const accessToken = await getClientAccessToken();
        setSessionAccessToken(accessToken);
      }

      // Rehydrate user context immediately after successful login so
      // navbar switches from Login button to Profile icon without refresh.
      await refreshUserData();

      showSuccessToast();
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "An error occurred");

      hideToast();
      setFormData({
        usernameOrEmail: "",
        password: "",
        rememberMe: false,
      });
    }
  };

  return (
    <AuthPageContainer>
      <AnimatePresence>
        <ToastComponent />
      </AnimatePresence>

      <FormContainer>
        <div>
          <AuthPageCaption>Login</AuthPageCaption>
          <h3 className="text-gray-500 text-sm">
            Please login to your account to continue
          </h3>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          id="body"
          className="flex w-full flex-col gap-4"
        >
          <div className="w-full">
            <Input
              ref={usernameRef}
              name="usernameOrEmail"
              autoComplete="email"
              type="text"
              placeholder="example@gmail.com or matthew"
              value={formData.usernameOrEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  usernameOrEmail: e.target.value,
                }))
              }
            >
              Email or User Name
            </Input>
          </div>

          <div className="w-full">
            <Input
              name="password"
              minLength={8}
              autoComplete="current-password"
              type="password"
              placeholder="Password (mininum at least 8 characters)"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            >
              Password
            </Input>
          </div>
          <div className="flex w-full items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: e.target.checked,
                  }))
                }
              />
              <label htmlFor="rememberMe" className="text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              href="/auth/email/reset-password"
              className="font-medium text-primary hover:underline hover:underline-offset-2"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="mt-2 w-full">
            <Button width="full" loading={isPending}>
              Login
            </Button>
          </div>
          <h1 className="mt-2 text-center text-sm text-gray-600">
            Do not have an account?{" "}
            <Link
              href={"/auth/register"}
              className="font-medium text-primary hover:underline hover:underline-offset-4"
            >
              Register Now
            </Link>
          </h1>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default Login;
