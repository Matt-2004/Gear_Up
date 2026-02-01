"use client";

import { useToast } from "@/app/hooks/useToast";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  AuthPageContent,
  FormContainer,
} from "@/components/Navbar/common";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { submit, type ResetPasswordActionState } from "./action";

const initialState: ResetPasswordActionState = {
  ok: false,
  toastType: "info",
  message: null,
  redirectTo: null,
};

const ResetPassword = () => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submit, initialState);
  const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
    toastType: "success",
    message: null,
  });

  useEffect(() => {
    if (!state?.message) return;

    addToastMessage(state.toastType, state.message);
    new Promise((res) =>
      setTimeout(() => {
        removeToastMessage();
        router.push("/");
      }, 4000),
    );
  }, [pending]);

  return (
    <AuthPageContainer>
      <ToastComponent />
      <FormContainer>
        <AuthPageCaption>Create new password</AuthPageCaption>
        <AuthPageContent>
          Your new password must be different from previous and password.
        </AuthPageContent>
        <form
          action={formAction}
          className="flex w-full flex-col items-center justify-center gap-4"
        >
          <Input
            name="newPassword"
            required
            minLength={8}
            autoComplete="new-password"
            type="password"
            placeholder="Enter your new password"
          >
            New Password
          </Input>
          <Input
            name="confirmedPassword"
            required
            minLength={8}
            type="password"
            placeholder="Re-enter your new password"
          >
            Confirm Password
          </Input>
          <Button provider="manual" loading={pending} disabled={pending}>
            Change Password
          </Button>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default ResetPassword;
