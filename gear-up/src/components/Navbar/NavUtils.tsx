"use client"

import { useUserData } from "@/Context/UserDataContext"

import clsx from "clsx"
import { Cog, Menu, Search, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dispatch, useEffect, useRef, useState } from "react"
import carSuggestions from "../../../public/carSuggestions.json"
import { ChatIcon } from "../Common/SVGs"
import { ProfileDropDown } from "./NavbarDropDown"

interface CarSuggestion {
	make: string
	model: string[]
}

// Be a server side
// pass data through props
// use getServerSideProps to fetch data before render and pass through data

export function Logo() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

	return (
		<div className="z-20 flex h-full shrink-0 items-center gap-2">
			<button
				className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100 active:bg-gray-200 md:hidden"
				aria-label="Toggle menu"
				onClick={() => setIsMobileMenuOpen((prev) => !prev)}
			>
				<Menu className="text-primary h-6 w-6" />
			</button>
			{isMobileMenuOpen && (
				<MobileMenu setIsMobileMenuOpen={setIsMobileMenuOpen} />
			)}
			<Link
				href="/"
				className="flex h-14 w-28 items-center transition-transform hover:scale-105"
			>
				<Image
					src="/logo_dark.png"
					priority
					alt="Gear Up Logo"
					width={100}
					height={100}
					className="object-contain"
				/>
			</Link>
		</div>
	)
}

