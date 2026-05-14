"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const ConditionalNavbar = () => {
  const currentPath = usePathname();

  const listPath = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/profile/admin",
  ];

  if (listPath.includes(currentPath)) {
    return null;
  }
  return <Navbar />;
};

export default ConditionalNavbar;
