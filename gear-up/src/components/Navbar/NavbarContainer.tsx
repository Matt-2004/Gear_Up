"use client"

import { ReactNode } from "react";

function NavbarContainer({ children }: { children: ReactNode }) {
    return (
        <div className=" relative w-full  border-[#7ED957] border-b h-16 flex justify-center bg-foreground">
            <div className="z-20 xl:w-[75%] lg:w-[90%] md:w-full w-full px-2 items-center flex justify-between h-16 object-fill ">
                {children}
            </div>
        </div>
    )
}

export default NavbarContainer;