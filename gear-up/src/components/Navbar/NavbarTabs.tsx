"use client"

import clsx from "clsx"
import { useRouter } from "next/navigation"

export default function NavbarTabs() {
	const router = useRouter()
	return (
		<>
			<div
				className={clsx(
					"border-primary mt-12 border-t transition-all duration-300 ease-in-out sm:m-0 sm:border-none md:flex ",
				)}
			>
				<div className="text-primary flex h-screen w-full text-xl font-normal sm:h-16 sm:flex-row md:px-1 md:py-1">
					<ol className="flex w-full flex-col gap-0 sm:gap-2 md:flex-row md:gap-2 lg:gap-4">
						<li className="hidden  hover:font-medium cursor-pointer border-b border-gray-500 p-4 text-[16px] transition duration-100 ease-in-out sm:block sm:border-none md:px-1 md:py-4">
							Home
						</li>

						<li className="w-full hover:font-medium">
							<button className=" cursor-pointer border-b border-gray-500 p-4 text-start text-[16px] whitespace-nowrap transition duration-100 ease-in-out max-sm:active:bg-gray-500 sm:border-none md:px-1 md:py-4">
								Buy Cars
							</button>
						</li>
						<li className="w-full hover:font-medium">
							<button
								onClick={() => router.push("/post/discover")}
								className="w-full  cursor-pointer border-b border-gray-500 p-4 text-start text-[16px] whitespace-nowrap transition duration-100 ease-in-out max-sm:active:bg-gray-500 sm:border-none md:px-1 md:py-4"
							>
								Discover feeds
							</button>
						</li>
						<li className="w-full  hover:font-medium">
							<button className="w-full cursor-pointer border-b border-gray-500 p-4 text-start text-[16px] whitespace-nowrap transition duration-100 ease-in-out max-sm:active:bg-gray-500 sm:border-none md:px-1 md:py-4">
								Contact Me
							</button>
						</li>
					</ol>
				</div>
			</div>
		</>
	)
}
