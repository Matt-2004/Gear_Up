"use client";

import { useRouter } from "next/navigation";
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
import { useAuthToast } from "../../hooks/useAuthToast";
import { ResetPasswordSchema } from "../../typeSchema";
import { AnimatePresence } from "framer-motion";

const ResetPassword = () => {
  const router = useRouter();

  const { ToastComponent, showSuccessToast, showErrorToast } = useAuthToast({
    onSuccess: {
      message: "Password changed successfully! Redirecting to login...",
      redirectPath: "/auth/login",
    },
    onError: {
      message: "Failed to reset password. Please try again.",
    },
  });

  const {
    handleSubmit: handleFormSubmit,
    isButtonActive,
    isPending,
    errors,
    formData,
    setFormData,
  } = useAuthForm(
    { newPassword: "", confirmePassword: "" },
    ResetPasswordSchema,
    submit,
  );

  const handleSubmit = async (formData: FormData) => {
    try {
      await handleFormSubmit(formData);
      showSuccessToast();
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      showErrorToast();
    }
  };

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
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.currentTarget));
          }}
          className="flex w-full flex-col gap-4"
        >
          <div className="w-full">
            <Input
              name="newPassword"
              required
              minLength={8}
              autoComplete="new-password"
              type="password"
              placeholder="Enter your new password (minimum 8 characters)"
              value={formData.newPassword}
              error={errors.newPassword}
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
              name="confirmePassword"
              required
              minLength={8}
              autoComplete="new-password"
              type="password"
              placeholder="Re-enter your new password"
              value={formData.confirmePassword}
              error={errors.confirmePassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmePassword: e.target.value,
                }))
              }
            >
              Confirm Password
            </Input>
          </div>

          <div className="mt-2 w-full">
            <Button width="full" loading={isPending} disabled={!isButtonActive}>
              Change Password
            </Button>
          </div>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default ResetPassword;
