"use client";

import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  AuthPageContent,
  FormContainer,
} from "../../component";
import { submit } from "./action";
import { useAuthForm } from "../../useAuthForm";
import { ResetPasswordSchema } from "../../typeSchema";
import { AnimatePresence } from "framer-motion";

const ResetPassword = () => {
  const {
    handleSubmit,
    isButtonActive,
    isPending,
    errors,
    formData,
    setFormData,
    ToastComponent,
  } = useAuthForm(
    { newPassword: "", confirmePassword: "" },
    ResetPasswordSchema,
    submit
  );

  return (
    <AuthPageContainer>
      <AnimatePresence>
        <ToastComponent />
      </AnimatePresence>
      <FormContainer>
        <AuthPageCaption>Create new password</AuthPageCaption>
        <AuthPageContent>
          Your new password must be different from your previous password.
        </AuthPageContent>
        <form
          action={handleSubmit}
          className="mb-4 flex w-full flex-col items-center justify-center gap-4"
        >
          <div className="w-full max-w-100">
            <Input
              name="newPassword"
              required
              minLength={8}
              autoComplete="new-password"
              type="password"
              placeholder="Enter your new password (minimum 8 characters)"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            >
              New Password
            </Input>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div className="w-full max-w-100">
            <Input
              name="confirmePassword"
              required
              minLength={8}
              autoComplete="new-password"
              type="password"
              placeholder="Re-enter your new password"
              value={formData.confirmePassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmePassword: e.target.value,
                }))
              }
            >
              Confirm Password
            </Input>
            {errors.confirmePassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmePassword}
              </p>
            )}
          </div>

          <Button
            provider="manual"
            width="full"
            loading={isPending}
            disabled={!isButtonActive}
          >
            Change Password
          </Button>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default ResetPassword;
