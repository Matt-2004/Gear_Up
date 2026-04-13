"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import { AuthPageCaption, AuthPageContainer } from "../component";
import Link from "next/link";
import { RegisterSchema } from "../typeSchema";
import { useAuthForm } from "../useAuthForm";
import { useAuthToast } from "../hooks/useAuthToast";
import { useAuthSubmitFlow } from "../hooks/useAuthSubmitFlow";
import { submit } from "./action";
import Image from "next/image";
import registerHeroImage from "../../../../public/carImages/10.jpg";

const initialRegisterFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

const Register = () => {
  const { showSuccessToast, showErrorToast } = useAuthToast({
    onSuccess: { message: "Registration successful! Redirecting to login..." },
  });

  const {
    formData,
    setFormData,
    errors,
    handleSubmit: handleFormSubmit,
    isPending,
  } = useAuthForm(initialRegisterFormData, RegisterSchema, submit);

  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  const { handleAuthSubmit } = useAuthSubmitFlow({
    submitForm: handleFormSubmit,
    showSuccessToast,
    showErrorToast,
    successRedirectPath: "/auth/login",
  });

  return (
    <AuthPageContainer>
      <div className="relative min-h-dvh w-screen max-w-none overflow-hidden rounded-none bg-white shadow-none sm:min-h-155 sm:w-full sm:max-w-155 sm:rounded-3xl sm:shadow-2xl sm:shadow-slate-300/30 lg:max-w-5xl">
        <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-white sm:min-h-155 sm:rounded-3xl lg:grid-cols-2">
          <div className="relative hidden h-full lg:block">
            <Image
              src={registerHeroImage}
              alt="Sports car"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={70}
              placeholder="blur"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60" />
            <div className="absolute right-8 bottom-8 left-8 rounded-2xl border border-white/25 bg-white/15 p-6 shadow-xl backdrop-blur-md">
              <p className="text-sm font-medium tracking-wide text-white/90 uppercase">
                Join Gear Up Today
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Create your account in minutes.
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
                <AuthPageCaption>Create your account 🚀</AuthPageCaption>
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
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAuthSubmit(new FormData(e.currentTarget));
                }}
                id="body"
                className="flex w-full flex-col gap-4"
              >
                <div className="flex w-full flex-col gap-4 sm:flex-row">
                  <div className="w-full flex-1">
                    <Input
                      ref={firstNameRef}
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      error={errors.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    >
                      First Name
                    </Input>
                  </div>
                  <div className="w-full flex-1">
                    <Input
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      error={errors.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    >
                      Last Name
                    </Input>
                  </div>
                </div>

                <div className="w-full">
                  <Input
                    name="username"
                    type="text"
                    placeholder="John_Doe"
                    value={formData.username}
                    error={errors.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  >
                    Username
                  </Input>
                </div>

                <div className="w-full">
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    error={errors.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  >
                    Email
                  </Input>
                </div>

                <div className="w-full">
                  <Input
                    name="password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Enter your password (minimum 8 characters)"
                    value={formData.password}
                    error={errors.password}
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

                <div className="w-full">
                  <Input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    error={errors.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  >
                    Confirm Password
                  </Input>
                </div>

                <div className="mt-1 flex w-full select-none items-center gap-2">
                  <input
                    required
                    name="agreeToTerms"
                    id="policy"
                    type="checkbox"
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
                  <Button width="full" loading={isPending}>
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
