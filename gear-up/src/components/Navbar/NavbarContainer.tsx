import { usePopup } from "@/provider/NavbarContext";
import { ReactNode } from "react";
import ProfileMenu from "./NavbarProfileMenu";

function NavbarContainer({ children }: { children: ReactNode }) {

    const { isOpen } = usePopup();

    return (
        <>
            <div className=" relative w-full  border-[#7ED957] border-b h-16 flex justify-center bg-[#142030]">
                <div className="z-20 xl:w-[75%] w-[90%] items-center flex justify-between h-16 object-fill ">
                    {children}
                </div>
            </div>
            {isOpen && <ProfileMenu />}
        </>
    )
}

export default NavbarContainer;