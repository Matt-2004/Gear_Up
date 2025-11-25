"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { FormEvent } from "react";
import Input from "@/components/Common/Input";
import Button from "@/components/Common/Button";
import { useToast } from "@/app/hooks/useToast";
import { AnimatePresence } from "framer-motion";
import { adminLogin } from "@/utils/FetchAPI";
import { useInputData } from "@/app/hooks/useInputData";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateAuthStatus } from "@/app/auth/helper";

interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  status: number;
}

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { inputData, handleInputChange } = useInputData("admin_login");
  const { ToastComponent, addToastMessage, removeToastMessage } = useToast({
    toastType: "success",
    message: null,
  });

  const mutation = useMutation({
    mutationFn: adminLogin,

    onSuccess: (data: AxiosResponse<LoginResponse>) => {
      addToastMessage("success", data.data.message);
      setTimeout(() => {
        removeToastMessage("success", null);
        router.push("/profile/admin");
        updateAuthStatus(dispatch);
      }, 4000);
    },
    onError: (error: AxiosResponse<LoginResponse>) => {
      addToastMessage("error", error.data.message);
      setTimeout(() => {
        removeToastMessage("error", null);
      }, 4000);
    },
  });

  const onsubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      email: inputData.email,
      password: inputData.password,
    });
  };

  return (
    <div className="relative h-screen w-screen flex justify-center items-center flex-col">
      <AnimatePresence>
        {mutation.isSuccess && <ToastComponent />}
      </AnimatePresence>
      <form
        onSubmit={onsubmit}
        className="relative h-[70%] w-[60%] bg-white rounded-lg flex flex-col justify-center items-center gap-1 p-8"
      >
        <div
          id="header"
          className="h-1/4 flex justify-center items-center text-4xl font-bold"
        >
          {/* Logo */}
          <h1>Login to your account</h1>
        </div>
        <div
          id="body"
          className="flex flex-col justify-center items-center gap-4 mb-4"
        >
          <Input
            name="email"
            required
            autoComplete="email"
            onChange={handleInputChange}
            type="email"
            placeholder="example@gmail.com or matthew"
          >
            Email or User Name
          </Input>

          <Input
            name="password"
            required
            minLength={8}
            autoComplete="current-password"
            onChange={handleInputChange}
            type="password"
            placeholder="Password (mininum at least 8 characters)"
          >
            Password
          </Input>
        </div>
        <div className="w-[30rem] flex justify-between items-center mb-4">
          <div className="flex h-full gap-2 items-center">
            <input
              onChange={handleInputChange}
              id="rememberMe"
              type="checkbox"
            />
            <label htmlFor="rememberMe" className="">
              Remember me
            </label>
          </div>
          <Link
            href="/auth/forgotpassword/"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <Button loading={mutation.isPending} provider={"manual"}>
          Login
        </Button>

        <h1>
          Do not have an account?{" "}
          <Link
            href={"/auth/register"}
            className="text-blue-600 font-medium hover:underline hover:underline-offset-4"
          >
            Register Now
          </Link>
        </h1>
      </form>
    </div>
  );
};

export default Page;
