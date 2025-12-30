"use client"

import { IUser } from "@/app/types/user.types"
import { getUserProfile } from "@/utils/FetchAPI"
import clsx from "clsx"
import { Cog, Menu, Search, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Dispatch, useEffect, useState } from "react"
import { ChatIcon } from "../Common/SVGs"
import { ProfileDropDown } from "./NavbarDropDown"
import NavbarTabs from "./NavbarTabs"

// Be a server side
// pass data through props
// use getServerSideProps to fetch data before render and pass through data

export function Logo() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

	return (
		<div className="z-20 flex h-full w-32 items-center">
			<div className="cursor-pointer rounded-md p-1 hover:bg-gray-300 active:bg-gray-200">
				<Menu
					className="text-primary h-7 w-7 text-2xl md:hidden"
					onClick={() => setIsMobileMenuOpen((prev) => !prev)}
				/>

				{isMobileMenuOpen && (
					<div className="">
						<MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
					</div>
				)}
			</div>
			<div className="flex h-16 w-32 -translate-x-2 items-center">
				<Image
					src={"/logo.png"}
					priority
					alt="Logo"
					width={150}
					height={150}
					className="object-contain"
				/>
			</div>
		</div>
	)
}

export function MobileMenu({
	setIsMobileMenuOpen,
}: {
	setIsMobileMenuOpen: Dispatch<React.SetStateAction<boolean>>
}) {
	return (
		<>
			<div className="bg-background fixed top-0 left-0 z-40 flex h-screen w-[75%] flex-col text-white">
				<div className="relative flex flex-col gap-8">
					<button className="absolute top-3 right-4 rounded-full active:bg-gray-300">
						<X
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
							className="text-primary"
						/>
					</button>

					<NavbarTabs />
				</div>
			</div>
			<div className="fixed inset-0 z-30 bg-gradient-to-r from-gray-900/60 to-black/80" />
		</>
	)
}

export function User() {
	const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] =
		useState<boolean>(false)
	const [data, setData] = useState<IUser>({} as IUser)

	useEffect(() => {
		const fetchUserProfile = async () => {
			const response = await getUserProfile()

			setData(response)
		}
		fetchUserProfile()
	}, [])

	const { avatarUrl, username, role }: Partial<IUser> = data || {}

	return (
		<div
			className="relative flex h-full w-16 cursor-pointer items-center justify-end gap-2"
			onClick={() => {
				setIsOpenUserProfileMenu(!isOpenUserProfileMenu)
			}}
		>
			<Image
				src={avatarUrl || "/default_profile.jpg"}
				alt="Profile Picture"
				width={40}
				height={40}
				className="h-10 w-10 rounded-full border border-gray-300"
			></Image>
			<h1 className="hidden md:block">
				<span className="text-primary font-medium">
					{username &&
						username.toLowerCase().charAt(0).toUpperCase() +
							username.substring(1, username.length)}
				</span>
				{role === "Dealer" && (
					<div className="bg-primary flex items-center gap-1 rounded-full px-2 text-center text-sm text-white">
						<Cog className="h-4 w-4" />
						{role}
					</div>
				)}
			</h1>
			{isOpenUserProfileMenu && <ProfileDropDown user={data} />}
		</div>
	)
}

export function SearchBar() {
	const [isSearchBarActive, setIsSearchBarActive] = useState<boolean>(false)
	return (
		<div className="relative h-full w-full transition-all duration-150 ease-in">
			<input
				type="text"
				placeholder="Search..."
				className={clsx(
					isSearchBarActive ? "block" : "hidden",
					"focus:ring-primary text-primary w-full rounded-full bg-gray-300 py-1 pl-10 focus:ring-1 focus:outline-none md:block",
				)}
			/>
			<div
				onClick={() => setIsSearchBarActive(true)}
				className={clsx(
					isSearchBarActive
						? "left-3"
						: "rounded-full bg-gray-300 p-2 md:bg-transparent md:p-0",
					"absolute top-1/2 -left-5 -translate-y-1/2 transform md:left-3",
				)}
			>
				<Search
					className={clsx(
						isSearchBarActive
							? "text-primary md:text-gray-400"
							: "text-primary",
						"h-5 w-5",
					)}
				/>
			</div>
			{isSearchBarActive && (
				<div
					className="absolute top-1/2 right-2.5 -translate-y-1/2 transform text-white md:hidden"
					onClick={() => setIsSearchBarActive(false)}
				>
					<X className="h-5 w-5" />
				</div>
			)}
		</div>
	)
}

export function Chat() {
	return <ChatIcon />
}

export function Login() {
	return (
		<Link href="/auth/login">
			<div className="main-color-gradient cursor-pointer rounded-md px-4 py-1.5">
				<button className="font-semibold">Login</button>
			</div>
		</Link>
	)
}
