"use client";

import { useUserData } from "@/Context/UserDataContext";
import NavbarUtility from "@/components/Navbar/NavbarUtility";
import CustomerNavbarTabs from "./CustomerNavbarTabs";

import { Logo } from "./NavUtils";
import NavbarContainer from "./NavbarContainer";

export default function Navbar() {
  const { user } = useUserData();
  const isCustomer = user?.role === "Customer";

  return (
    <NavbarContainer>
      <Logo />
      <div className="hidden md:block">
        {isCustomer &&
          <CustomerNavbarTabs />
        }
      </div>
      <NavbarUtility />
    </NavbarContainer>
  );
}
