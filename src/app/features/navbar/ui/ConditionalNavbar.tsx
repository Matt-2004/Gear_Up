"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { NAVBAR_HIDDEN_ROUTES } from "../constants";

export default function ConditionalNavbar() {
  const currentPath = usePathname();

  if (NAVBAR_HIDDEN_ROUTES.includes(currentPath as (typeof NAVBAR_HIDDEN_ROUTES)[number])) {
    return null;
  }
  return <Navbar />;
}
