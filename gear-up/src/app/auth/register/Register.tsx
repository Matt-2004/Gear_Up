"use client";

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
import { RegisterSchema } from "../typeSchema";
import { useAuthForm } from "../useAuthForm";
import { submit } from "./action";

const Register = () => {
  

  const {
    ToastComponent,
    formData,
    setFormData,
    errors,
    handleSubmit,
    isButtonActive,
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
    submit
  );

  return (
    <AuthPageContainer>
      <AnimatePresence>
        <ToastComponent />
      </AnimatePresence>

      <FormContainer>
        <AuthPageCaption>Create an account</AuthPageCaption>
        <form
          action={handleSubmit}
          id="body"
          className="mb-4 flex flex-col items-center justify-center gap-4"
        >
          <div className="flex w-full max-w-100 gap-2">
            <div className="flex-1">
              <Input
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
              >
                First Name
              </Input>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="flex-1">
              <Input
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
              >
                Last Name
              </Input>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="w-full max-w-100">
            <Input
              name="username"
              type="text"
              placeholder="John_Doe"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            >
              Username
            </Input>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div className="w-full max-w-100">
            <Input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            >
              Email
            </Input>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="w-full max-w-100">
            <Input
              name="password"
              type="password"
              minLength={8}
              autoComplete="new-password"
              placeholder="Enter your password (minimum 8 characters)"
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

          <div className="w-full max-w-100">
            <Input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            >
              Confirm Password
            </Input>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex w-full max-w-100 gap-2">
            <input required name="agreeToTerms" id="policy" type="checkbox" />
            <label htmlFor="policy" className="text-sm">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <Button
            provider="manual"
            width="full"
            loading={isPending}
            disabled={!isButtonActive}
          >
            Register
          </Button>
          <h1 className="text-sm">
            Already have an account?{" "}
            <Link
              href={"/auth/login"}
              className="font-medium text-blue-600 hover:underline hover:underline-offset-4"
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
