"use client";

import { IUser } from "@/app/types/user.types";
import NavbarUtility from "@/components/Navbar/NavbarUtility";
import CustomerNavbarTabs from "./CustomerNavbarTabs";
import DealerNavbarTabs from "./DealerNavbarTabs";
import { Logo } from "./NavUtils";
import NavbarContainer from "./NavbarContainer";

export default function Navbar({ user }: { user: IUser }) {
  const isDealer = user?.role === "Dealer";
  const isCustomer = user?.role === "Customer";

  return (
    <NavbarContainer>
      <Logo />
      <div className="hidden md:block">
        {isDealer ? (
          <DealerNavbarTabs />
        ) : isCustomer ? (
          <CustomerNavbarTabs />
        ) : (
          <CustomerNavbarTabs />
        )}
      </div>
      <NavbarUtility user={user} />
    </NavbarContainer>
  );
}
