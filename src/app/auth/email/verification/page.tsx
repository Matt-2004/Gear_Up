import { Metadata } from "next";
import EmailValidation from "@/app/features/auth/emailValidation/ui/emailValidation";

export const metadata: Metadata = {
  title: "Email Verification - Gear Up",
  description: "Verify your email address to complete your registration.",
};

const Page = () => {
  return <EmailValidation variant="verification" />;
};

export default Page;
