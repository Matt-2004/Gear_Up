import { usePopup } from "@/provider/NavbarContext";
import { signOut } from "next-auth/react";

export function ProfileDownDown() {

    // Popup value is handling with Context Provider
    const { openPopup, setTag } = usePopup();

    // TODO: Logout function --> handle for manually and provider 

    return (
        <div className="absolute top-12  w-48 bg-white shadow-lg rounded-md p-4 z-30">
            <ul className="space-y-2">
                <li className="cursor-pointer hover:text-[#7ED957]" onClick={() => {
                    setTag("viewProfile");
                    openPopup();
                }}>View Profile</li>
                <li className="cursor-pointer hover:text-[#7ED957]" onClick={() => {
                    setTag("settings");
                    openPopup();
                }}>Settings</li>
                <li onClick={() => signOut()} className="cursor-pointer hover:text-[#7ED957]">Logout</li>
            </ul>
        </div>
    )
}