import { signOut } from "next-auth/react";
import Link from "next/link";

export function ProfileDownDown() {

    return (
        <div className="absolute top-11 border-gray-800 right-0 shadow-gray-700  w-64 bg-background text-white shadow-sm rounded-md p-2 z-30">
            <ul className="">
                <li className="cursor-pointer  px-4 py-2 rounded-sm hover:border-gray-600 hover:bg-gray-700">
                    <Link href="/profile/user">
                        Profile
                    </Link>
                </li>
                <li className="cursor-pointer   px-4 py-2 rounded-sm hover:border-gray-600 hover:bg-gray-700">Settings</li>
                <li className="cursor-pointer  px-4 py-2 rounded-sm hover:border-gray-600 hover:bg-gray-700">
                    <Link href={"/profile/dealer/register"}>Dealership registration</Link>
                </li>
                <li onClick={() => signOut()} className="cursor-pointer  px-4 py-2 rounded-sm hover:border-gray-600 hover:bg-gray-700">Logout</li>
            </ul>
        </div>
    )
}