"use client";

import Link from "next/link";
import Button from "@/app/shared/ui/Button";
import Input from "@/app/shared/ui/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  AuthPageContent,
  FormContainer,
} from "@/app/features/auth/ui/AuthComponents";
import { useEmailValidation } from "../hooks/useEmailValidation";
import { EmailValidationVariant } from "../types/email-validation-request";

const textByVariant: Record<
  EmailValidationVariant,
  { title: string; button: string; description: string }
> = {
  verification: {
    title: "Email Verification",
    button: "Send Verification Email",
    description: "Enter your email to receive a verification link.",
  },
  "reset-password": {
    title: "Reset Password",
    button: "Send Reset Link",
    description:
      "Enter the email address associated with your account and we'll send a reset link.",
  },
};

const EmailValidation = ({ variant }: { variant: EmailValidationVariant }) => {
  const {
    isPending,
    handleFormSubmit,
    formData,
    setFormData,
    validationErrors,
    isFormValid,
  } = useEmailValidation(variant);

  const content = textByVariant[variant];

  return (
    <AuthPageContainer>
      <FormContainer>
        <AuthPageCaption>{content.title}</AuthPageCaption>
        <AuthPageContent>{content.description}</AuthPageContent>

        <form
          onSubmit={handleFormSubmit}
          className="flex w-full flex-col gap-4"
        >
          <div className="w-full">
            <Input
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              error={validationErrors.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            >
              Email
            </Input>
          </div>

          <div className="mt-2 w-full">
            <Button width="full" loading={isPending} disabled={!isFormValid}>
              {content.button}
            </Button>
          </div>

          <h1 className="mt-2 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/auth/login"
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

export default EmailValidation;
