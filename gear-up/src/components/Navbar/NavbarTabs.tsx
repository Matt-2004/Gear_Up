import clsx from "clsx";

export default function NavbarTabs() {


  return (
    <>
      <div
        className={clsx(
          "transition-all duration-300 ease-in-out mt-16 sm:m-0 border-t border-primary sm:border-none md:flex",
        )}
      >
        <div className=" md:py-1 md:px-1 flex  sm:flex-row w-full h-screen sm:h-16   text-xl  font-medium text-white">
          <ol className="flex flex-col md:flex-row gap-0 sm:gap-2 md:gap-2 lg:gap-8 w-full">
            <li className="hidden sm:block cursor-pointer border-b border-gray-500 sm:border-none text-[16px] p-4 md:py-4 md:px-1  md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">
              Home
            </li>

            <li className="w-full">
              <button className="text-start whitespace-nowrap active:bg-gray-500 w-full cursor-pointer  border-b border-gray-500 sm:border-none text-[16px] p-4 md:py-4 md:px-1 md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">

                Buy Cars
              </button>
            </li>
            <li className="w-full">
              <button className="text-start whitespace-nowrap active:bg-gray-500 w-full cursor-pointer  border-b border-gray-500 sm:border-none text-[16px] p-4 md:py-4 md:px-1 md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">

                Rent Cars
              </button>
            </li>
            <li className="w-full">
              <button className="text-start whitespace-nowrap active:bg-gray-500 w-full cursor-pointer  border-b border-gray-500 sm:border-none text-[16px] p-4 md:py-4 md:px-1 md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4 transition duration-100 ease-in-out">

                Contact Me
              </button>
            </li>
          </ol>
        </div>
      </div>

    </>
  );
}
