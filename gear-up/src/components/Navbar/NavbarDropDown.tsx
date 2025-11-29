import { signOut } from "next-auth/react";
import Link from "next/link";
import { HTMLAttributes, ReactNode, useState } from "react";
import { getUserProfileRes } from "@/app/types/user.types";

export function ProfileDownDown({ user }: { user: getUserProfileRes }) {
  const [users] = useState<getUserProfileRes>(user);
  console.log("Users data:: ", users);
  return (
    <div className="absolute top-11 border-gray-800 right-0 shadow-gray-700  w-64 bg-background text-white shadow-sm rounded-md p-2 z-30">
      <ul className="">
        <DropDownItem link={"/profile/user"}>Profile</DropDownItem>
        {users.data.role === "Dealer" && (
          <DropDownItem link={"profile/dealer/cars"}>Cars</DropDownItem>
        )}
        <DropDownItem link={"/profile/user"}>Settings</DropDownItem>
        <DropDownItem link={"/profile/dealer/register"}>
          Dealership registration
        </DropDownItem>
        <DropDownItem link={""} onClick={() => signOut()}>
          Logout
        </DropDownItem>
      </ul>
    </div>
  );
}

interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
  link: string;
  children: ReactNode;
}

function DropDownItem({ link, children, ...props }: DropDownProps) {
  return (
    <div {...props}>
      <Link href={link}>
        <div
          className={
            "cursor-pointer   px-4 py-2 rounded-sm hover:border-gray-600 hover:bg-gray-700"
          }
        >
          {children}
        </div>
      </Link>
    </div>
  );
}
