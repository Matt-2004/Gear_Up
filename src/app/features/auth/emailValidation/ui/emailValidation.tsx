"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/app/shared/ui/Button";
import Input from "@/app/shared/ui/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
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
  } = useEmailValidation();

  const content = textByVariant[variant];

  return (
    <AuthPageContainer>
      <div
        className="w-full max-w-md rounded-3xl border p-8"
        style={{
          background: "#111711",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div className="mb-6 flex justify-end">
          <Image
            src="/logo.png"
            alt="Gear Up"
            width={150}
            height={34}
            priority
          />
        </div>

        <AuthPageCaption>{content.title}</AuthPageCaption>
        <p className="mb-6 mt-2 text-sm text-[#A5A5A5]">
          {content.description}
        </p>

        <form
          onSubmit={handleFormSubmit}
          className="flex w-full flex-col gap-4
            [&_label]:!text-[#A5A5A5]
            [&_input]:!bg-[#1A221A]
            [&_input]:!text-white
            [&_input]:!border-gray-600
            [&_input]:!placeholder-[#8A8A8A]
            [&_input:focus]:!outline-none
            [&_input:focus]:!ring-0
            [&_input:focus]:!shadow-[0_0_0_4px_rgba(95,212,74,0.12)]
            [&_svg]:!text-[#8A8A8A]
            [&_svg:hover]:!text-[#A5A5A5]
          "
        >
          <div className="w-full">
            <Input
              data-testid="email"
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
            <Button
              width="full"
              loading={isPending}
              disabled={!isFormValid}
              className="!bg-primary-600 !text-white !shadow-[0_4px_6px_rgba(0,0,0,0.15)] !transition-all !duration-200 hover:!bg-primary-600/80 hover:!shadow-[0_4px_8px_rgba(0,0,0,0.15)] active:!scale-[0.98]"
            >
              {content.button}
            </Button>
          </div>

          <h1 className="mt-2 text-center text-sm text-[#A5A5A5]">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#5FD44A] transition-colors hover:underline hover:underline-offset-4"
            >
              Login Now
            </Link>
          </h1>
        </form>
      </div>
    </AuthPageContainer>
  );
};

export default EmailValidation;
