"use client";

import { useEffect, useRef } from "react";
import Button from "@/app/shared/ui/Button";
import Input from "@/app/shared/ui/Input";
import { AuthPageCaption, AuthPageContainer } from "../../ui/AuthComponents";
import Link from "next/link";
import Image from "next/image";
import { useSignIn } from "../hooks/useSignIn";

const Login = () => {
  const { isPending, handleFormSubmit, formData, setFormData } = useSignIn();

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  return (
    <AuthPageContainer>
      <div className="relative min-h-dvh w-screen max-w-none overflow-hidden rounded-none bg-white shadow-none sm:min-h-155 sm:w-full sm:max-w-155 sm:rounded-3xl sm:shadow-2xl sm:shadow-slate-300/30 lg:max-w-5xl">
        <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-white sm:min-h-155 sm:rounded-3xl lg:grid-cols-2">
          <div className="relative hidden h-full lg:block">
            <Image
              src={"/carImages/9.jpg"}
              alt="Luxury car"
              fill
              loading="lazy"
              blurDataURL="/carImages/9.jpg"
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={70}
              placeholder="blur"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60" />
            <div className="absolute right-8 bottom-8 left-8 rounded-2xl border border-white/25 bg-white/15 p-6 shadow-xl backdrop-blur-md">
              <p className="text-sm font-medium tracking-wide text-white/90 uppercase">
                Welcome Back to Gear Up
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Your next drive starts here.
              </h2>
              <p className="mt-2 text-sm text-white/85">
                Sign in to continue exploring listings, appointments, and your
                personalized dashboard.
              </p>
            </div>
          </div>

          <div className="flex h-full bg-transparent sm:bg-gray-50 sm:p-4 md:p-5 lg:p-0">
            <div className="flex h-full w-full flex-col justify-center bg-white p-6 sm:rounded-2xl sm:border sm:border-gray-200/80 sm:p-8 sm:shadow-xl sm:shadow-slate-900/10 lg:rounded-none lg:border-0 lg:border-l lg:border-gray-100 lg:shadow-none lg:p-10">
              <div className="mb-5">
                <AuthPageCaption>Welcome back 👋</AuthPageCaption>
                <h3 className="mt-1 text-sm leading-relaxed text-gray-600">
                  Sign in to continue to your account and pick up where you left
                  off.
                </h3>
              </div>

              <form
                onSubmit={handleFormSubmit}
                id="body"
                className="flex w-full flex-col gap-4"
              >
                <div className="w-full">
                  <Input
                    ref={usernameRef}
                    name="usernameOrEmail"
                    autoComplete="email"
                    type="text"
                    placeholder="example@gmail.com or matthew"
                    value={formData.usernameOrEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        usernameOrEmail: e.target.value,
                      }))
                    }
                  >
                    Email or User Name
                  </Input>
                </div>

                <div className="w-full">
                  <Input
                    name="password"
                    minLength={8}
                    autoComplete="current-password"
                    type="password"
                    placeholder="Password (mininum at least 8 characters)"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  >
                    Password
                  </Input>
                </div>

                <div className="flex w-full items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rememberMe: e.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="rememberMe" className="text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/email/reset-password"
                    className="font-medium text-primary hover:underline hover:underline-offset-2"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="mt-2 w-full">
                  <Button width="full" loading={isPending}>
                    Login
                  </Button>
                </div>

                <h1 className="mt-2 text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-primary hover:underline hover:underline-offset-4"
                  >
                    Register Now
                  </Link>
                </h1>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthPageContainer>
  );
};

export default Login;
