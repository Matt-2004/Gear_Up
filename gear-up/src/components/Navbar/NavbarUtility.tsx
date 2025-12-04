"use client";

import NavbarItems from "@/components/Navbar/NavbarItem";
import { Chat, Login, SearchBar, User } from "@/components/Navbar/NavUtils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { getRefreshToken } from "@/utils/getRefreshToken";
import { handleAuthenticationLogin } from "@/lib/Features/authSlice";

export default function NavbarUtility() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check Refresh_token exist or not
    const tokenCheck = async () => {
      const refreshToken = await getRefreshToken();
      // if refresh_token exist have to assume logged in
      if (refreshToken) {
        // set isAuthenticate to True
        dispatch(handleAuthenticationLogin());
      }
    };
    tokenCheck();
  });

  return (
    <div className="md:flex h-full items-center xl:gap-8 lg:gap-6 md:gap-3 hidden">
      <NavbarItems>
        <SearchBar />
      </NavbarItems>
      <NavbarItems>
        <Chat />
      </NavbarItems>
      <NavbarItems>{isAuthenticated ? <User /> : <Login />}</NavbarItems>
    </div>
  );
}
