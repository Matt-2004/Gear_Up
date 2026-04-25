"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/app/shared/ui/Button";
import Input from "@/app/shared/ui/Input";
import { AuthPageCaption, AuthPageContainer } from "../../ui/AuthComponents";
import Link from "next/link";

import Image from "next/image";

import { useSignUp } from "../hooks/useSignUp";

const Register = () => {
  const {
    formData,
    isPending,
    handleFormSubmit,
    setFormData,
    validationErrors,
    isFormValid,
  } = useSignUp();

  const firstNameRef = useRef<HTMLInputElement>(null);
  // handle useRef
  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  return (
    <AuthPageContainer>
      <div className="relative min-h-dvh w-screen max-w-none overflow-hidden rounded-none bg-white shadow-none sm:min-h-155 sm:w-full sm:max-w-155 sm:rounded-3xl sm:shadow-2xl sm:shadow-slate-300/30 lg:max-w-5xl">
        <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-white sm:min-h-155 sm:rounded-3xl lg:grid-cols-2">
          <div className="relative hidden h-full lg:block">
            <Image
              src={"/carImages/10.jpg"}
              alt="Sports car"
              fill
              loading="lazy"
              blurDataURL="/carImages/10.jpg"
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={75}
              placeholder="blur"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60" />
            <div className="absolute right-8 bottom-8 left-8 rounded-2xl border border-white/25 bg-white/15 p-6 shadow-xl backdrop-blur-md">
              <h2 className="mt-2 text-2xl font-bold text-white">
                Join Gear Up Today
              </h2>
              <p className="mt-2 text-sm text-white/85">
                Save your favorites, connect with dealers, and unlock a
                personalized car discovery experience.
              </p>
            </div>
          </div>

          <div className="flex h-full bg-transparent sm:bg-gray-50 sm:p-4 md:p-5 lg:p-0">
            <div className="flex h-full w-full flex-col justify-center bg-white p-6 sm:rounded-2xl sm:border sm:border-gray-200/80 sm:p-8 sm:shadow-xl sm:shadow-slate-900/10 lg:rounded-none lg:border-0 lg:border-l lg:border-gray-100 lg:shadow-none lg:p-10">
              <div className="mb-5">
                <AuthPageCaption>Create your account</AuthPageCaption>
                <h3 className="mt-1 text-sm leading-relaxed text-gray-600">
                  Start your journey with Gear Up and discover the right car
                  with confidence.
                </h3>
                <div className="mt-2 text-xs text-gray-500">
                  Already with us?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:underline hover:underline-offset-2"
                  >
                    Sign in here
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/"
                    className="font-medium text-primary hover:underline hover:underline-offset-2"
                  >
                    go back home
                  </Link>
                  .
                </div>
              </div>

              <form
                onSubmit={handleFormSubmit}
                id="body"
                className="flex w-full flex-col gap-4"
              >
                <div className="flex w-full flex-col gap-4 sm:flex-row">
                  <div className="w-full flex-1">
                    <Input
                      data-testid="first-name"
                      ref={firstNameRef}
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      error={validationErrors.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value.trim(),
                        }))
                      }
                    >
                      First Name
                    </Input>
                  </div>
                  <div className="w-full flex-1">
                    <Input
                      data-testid="last-name"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      error={validationErrors.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value.trim(),
                        }))
                      }
                    >
                      Last Name
                    </Input>
                  </div>
                </div>

                <div className="w-full">
                  <Input
                    data-testid="username"
                    name="username"
                    type="text"
                    placeholder="John_Doe"
                    value={formData.username}
                    error={validationErrors.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value.trim(),
                      }))
                    }
                  >
                    Username
                  </Input>
                </div>

                <div className="w-full">
                  <Input
                    data-testid="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    error={validationErrors.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value.trim(),
                      }))
                    }
                  >
                    Email
                  </Input>
                </div>

                <div className="w-full">
                  <Input
                    data-testid="password"
                    name="password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Enter your password (minimum 8 characters)"
                    value={formData.password}
                    error={validationErrors.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value.trim(),
                      }))
                    }
                  >
                    Password
                  </Input>
                </div>

                <div className="w-full">
                  <Input
                    data-testid="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    error={validationErrors.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value.trim(),
                      }))
                    }
                  >
                    Confirm Password
                  </Input>
                </div>

                <div className="mt-1 flex w-full select-none items-center gap-2">
                  <input
                    data-testid="agree-to-terms"
                    required
                    name="agreeToTerms"
                    id="policy"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        agreeToTerms: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="policy"
                    className="text-sm cursor-pointer text-gray-600"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <div className="mt-2 w-full">
                  <Button
                    width="full"
                    disabled={!isFormValid}
                    loading={isPending}
                  >
                    Register
                  </Button>
                </div>

                <h1 className="mt-2 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-primary hover:underline hover:underline-offset-4"
                  >
                    Login Now
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

export default Register;
