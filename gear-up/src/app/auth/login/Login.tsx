"use client";

import { useToast } from "@/app/hooks/useToast";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  FormContainer,
} from "../component";
import { authCookieIntegration } from "@/utils/Auth/authCookieIntegration";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LoginSchema } from "../typeSchema";
import { useAuthForm } from "../useAuthForm";

const Login = () => {
  
  async function submit(formData: FormData) {
    const usernameOrEmail = formData.get("usernameOrEmail") as string;
    const password = formData.get("password") as string;

    // 1. Authenticate and set access_token / refresh_token cookies
    try {
      await authCookieIntegration(`/api/auth/login`, {
          usernameOrEmail,
          password,
        }
      )
      } catch (error) {
        console.error("fetching authCookieIntegration failed: ", error);
        throw error;
      }
  }
  const {ToastComponent, formData, setFormData, errors, handleSubmit, isButtonActive, isPending} = useAuthForm(
    {
      usernameOrEmail: "",
      password: "",
      rememberMe: false,
    },
    LoginSchema,
    submit
  );
  // Validate on input change with useEffect
  



  return (
    <AuthPageContainer>
      <AnimatePresence>
        <ToastComponent />
      </AnimatePresence>

      <FormContainer>
        <AuthPageCaption>Login to your account</AuthPageCaption>
        <form
          action={handleSubmit}
          id="body"
          className="mb-4 flex w-full flex-col items-center justify-center gap-4"
        >
          <div className="w-full max-w-100">
            <Input
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
            {errors.usernameOrEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.usernameOrEmail}
              </p>
            )}
          </div>

          <div className="w-full max-w-100">
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div className="mb-4 flex w-full max-w-100 items-center justify-between">
            <div className="flex h-full items-center gap-2">
              <input required id="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={(e) => setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))} />
              <label htmlFor="rememberMe" className="">
                Remember me
              </label>
            </div>
            <Link
              href="/auth/email/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            provider={"manual"}
            width="full"
            disabled={!isButtonActive}
            loading={isPending}
          >
            Login
          </Button>
          <h1>
            Do not have an account?{" "}
            <Link
              href={"/auth/register"}
              className="font-medium text-blue-600 hover:underline hover:underline-offset-4"
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
