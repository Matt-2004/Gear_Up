import { Metadata } from "next";
import AdminLoginClient from "./AdminLoginClient";

export const metadata: Metadata = {
  title: "Admin Login - Gear Up",
  description: "Admin portal login for Gear Up.",
};

const Page = () => <AdminLoginClient />;

export default Page;
