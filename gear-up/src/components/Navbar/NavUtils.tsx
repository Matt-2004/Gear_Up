"use client"

import { Dispatch, useState } from "react"
import { ChatIcon } from "../Common/SVGs"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import Image from "next/image"
import { ProfileDownDown } from "./NavbarDropDown"
import { getUserProfile } from "@/utils/FetchAPI"
import { Cog, Menu, Search, X } from "lucide-react"
import NavbarTabs from "./NavbarTabs"
import clsx from "clsx"

// Be a server side
// pass data through props
// use getServerSideProps to fetch data before render and pass through data

export function Logo() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

	return (
		<div className="z-20 flex h-16 w-32 items-center">
			<div className="cursor-pointer rounded-md p-1 hover:bg-gray-600 active:bg-gray-600">
				<Menu
					className="h-7 w-7 text-2xl text-white md:hidden"
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
					<div className="absolute top-5 right-4">
						<X onClick={() => setIsMobileMenuOpen((prev) => !prev)} />
					</div>

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
	const { data: profile, isLoading } = useQuery({
		queryKey: ["userProfile"],
		queryFn: getUserProfile,
		staleTime: 5000,
		retry: false,
		enabled: true,
	})

	if (isLoading) {
		return <h1>Loading...</h1>
	}

	if (profile) {
		const {
			avatarUrl,
			username,
			role,
		}: { avatarUrl: string; username: string; role: string } = profile.data
		return (
			<div
				className="relative flex h-full w-16 cursor-pointer items-center justify-end gap-2"
				onClick={() => {
					setIsOpenUserProfileMenu(!isOpenUserProfileMenu)
				}}
			>
				<Image
					src={avatarUrl}
					alt="Profile Picture"
					width={40}
					height={40}
					className="h-10 w-10 rounded-full border border-gray-300"
				></Image>
				<h1 className="hidden md:block">
					<span className="font-medium text-white">
						{username.toLowerCase().charAt(0).toUpperCase() +
							username.substring(1, username.length)}
					</span>
					{role === "Dealer" && (
						<div className="bg-primary flex items-center gap-1 rounded-full px-2 text-center text-sm text-gray-800">
							<Cog className="h-4 w-4" />
							{role}
						</div>
					)}
				</h1>
				{isOpenUserProfileMenu && <ProfileDownDown user={profile} />}
			</div>
		)
	}
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
					"focus:ring-primary w-full rounded-full bg-gray-700 py-1 pl-10 text-white focus:ring-1 focus:outline-none md:block",
				)}
			/>
			<div
				onClick={() => setIsSearchBarActive(true)}
				className={clsx(
					isSearchBarActive
						? "left-3"
						: "rounded-full bg-gray-600 p-2 md:bg-transparent md:p-0",
					"absolute top-1/2 -left-5 -translate-y-1/2 transform md:left-3",
				)}
			>
				<Search
					className={clsx(
						isSearchBarActive ? "text-white md:text-gray-400" : "text-gray-300",
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
		<div className="main-color-gradient cursor-pointer px-6 py-1.5">
			<Link href="/auth/login">
				<button className="font-semibold">Login</button>
			</Link>
		</div>
	)
}
