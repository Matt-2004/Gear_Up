"use client";

import Image from "next/image";
import Button from "@/app/shared/ui/Button";
import Input from "@/app/shared/ui/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
} from "@/app/features/auth/ui/AuthComponents";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "../hooks/useResetPassword";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    isPending,
    handleFormSubmit,
    formData,
    setFormData,
    validationErrors,
    isFormValid,
  } = useResetPassword(token);

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

        <AuthPageCaption>Create new password</AuthPageCaption>
        <p className="mb-6 mt-2 text-sm text-[#A5A5A5]">
          Your new password must be different from your previous password.
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
              name="newPassword"
              data-testid="new-password"
              required
              minLength={8}
              autoComplete="new-password"
              type="password"
              placeholder="Enter your new password (minimum 8 characters)"
              value={formData.newPassword}
              error={validationErrors.newPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  newPassword: e.target.value.trim(),
                }))
              }
            >
              New Password
            </Input>
          </div>

          <div className="w-full">
            <Input
              data-testid="confirm-password"
              name="confirmedPassword"
              required
              minLength={8}
              autoComplete="new-password"
              type="password"
              placeholder="Re-enter your new password"
              value={formData.confirmedPassword}
              error={validationErrors.confirmedPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmedPassword: e.target.value.trim(),
                }))
              }
            >
              Confirm Password
            </Input>
          </div>

          <div className="mt-2 w-full">
            <Button
              width="full"
              loading={isPending}
              disabled={!isFormValid}
              className="!bg-primary-600 !text-white !shadow-[0_4px_6px_rgba(0,0,0,0.15)] !transition-all !duration-200 hover:!bg-primary-600/80 hover:!shadow-[0_4px_8px_rgba(0,0,0,0.15)] active:!scale-[0.98]"
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </AuthPageContainer>
  );
};

export default ResetPassword;
