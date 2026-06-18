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
      <div className="relative min-h-dvh w-screen max-w-none overflow-hidden rounded-none sm:min-h-155 sm:w-full sm:max-w-155 sm:rounded-3xl lg:max-w-5xl">
        <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden sm:min-h-155 sm:rounded-3xl lg:grid-cols-2">
          {/* ── Left branding panel ── */}
          <div className="relative hidden h-full lg:block">
            <Image
              src={"/carImages/9.jpg"}
              alt="Premium luxury vehicle"
              fill
              loading="lazy"
              blurDataURL="/carImages/9.jpg"
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={70}
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
            {/* Subtle emerald ambient glow behind vehicle */}
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
                Welcome Back to Gear Up
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Continue your vehicle journey.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Access saved vehicles, dealer conversations, appointments, and
                personalized recommendations.
              </p>
            </div>
          </div>

          {/* ── Right login panel ── */}
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
                <AuthPageCaption>Welcome back</AuthPageCaption>
                <h3 className="mt-1 text-sm leading-relaxed text-[#A5A5A5]">
                  Sign in to continue to your account and pick up where you left
                  off.
                </h3>
              </div>

              {/* Dark input overrides via parent selectors */}
              <form
                onSubmit={handleFormSubmit}
                id="body"
                className="flex w-full flex-col gap-4
                  [&_label]:!text-[#A5A5A5]
                  [&_input]:bg-[#1A221A]!
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
                <div className="w-full">
                  <Input
                    id="usernameOrEmail"
                    ref={usernameRef}
                    name="usernameOrEmail"
                    autoComplete="email"
                    type="text"
                    placeholder="example@gmail.com or matthew"
                    value={formData.usernameOrEmail}
                    data-testid="email"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        usernameOrEmail: e.target.value.trim(),
                      }))
                    }
                  >
                    Email or User Name
                  </Input>
                </div>

                <div className="w-full">
                  <Input
                    id="password"
                    name="password"
                    minLength={8}
                    autoComplete="current-password"
                    type="password"
                    placeholder="Password (mininum at least 8 characters)"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value.trim(),
                      }))
                    }
                    data-testid="password"
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
                      className="h-4 w-4 rounded border-white/[0.12] bg-[#1A221A] text-[#5FD44A] focus:ring-[#5FD44A] focus:ring-offset-0"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rememberMe: e.target.checked,
                        }))
                      }
                    />
                    <label htmlFor="rememberMe" className="text-[#A5A5A5]">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/email/reset-password"
                    className="font-medium text-[#5FD44A] transition-colors hover:underline hover:underline-offset-2"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="mt-2 w-full">
                  <Button
                    width="full"
                    loading={isPending}
                    className="!bg-primary-600 !text-white !shadow-[0_4px_6px_rgba(0,0,0,0.15)] !transition-all !duration-200 hover:!bg-primary-600/80 hover:!shadow-[0_4px_8px_rgba(0,0,0,0.15)] active:!scale-[0.98]"
                  >
                    Login
                  </Button>
                </div>

                <h1 className="mt-2 text-center text-sm text-[#A5A5A5]">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-[#5FD44A] transition-colors hover:underline hover:underline-offset-4"
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
