"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { FormEvent } from "react";
import { useToast } from "@/app/hooks/useToast";
import { AnimatePresence } from "framer-motion";
import { resendVerificationEmail } from "@/utils/FetchAPI";
import { updateAuthStatus } from "@/app/auth/helper";
import { useInputData } from "@/app/hooks/useInputData";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { inputData, handleInputChange } = useInputData("emailVerify");
  const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
    toastType: "success",
    message: null,
  });

  const mutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: (data: AxiosResponse) => {
      addToastMessage("success", data.data.message);
      setTimeout(() => {
        removeToastMessage("success", null);
        router.push("/");
        updateAuthStatus(dispatch);
      }, 4000);
    },
    onError: (error: AxiosResponse) => {
      addToastMessage("error", error.data.message);
      setTimeout(() => {
        removeToastMessage("error", null);
      }, 4000);
    },
  });

  const onsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(inputData.email);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <AnimatePresence>
        {mutation.isSuccess && <ToastComponent />}
      </AnimatePresence>
      <form
        onSubmit={onsubmit}
        className="relative h-[70%] w-[60%] bg-white rounded-lg flex flex-col justify-center items-center gap-1 p-8"
      >
        <Image
          src={"/Gear.png"}
          alt="logo"
          width={180}
          height={120}
          className="absolute -top-8 left-0 "
        />
        <div
          id="header"
          className="h-1/4 flex justify-center items-center text-4xl font-bold"
        >
          {/* Logo */}
          <h1>Reset Password</h1>
        </div>

        <p className="w-2/4 mb-4 -ml-4">
          Enter the email address associated with your account and we’ll send an
          email with instructions to reset password
        </p>
        <div className="mb-4">
          <Input
            name="email"
            onChange={handleInputChange}
            type="email"
            placeholder="Enter your email address"
          >
            Email
          </Input>
        </div>
        <Button loading={mutation.isPending} provider="manual">
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
    </div>
  );
};

export default Page;
