"use client";

import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  AuthPageContent,
  FormContainer,
} from "@/app/auth/component";
import { useResetPassword } from "../hooks/useResetPassword";

const ResetPassword = () => {
  const {
    isPending,
    handleFormSubmit,
    formData,
    setFormData,
    validationErrors,
    isFormValid,
  } = useResetPassword();

  return (
    <AuthPageContainer>
      <FormContainer>
        <AuthPageCaption>Create new password</AuthPageCaption>
        <AuthPageContent>
          Your new password must be different from your previous password.
        </AuthPageContent>

        <form onSubmit={handleFormSubmit} className="flex w-full flex-col gap-4">
          <div className="w-full">
            <Input
              name="newPassword"
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
                  newPassword: e.target.value,
                }))
              }
            >
              New Password
            </Input>
          </div>

          <div className="w-full">
            <Input
              name="confirmPassword"
              required
              minLength={8}
              autoComplete="new-password"
              type="password"
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              error={validationErrors.confirmPassword}
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
