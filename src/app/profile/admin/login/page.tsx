import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  AuthPageCaption,
  AuthPageContainer,
  FormContainer,
} from "@/app/auth/component";
import { authAPI } from "@/utils/Auth/authAPI";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Login - Gear Up",
  description: "Admin portal login for Gear Up.",
};

const Page = () => {
  const onSubmit = async (formdata: FormData) => {
    "use server";
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;

    await authAPI("/api/auth/admin/login", { email, password });
    redirect("/profile/admin?tab=dashboard", RedirectType.replace);
  };

  return (
    <AuthPageContainer>
      {/* <AnimatePresence>
						{mutation.isSuccess && <ToastComponent />}
					</AnimatePresence> */}
      <FormContainer>
        <AuthPageCaption>Admin Login</AuthPageCaption>
        <form
          action={onSubmit}
          id="body"
          className="mb-4 flex w-full flex-col items-center justify-center gap-8"
        >
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <Input
              name="email"
              required
              autoComplete="email"
              type="email"
              placeholder="example@gmail.com"
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
            >
              Password
            </Input>
          </div>

          <Button>Login</Button>
        </form>
      </FormContainer>
    </AuthPageContainer>
  );
};

export default Page;
