"use client";

import Link from "next/link";

import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Spinner from "./Spinner";

interface FormProps {
  type: "register" | "login";
  instruction: string;
}

interface Inputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Form({ type, instruction }: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(!loading);
    setTimeout(() => {
      // API with react query
      // While interacting with API, keep the loading state true
      // if success -> redirect to home page
      // if error -> show error message
      setLoading(!loading);
    }, 2000);
  };
  return (
    <div className="mx-auto mt-5 w-[90%] rounded-2xl drop-shadow-2xl md:shadow-lg lg:mt-20 lg:w-[75%]">
      <div className="lg:flex lg:justify-between">
        <div className="space-y-6 px-6 py-16 lg:w-[45%] lg:border-r">
          <h2 className="mb-6 flex justify-center text-3xl font-semibold">
            {instruction}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {type === "register" && (
              <div className="flex w-full justify-between">
                <input
                  {...register("firstName")}
                  className="w-[45%] border-b py-2 outline-none placeholder:pl-2 placeholder:text-[12px]"
                  type="text"
                  placeholder="First Name"
                />
                <input
                  {...register("lastName")}
                  className="w-[45%] border-b py-2 outline-none placeholder:pl-2 placeholder:text-[12px]"
                  type="text"
                  placeholder="Last Name"
                />
              </div>
            )}
            <>
              <input
                {...register("email")}
                className="w-full border-b py-2 outline-none placeholder:pl-2 placeholder:text-[12px]"
                type="email"
                placeholder="Email"
                required
              />
              {errors.email && <p>{"Write in email format."}</p>}
            </>
            <input
              {...register("password")}
              className="w-full border-b py-2 outline-none placeholder:pl-2 placeholder:text-[12px]"
              type="password"
              placeholder="Password"
              required
              minLength={8}
              maxLength={20}
              autoComplete="new-password"
            />

            <Checkbox type={type} />
            {/* <Button type={type} /> */}
            <button
              type="submit"
              onClick={() => {
                setLoading(true);
              }}
              disabled={loading}
              className="main-color-gradient flex w-full cursor-pointer justify-center gap-4 py-3 text-lg font-medium"
            >
              {loading && <Spinner />}
              {type.substring(0, 1).toUpperCase() +
                type.substring(1, type.length)}
            </button>
          </form>
          <Spacer />
          <ThirdPartyRegistration />
          <Switcher type={type} />
        </div>
        <div className="hidden px-6 py-16 lg:block lg:w-[50%]">
          <Image
            src="/Car.png"
            alt="Decoration"
            width={500}
            height={100}
            className="mx-auto mt-10 mr-[-50px]"
          />
          <h2 className="w-80 text-2xl leading-relaxed font-medium italic">
            Every great drive begins with the first key — log in to unlock
            yours.
          </h2>
        </div>
      </div>
    </div>
  );
}

function Switcher({ type }: { type: "register" | "login" }) {
  return (
    <div className="flex justify-center space-x-1 text-[14px]">
      {type === "register" && (
        <>
          <span>Already have an account?</span>
          <Link href="/auth/login" className="font-medium text-blue-600">
            Login
          </Link>
        </>
      )}
      {type === "login" && (
        <>
          <span>Do not have an account?</span>
          <Link href="/auth/register" className="font-medium text-blue-600">
            Register
          </Link>
        </>
      )}
    </div>
  );
}

function ThirdPartyRegistration() {
  return (
    <div className="flex flex-col space-y-4 font-medium">
      <button className="flex w-full items-center justify-center space-x-2 border border-black py-2">
        <Image
          src="/Google.png"
          alt="Google Logo"
          className="h-9 w-9"
          width={50}
          height={50}
        />
        <span className="text-md">Google</span>
      </button>
      <button className="flex w-full items-center justify-center space-x-6 border border-black py-2">
        <Image
          src="/line.png"
          alt="Line Logo"
          className="h-8 w-8"
          width={50}
          height={50}
        />
        <span className="text-md">Line</span>
      </button>
    </div>
  );
}

function Spacer() {
  return (
    <div className="flex space-x-14">
      <div className="h-[1px] w-32 bg-black" />
      <div className="h-[1px] w-4 bg-black" />
      <div className="h-[1px] w-32 bg-black" />
    </div>
  );
}

function Checkbox(type: { type: "register" | "login" }) {
  return (
    <div className="flex items-center">
      {type.type === "login" && (
        <div className="flex w-full justify-between">
          <div className="flex items-center">
            <input type="checkbox" className="mr-2 h-4 w-4" id="remember" />
            <label htmlFor="remember" className="text-[12px]">
              Remember Me
            </label>
          </div>
          <h3 className="font-medi text-[14px]">Forget Password</h3>
        </div>
      )}
      {type.type === "register" && (
        <>
          <input type="checkbox" className="mr-2 h-4 w-4" id="terms" required />
          <label htmlFor="terms" className="text-[12px]">
            I agree to <b>The Terms of User</b>
          </label>
        </>
      )}
    </div>
  );
}
