"use client";

import { useUserData } from "@/Context/UserDataContext";
import clsx from "clsx";
import { Calendar, Car, LogOut, Settings, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HTMLAttributes, ReactNode } from "react";

export function ProfileDropDown() {
  const { user } = useUserData();
  const router = useRouter();
  if (!user) return null;

  const signOut = async () => {
    console.log("Signing out...")
    try {
      await fetch("/api/token/remove", {
        method: "POST",
      }).then(() => {
        window.location.reload();
      })
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  return (
    <div className="text-primary absolute top-10 right-0 z-30 w-52 rounded-md border-gray-800 bg-white shadow-sm shadow-gray-100">
      <ul className="p-1">
        <DropDownItem className="" link={"/profile/user"} whatFor="Navbar">
          <div className="items-center rounded-full p-1">
            <User className="h-5 w-5" />
          </div>
          Profile
        </DropDownItem>
        {user.role === "Dealer" && (
          <DropDownItem
            className=""
            link={"/profile/dealer/cars"}
            whatFor="Navbar"
          >
            <div className="items-center rounded-full p-1">
              <Car className="h-5 w-5" />
            </div>
            Cars
          </DropDownItem>
        )}
        <DropDownItem
          className=""
          link={
            user.role === "Dealer"
              ? "/profile/dealer/appointments"
              : "/profile/user/appointments"
          }
          whatFor="Navbar"
        >
          <div className="items-center rounded-full p-1">
            <Calendar className="h-5 w-5" />
          </div>
          Appointments
        </DropDownItem>
        <DropDownItem className="" link={"/profile/user"} whatFor="Navbar">
          <div className="items-center rounded-full p-1">
            <Settings className="h-5 w-5" />
          </div>
          Settings
        </DropDownItem>
        {user.role !== "Dealer" && (
          <DropDownItem
            className=""
            link={"/profile/dealer/register?step=1"}
            whatFor="Navbar"
          >
            <div className="items-center rounded-full p-1">
              <UserPlus className="h-5 w-5" />
            </div>
            Dealership registration
          </DropDownItem>
        )}
        <DropDownItem link={""} onClick={() => signOut()} whatFor="Navbar">
          <div className="items-center rounded-full p-1">
            <LogOut className="h-5 w-5" />
          </div>
          Logout
        </DropDownItem>
      </ul>
    </div>
  );
}

interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
  link: string;
  children: ReactNode;
  type: "DELETE";
  whatFor: "Navbar" | "Card";
}

export function DropDownItem({
  link,
  children,
  type,
  whatFor,
  ...props
}: Partial<DropDownProps>) {
  return (
    <div {...props}>
      {link ? (
        <Link href={link ?? ""}>
          <div
            className={
              "flex cursor-pointer items-center gap-1 rounded-sm px-2 py-2 hover:border-green-200 hover:bg-green-100"
            }
          >
            {children}
          </div>
        </Link>
      ) : (
        <div
          className={clsx(
            type !== "DELETE"
              ? "hover:text-primary hover:border-green-200 hover:bg-green-100"
              : "bg-red-200 text-red-500 hover:bg-red-500 hover:text-red-100",
            whatFor === "Navbar" ? "rounded-sm" : "rounded-tr-lg rounded-bl-lg",
            "flex cursor-pointer items-center gap-1 px-2 py-2 text-sm",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
