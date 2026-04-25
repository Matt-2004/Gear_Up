"use client";

import Button from "@/app/shared/ui/Button";
import Input from "@/app/shared/ui/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  AuthPageContent,
  FormContainer,
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
      <FormContainer>
        <AuthPageCaption>Create new password</AuthPageCaption>
        <AuthPageContent>
          Your new password must be different from your previous password.
        </AuthPageContent>

        <form
          onSubmit={handleFormSubmit}
          className="flex w-full flex-col gap-4"
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
            <Button width="full" loading={isPending} disabled={!isFormValid}>
              Change Password
            </Button>
          </div>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default ResetPassword;
