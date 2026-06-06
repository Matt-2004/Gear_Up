"use client";

import { useEffect, useRef } from "react";
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
      <div className="relative min-h-dvh w-screen max-w-none overflow-hidden rounded-none sm:min-h-155 sm:w-full sm:max-w-155 sm:rounded-3xl lg:max-w-5xl">
        <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden sm:min-h-155 sm:rounded-3xl lg:grid-cols-2">
          {/* ── Left branding panel ── */}
          <div className="relative hidden h-full lg:block">
            <Image
              src={"/carImages/10.jpg"}
              alt="Premium sports vehicle"
              fill
              loading="lazy"
              blurDataURL="/carImages/10.jpg"
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={75}
              placeholder="blur"
              className="object-cover"
            />
            {/* Dark cinematic overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
              }}
            />
            {/* Subtle emerald ambient glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 60%, rgba(76,175,80,0.1), transparent 55%)",
              }}
            />

            {/* Premium glass content card */}
            <div className="absolute right-8 bottom-8 left-8 rounded-2xl border border-white/[0.08] bg-[rgba(17,23,17,0.75)] p-6 shadow-xl backdrop-blur-[12px]">
              <p className="text-sm font-medium tracking-wide text-white/90 uppercase">
                Start Your Journey
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Join Gear Up Today
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Save your favorites, connect with dealers, and unlock a
                personalized car discovery experience.
              </p>
            </div>
          </div>

          {/* ── Right register panel ── */}
          <div className="flex h-full bg-transparent sm:p-4 md:p-5 lg:p-0">
            <div
              className="flex h-full w-full flex-col justify-center p-6 sm:rounded-tr-3xl sm:rounded-br-3xl sm:border sm:p-8 lg:rounded-tr-3xl lg:rounded-br-3xl lg:border-0 lg:border-l lg:p-10"
              style={{
                background: "#111711",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              }}
            >
              <div className="mb-6 flex justify-end">
                <Image
                  src="/logo.png"
                  alt="Gear Up"
                  width={150}
                  height={34}
                  priority
                />
              </div>
              <div className="mb-5">
                <AuthPageCaption>Create your account</AuthPageCaption>
                <h3 className="mt-1 text-sm leading-relaxed text-[#A5A5A5]">
                  Start your journey with Gear Up and discover the right car
                  with confidence.
                </h3>
                <div className="mt-2 text-xs text-[#8A8A8A]">
                  Already with us?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-[#5FD44A] transition-colors hover:underline hover:underline-offset-2"
                  >
                    Sign in here
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/"
                    className="font-medium text-[#5FD44A] transition-colors hover:underline hover:underline-offset-2"
                  >
                    go back home
                  </Link>
                  .
                </div>
              </div>

              {/* Dark input overrides via parent selectors */}
              <form
                onSubmit={handleFormSubmit}
                id="body"
                className="flex w-full flex-col gap-4
                  [&_label]:!text-[#A5A5A5]
                  [&_input]:!bg-[#1A221A]
                  [&_input]:!text-white
                  [&_input]:!border-gray-600
                  [&_input]:!placeholder-[#8A8A8A]
                  [&_input:focus]:!outline-none
                  [&_input:focus]:!ring-0
                  [&_input:focus]:!shadow-[0_0_0_4px_rgba(95,212,74,0.12)]
                  [&_svg]:!text-[#8A8A8A]
                  [&_svg:hover]:!text-[#A5A5A5]
                "
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                }}
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
                    className="h-4 w-4 rounded border-white/[0.12] bg-[#1A221A] text-[#5FD44A] focus:ring-[#5FD44A] focus:ring-offset-0"
                  />
                  <label
                    htmlFor="policy"
                    className="cursor-pointer text-sm text-[#A5A5A5]"
                  >
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <div className="mt-2 w-full">
                  <Button
                    width="full"
                    disabled={!isFormValid}
                    loading={isPending}
                    className="!bg-primary-600 !text-white !shadow-[0_4px_6px_rgba(0,0,0,0.15)] !transition-all !duration-200 hover:!bg-primary-600/80 hover:!shadow-[0_4px_8px_rgba(0,0,0,0.15)] active:!scale-[0.98]"
                  >
                    Register
                  </Button>
                </div>

                <h1 className="mt-2 text-center text-sm text-[#A5A5A5]">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-[#5FD44A] transition-colors hover:underline hover:underline-offset-4"
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
