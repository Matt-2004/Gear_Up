"use client";

import { useToast } from "@/app/hooks/useToast";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  AuthPageContent,
  FormContainer,
} from "../component";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { submit as submitReset } from "./reset-password/action";
import { submit as submitVerification } from "./verification/action";
import { useAuthForm } from "../useAuthForm";
import { sendEmailSchema } from "../typeSchema";

type EmailVariant = "verification" | "reset-password";

type EmailActionState = {
  ok: boolean;
  toastType: "success" | "error" | "info";
  message: string | null;
  redirectTo?: string | null;
};

const initialState: EmailActionState = {
  ok: false,
  toastType: "info",
  message: null,
  redirectTo: null,
};

const EmailSend = ({ variant }: { variant: EmailVariant }) => {
  const router = useRouter();
  const action = variant === "verification" ? submitVerification : submitReset;
 

  const {ToastComponent, handleSubmit, isButtonActive, isPending} = useAuthForm({email: ""}, sendEmailSchema, action);

  return (
    <AuthPageContainer>
      <AnimatePresence>
        <ToastComponent />
      </AnimatePresence>
      <FormContainer>
        <AuthPageCaption>Email Verficiation</AuthPageCaption>
        <AuthPageContent>
          Enter the email address associated with your account and we’ll send an
          email with instructions to reset password
        </AuthPageContent>
        <form
          action={handleSubmit}
          className="flex w-full flex-col items-center justify-center gap-4"
        >
          <Input
            name="email"
            type="email"
            placeholder="Enter your email address"
          >
            Email
          </Input>
          <Button provider="manual" loading={isPending} disabled={!isButtonActive}>
            Send Reset Link
          </Button>
          <h1>
            Remember your password?{" "}
            <Link
              href={"/auth/login"}
              className="font-medium text-blue-500 hover:underline hover:underline-offset-2"
            >
              Login Now
            </Link>
          </h1>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default EmailSend;
