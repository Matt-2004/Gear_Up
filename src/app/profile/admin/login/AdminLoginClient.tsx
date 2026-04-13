"use client";

import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  FormContainer,
} from "@/app/auth/component";
import { useToast } from "@/app/hooks/useToast";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { adminLoginAction, initialAdminLoginActionState } from "./action";

const AdminLoginClient = () => {
  const router = useRouter();
  const { addToastMessage } = useToast({ toastType: null, message: null });

  const [state, formAction, isPending] = useActionState(
    adminLoginAction,
    initialAdminLoginActionState,
  );

  useEffect(() => {
    if (state.status === "idle" || state.submittedAt === 0) return;

    if (state.status === "error") {
      addToastMessage("error", state.message || "Login failed.", 5000);
      return;
    }

    addToastMessage("success", state.message || "Login successful!", 2500);
    const timeout = window.setTimeout(() => {
      router.push("/profile/admin?tab=dashboard");
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [state.status, state.message, state.submittedAt, addToastMessage, router]);

  return (
    <AuthPageContainer>
      <FormContainer>
        <AuthPageCaption>Admin Login</AuthPageCaption>
        <form
          action={formAction}
          id="body"
          className="mb-4 flex w-full flex-col items-center justify-center gap-8"
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Input
              name="email"
              required
              autoComplete="email"
              type="email"
              placeholder="example@gmail.com"
            >
              Email
            </Input>

            <Input
              name="password"
              required
              minLength={8}
              autoComplete="current-password"
              type="password"
              placeholder="Password (mininum at least 8 characters)"
            >
              Password
            </Input>
          </div>

          <Button loading={isPending}>Login</Button>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default AdminLoginClient;
