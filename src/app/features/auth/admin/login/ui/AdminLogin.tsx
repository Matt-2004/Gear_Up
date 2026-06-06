"use client";

import Image from "next/image";
import Button from "@/app/shared/ui/Button";
import Input from "@/app/shared/ui/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
} from "../../../ui/AuthComponents";
import { useAdminLogin } from "../hooks/useAdminLogin";

const AdminLogin = () => {
  const { isPending, handleFormSubmit, formData, setFormData } =
    useAdminLogin();

  return (
    <AuthPageContainer>
      <div
        className="w-full max-w-md rounded-3xl border p-8"
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

        <AuthPageCaption>Admin Login</AuthPageCaption>

        <form
          onSubmit={handleFormSubmit}
          id="body"
          className="mb-4 mt-6 flex w-full flex-col items-center justify-center gap-8
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
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Input
              name="email"
              required
              autoComplete="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
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

          <Button
            loading={isPending}
            className="!bg-primary-600 !text-white !shadow-[0_4px_6px_rgba(0,0,0,0.15)] !transition-all !duration-200 hover:!bg-primary-600/80 hover:!shadow-[0_4px_8px_rgba(0,0,0,0.15)] active:!scale-[0.98]"
          >
            Login
          </Button>
        </form>
      </div>
    </AuthPageContainer>
  );
};

export default AdminLogin;
