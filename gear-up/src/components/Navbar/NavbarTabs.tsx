import clsx from "clsx"

export default function NavbarTabs() {
	return (
		<>
			<div
				className={clsx(
					"border-primary mt-16 border-t transition-all duration-300 ease-in-out sm:m-0 sm:border-none md:flex",
				)}
			>
				<div className="flex h-screen w-full text-xl font-medium text-white sm:h-16 sm:flex-row md:px-1 md:py-1">
					<ol className="flex w-full flex-col gap-0 sm:gap-2 md:flex-row md:gap-2 lg:gap-8">
						<li className="hidden cursor-pointer border-b border-gray-500 p-4 text-[16px] transition duration-100 ease-in-out sm:block sm:border-none md:px-1 md:py-4 md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4">
							Home
						</li>

						<li className="w-full">
							<button className="w-full cursor-pointer border-b border-gray-500 p-4 text-start text-[16px] whitespace-nowrap transition duration-100 ease-in-out active:bg-gray-500 sm:border-none md:px-1 md:py-4 md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4">
								Buy Cars
							</button>
						</li>
						<li className="w-full">
							<button className="w-full cursor-pointer border-b border-gray-500 p-4 text-start text-[16px] whitespace-nowrap transition duration-100 ease-in-out active:bg-gray-500 sm:border-none md:px-1 md:py-4 md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4">
								Rent Cars
							</button>
						</li>
						<li className="w-full">
							<button className="w-full cursor-pointer border-b border-gray-500 p-4 text-start text-[16px] whitespace-nowrap transition duration-100 ease-in-out active:bg-gray-500 sm:border-none md:px-1 md:py-4 md:hover:text-[#7ED957] md:hover:underline md:hover:underline-offset-4">
								Contact Me
							</button>
						</li>
					</ol>
				</div>
			</div>
		</>
	)
}
