import { useState } from "react";
import { MenuBar, XIcon } from "../SVGs";
import clsx from "clsx";

export default function NavbarTabs() {

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (

        <>
            <div className={clsx("absolute left-0 top-0 max-sm:z-10", isMenuOpen ? "h-screen flex" : "h-0 hidden", "lg:static lg:w-auto lg:flex transition-all duration-300 ease-in-out")}>
                <ol className="lg:gap-8 xl:gap-12 gap-10 flex items-center  max-sm:flex-col  max-sm:w-screen max-sm:h-screen  justify-center  text-xl  bg-[#142030] font-medium text-white">
                    <li className="cursor-pointer text-[16px]  md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Home</li>
                    <li className="cursor-pointer text-[16px] md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Promotions</li>
                    <li className="cursor-pointer text-[16px] md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Buy Cars</li>
                    <li className="cursor-pointer text-[16px] md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Rent Cars</li>
                    <li className="cursor-pointer text-[16px]  md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">Contact Me</li>
                </ol>
            </div>
            <div id="menu-bar" onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex z-20 items-center justify-center lg:hidden">
                {isMenuOpen && <XIcon />}
                {!isMenuOpen && <MenuBar />}
            </div>
        </>
    )
}