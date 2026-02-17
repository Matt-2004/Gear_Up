"use client";

import { useToast } from "@/app/hooks/useToast";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  FormContainer,
} from "@/components/Navbar/common";
import { useUserData } from "@/Context/UserDataContext";
import { authCookieIntegration } from "@/lib/authCookieIntegration";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";



const loginSchema = z.object({
  usernameOrEmail: z.email({
    message: "Invalid email format, end with @gmail.com, @yahoo.com, etc.",
  }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password is too long")
    .regex(/[a-z]/, "- Must Contain at least one lowercase letter")
    .regex(/[0-9]/, "- Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "- Must contain at least one symbol"),
});

const Login = () => {
  const router = useRouter();
  const { refreshUser } = useUserData();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    usernameOrEmail?: string;
    password?: string;
  }>({});
  const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
    toastType: "success",
    message: null,
  });

  async function submit(formData: FormData) {

    const usernameOrEmail = formData.get("usernameOrEmail") as string;
    const password = formData.get("password") as string;

    // 1. Authenticate and set access_token / refresh_token cookies
    const res = await authCookieIntegration(`/api/auth/login`, {
      usernameOrEmail,
      password,
    });

    return res;
  }

  // Validate on input change with useEffect
  useEffect(() => {
    const validationResult = loginSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors = z.flattenError(validationResult.error).fieldErrors;
      setErrors({
        usernameOrEmail: fieldErrors.usernameOrEmail?.[0],
        password: fieldErrors.password?.[0],
      });
    } else {
      setErrors({});
    }
  }, [formData]);

  const handleSubmit = (formDataObj: FormData) => {
    const rawData = {
      usernameOrEmail: formDataObj.get("usernameOrEmail") as string,
      password: formDataObj.get("password") as string,
    };

    const validationResult = loginSchema.safeParse(rawData);

    if (!validationResult.success) {
      return;
    }

    try {
      submit(formDataObj)
        .then((res) => {
          addToastMessage(
            res.ok ? "success" : "error",
            res.ok ? "Login successful! Redirecting..." : "Login failed. Please check your credentials and try again.",
          );
        }).then(() => {
          refreshUser()
        }).then(() => {
          router.push("/")
        })
        .catch((error) => {
          addToastMessage(
            "error",
            error.message || "Login failed.",
          );
        });
    } catch (error) {
      addToastMessage(
        "error",
        "An unexpected error occurred. Please try again later.",
      );
    }
  };


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
              <input required id="rememberMe" type="checkbox" />
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

        <Button provider="google">Login with Google</Button>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default Login;