export function MobileMenu({
	setIsMobileMenuOpen,
}: {
	setIsMobileMenuOpen: Dispatch<React.SetStateAction<boolean>>
}) {
	const { user } = useUserData()
	const router = useRouter()
	console.log("NavUtils: user data:: ", user)

	const handleNavigation = (path: string) => {
		router.push(path)
		setIsMobileMenuOpen(false)
	}

	const signOut = async () => {
		try {
			await fetch("/api/token/remove", {
				method: "POST",
			}).then(() => {
				router.push("/")
			})
		} catch (err) {
			console.error("Error signing out:", err)
		}
	}

	return (
		<>
			{/* Backdrop - covers entire screen with blur */}
			<div
				className="animate-in fade-in fixed inset-0 z-60 min-h-screen bg-white/30 backdrop-blur-sm duration-300"
				onClick={() => setIsMobileMenuOpen(false)}
			/>

			{/* Mobile Menu - appears above everything */}
			<div className="animate-in slide-in-from-left fixed top-0 left-0 z-70 flex h-screen min-h-screen w-[85%] max-w-sm flex-col bg-white shadow-2xl duration-300">
				<div className="relative flex h-full flex-col">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
						<Link
							href="/"
							onClick={() => setIsMobileMenuOpen(false)}
							className="flex items-center"
						>
							<Image
								src="/logo_dark.png"
								alt="Gear Up Logo"
								width={80}
								height={80}
								className="object-contain"
							/>
						</Link>
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							className="rounded-lg p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
							aria-label="Close menu"
						>
							<X className="h-6 w-6 text-gray-700" />
						</button>
					</div>

					{/* User Profile Section */}
					{user && (
						<div className="border-b border-gray-200 bg-gray-50 p-4">
							<div className="flex items-center gap-3">
								<div className="relative">
									<Image
										src={user.avatarUrl || "/default_profile.jpg"}
										alt="Profile"
										width={48}
										height={48}
										className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover"
									/>
									<div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-semibold text-gray-900">
										{user.username
											? user.username.charAt(0).toUpperCase() +
												user.username.substring(1)
											: "User"}
									</p>
									<p className="truncate text-xs text-gray-600">{user.email}</p>
									{user.role && (
										<span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
											{user.role}
										</span>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Navigation Links */}
					<nav className="flex-1 overflow-y-auto p-4">
						<div className="space-y-1">
							<button
								onClick={() => handleNavigation("/")}
								className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
									/>
								</svg>
								Home
							</button>

							<button
								onClick={() => handleNavigation("/car/search")}
								className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								Browse Cars
							</button>

							<button
								onClick={() => handleNavigation("/post/discover")}
								className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
									/>
								</svg>
								Discover Posts
							</button>

							{user && (
								<>
									<div className="my-4 border-t border-gray-200"></div>

									<button
										onClick={() =>
											handleNavigation(
												user.role === "Dealer"
													? "/profile/dealer"
													: "/profile/user",
											)
										}
										className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
									>
										<svg
											className="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
										My Profile
									</button>

									<button
										onClick={() => handleNavigation("/chat")}
										className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
									>
										<svg
											className="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
											/>
										</svg>
										Messages
									</button>
								</>
							)}
						</div>
					</nav>

					{/* Bottom Section */}
					<div className="border-t border-gray-200 bg-gray-50 p-4">
						{user ? (
							<button
								onClick={() => signOut()}
								className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
									/>
								</svg>
								Log Out
							</button>
						) : (
							<div className="space-y-2">
								<button
									onClick={() => handleNavigation("/auth/login")}
									className="bg-primary-600 hover:bg-primary-700 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white transition-colors"
								>
									Log In
								</button>
								<button
									onClick={() => handleNavigation("/auth/register")}
									className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
								>
									Sign Up
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export function User() {
	const { user } = useUserData()
	const [isOpenUserProfileMenu, setIsOpenUserProfileMenu] =
		useState<boolean>(false)

	if (!user) return null

	const { avatarUrl, username, role } = user

	return (
		<div
			className="group relative flex h-full items-center justify-end gap-3"
			onMouseEnter={() => {
				setIsOpenUserProfileMenu(true)
			}}
			onMouseLeave={() => {
				setIsOpenUserProfileMenu(false)
			}}
		>
			<div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100">
				<div className="relative">
					<Image
						src={avatarUrl || "/default_profile.jpg"}
						alt="Profile Picture"
						width={40}
						height={40}
						className="h-9 w-9 rounded-full border-2 border-gray-200 object-cover transition-colors group-hover:border-blue-400"
					/>
					<div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
				</div>
				<div className="hidden items-start md:flex md:flex-col">
					<span className="text-sm font-medium whitespace-nowrap text-gray-900">
						{username &&
							username.charAt(0).toUpperCase() + username.substring(1)}
					</span>
					{role === "Dealer" && (
						<div className="flex items-center gap-1 text-xs text-blue-600">
							<Cog className="h-3 w-3" />
							<span>{role}</span>
						</div>
					)}
				</div>
			</div>
			{isOpenUserProfileMenu && <ProfileDropDown />}
		</div>
	)
}

export function SearchBar() {
	const router = useRouter()
	const [isSearchBarActive, setIsSearchBarActive] = useState<boolean>(false)
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
	const searchRef = useRef<HTMLFormElement>(null)

	// Debounce effect for search
	useEffect(() => {
		const delayTimer = setTimeout(() => {
			if (searchQuery.trim() === "") {
				setSuggestions([])
				setShowSuggestions(false)
				return
			}

			// Filter suggestions based on search query
			const filtered: string[] = []
			const lowerQuery = searchQuery.toLowerCase()

			for (const carGroup of carSuggestions) {
				// Check if make matches
				if (carGroup.make.toLowerCase().includes(lowerQuery)) {
					// Add all models from this make
					filtered.push(
						...carGroup.model.map((model) => `${carGroup.make} ${model}`),
					)
				} else {
					// Check individual models
					for (const model of carGroup.model) {
						const fullName = `${carGroup.make} ${model}`
						if (fullName.toLowerCase().includes(lowerQuery)) {
							filtered.push(fullName)
						}
					}
				}

				// Stop if we have enough suggestions
				if (filtered.length >= 8) break
			}

			setSuggestions(filtered.slice(0, 8))
			setShowSuggestions(filtered.length > 0)
		}, 300) // 300ms debounce delay

		return () => clearTimeout(delayTimer)
	}, [searchQuery])

	// Close suggestions when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const handleSuggestionClick = (suggestion: string) => {
		setSearchQuery(suggestion)
		setShowSuggestions(false)
		router.push(`/car/search?query=${encodeURIComponent(suggestion)}`)
	}

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			setShowSuggestions(false)
			router.push(`/car/search?query=${encodeURIComponent(searchQuery.trim())}`)
		}
	}

	return (
		<form
			onSubmit={handleSearchSubmit}
			ref={searchRef}
			className="relative h-full w-full max-w-md transition-all duration-200 ease-in-out"
		>
			<input
				type="text"
				placeholder="Search cars, posts, dealers..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onFocus={() => searchQuery && setShowSuggestions(true)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSearchSubmit(e)
					}
				}}
				className={clsx(
					isSearchBarActive ? "block" : "hidden",
					"focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-500 transition-all hover:bg-gray-100 focus:outline-none md:block",
				)}
			/>
			<button
				type="submit"
				onClick={() => setIsSearchBarActive(true)}
				className={clsx(
					isSearchBarActive
						? "left-3"
						: "rounded-lg p-2 hover:bg-gray-100 md:bg-transparent md:p-0",
					"absolute top-1/2 -translate-y-1/2 transform transition-colors md:left-3",
				)}
				aria-label="Search"
			>
				<Search
					className={clsx(
						isSearchBarActive ? "text-gray-400" : "text-primary",
						"h-5 w-5",
					)}
				/>
			</button>
			{isSearchBarActive && (
				<button
					className="absolute top-1/2 right-3 -translate-y-1/2 transform rounded p-1 transition-colors hover:bg-gray-200 md:hidden"
					onClick={() => {
						setIsSearchBarActive(false)
						setSearchQuery("")
						setShowSuggestions(false)
					}}
					aria-label="Clear search"
				>
					<X className="h-4 w-4 text-gray-500" />
				</button>
			)}

			{/* Search Suggestions Dropdown */}
			{showSuggestions && suggestions.length > 0 && (
				<div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
					<div className="p-2">
						<p className="p-1.5 text-xs font-medium text-gray-500">
							{suggestions.length}{" "}
							{suggestions.length === 1 ? "suggestion" : "suggestions"}
						</p>
						{suggestions.map((suggestion, index) => (
							<button
								key={index}
								type="button"
								onClick={() => handleSuggestionClick(suggestion)}
								className="group flex w-full items-center gap-3 p-1.5 text-left transition-colors hover:bg-gray-100"
							>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-gray-900">
										{suggestion}
									</p>
								</div>
							</button>
						))}
					</div>
				</div>
			)}
		</form>
	)
}

export function Chat() {
	return <ChatIcon />
}

export function Login() {
	return (
		<Link href="/auth/login" className="shrink-0">
			<button className="bg-primary-500 hover:bg-primary-600 cursor-pointer rounded-lg px-6 py-2 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95">
				Login
			</button>
		</Link>
	)
}
