import { Metadata } from "next";
import AdminLogin from "@/app/features/auth/admin/login/ui/AdminLogin";

export const metadata: Metadata = {
  title: "Admin Login - Gear Up",
  description: "Admin portal login for Gear Up.",
};

const Page = () => <AdminLogin />;

export default Page;
