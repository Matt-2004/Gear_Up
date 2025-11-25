import { Metadata } from "next";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export const metadata: Metadata = {
  title: "Login - Gear Up",
  description:
    "Login to your Gear Up account to access exclusive features and personalized content.",
};
