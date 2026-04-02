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
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { RegisterSchema } from "../typeSchema";
import { useAuthForm } from "../useAuthForm";
import { useAuthToast } from "../hooks/useAuthToast";
import { submit } from "./action";

const Register = () => {
  const router = useRouter();

  const { ToastComponent, showSuccessToast, showErrorToast } = useAuthToast({
    onSuccess: { message: "Registration successful! Redirecting to login..." },
    onError: { message: "Registration failed. Please try again." },
  });

  const {
    formData,
    setFormData,
    errors,
    handleSubmit: handleFormSubmit,
    isPending,
  } = useAuthForm(
    {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    RegisterSchema,
    submit,
  );

  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      await handleFormSubmit(formData);
      showSuccessToast();
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (e) {
      showErrorToast(e instanceof Error ? e.message : "An error occurred");
    }
  };

  return (
    <AuthPageContainer>
      <AnimatePresence>
        <ToastComponent />
      </AnimatePresence>

      <FormContainer>
        <AuthPageCaption>Create an account</AuthPageCaption>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          id="body"
          className="flex w-full flex-col gap-4"
        >
          <div className="flex w-full gap-4 flex-col sm:flex-row">
            <div className="flex-1 w-full">
              <Input
                ref={firstNameRef}
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                error={errors.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              >
                First Name
              </Input>
            </div>
            <div className="flex-1 w-full">
              <Input
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                error={errors.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
              >
                Last Name
              </Input>
            </div>
          </div>

          <div className="w-full">
            <Input
              name="username"
              type="text"
              placeholder="John_Doe"
              value={formData.username}
              error={errors.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            >
              Username
            </Input>
          </div>

          <div className="w-full">
            <Input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="example@gmail.com"
              value={formData.email}
              error={errors.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            >
              Email
            </Input>
          </div>

          <div className="w-full">
            <Input
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              placeholder="Enter your password (minimum 8 characters)"
              value={formData.password}
              error={errors.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
            >
              Password
            </Input>
          </div>

          <div className="w-full">
            <Input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            >
              Confirm Password
            </Input>
          </div>

          <div className="mt-1 flex w-full select-none items-center gap-2">
            <input
              required
              name="agreeToTerms"
              id="policy"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="policy"
              className="text-sm cursor-pointer text-gray-600"
            >
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <div className="mt-2 w-full">
            <Button width="full" loading={isPending}>
              Register
            </Button>
          </div>

          <h1 className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href={"/auth/login"}
              className="font-medium text-primary hover:underline hover:underline-offset-4"
            >
              Login Now
            </Link>
          </h1>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default Register;
