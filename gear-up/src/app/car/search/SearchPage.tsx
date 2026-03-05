"use client"

import { CarCursorDTO, ICar } from "@/types/car.types"
import { CarCard } from "@/components/Car/CarCard"
import { searchCarWithQuery } from "@/utils/API/CarAPI"
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query"
import { ArrowLeft, Loader2, Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface CarSuggestion {
	make: string
	model: string[]
}

interface SearchPageProps {
	query: string
	searchResults: ICar
	error: string | null
}

export default function SearchPage({
	query,
	searchResults: initialData,
	error: initialError,
}: SearchPageProps) {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState(query)
	const parentRef = useRef<HTMLDivElement>(null)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [allSuggestions, setAllSuggestions] = useState<CarSuggestion[]>([])
	const searchContainerRef = useRef<HTMLDivElement>(null)

	// Sync searchQuery with URL query parameter
	useEffect(() => {
		setSearchQuery(query)
	}, [query])

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery<
		CarCursorDTO,
		Error,
		InfiniteData<CarCursorDTO>,
		string[],
		string | undefined
	>({
		queryKey: ["search-cars", query],
		queryFn: async ({ pageParam }) => {
			const response = await searchCarWithQuery(
				`query=${query}${pageParam ? `&cursor=${pageParam}` : ""}`,
			)
			return response.data
		},
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.nextCursor : undefined,
		enabled: !!query,
		initialData: initialData?.data
			? {
					pages: [
						{
							items: initialData.data.items,
							hasMore: initialData.data.hasMore,
							nextCursor: initialData.data.nextCursor ?? null,
						},
					],
					pageParams: [undefined],
				}
			: undefined,
	})

	const allItems = data?.pages.flatMap((page) => page.items) ?? []

	// Load suggestions on mount
	useEffect(() => {
		fetch("/car-suggestions.json")
			.then((res) => res.json())
			.then((data) => {
				console.log("Loaded suggestions:", data)
				setAllSuggestions(Array.isArray(data) ? data : [])
			})
			.catch((err) => console.error("Failed to load suggestions:", err))
	}, [])

	// Debounced search suggestions
	useEffect(() => {
		if (!searchQuery.trim()) {
			setSuggestions([])
			setShowSuggestions(false)
			return
		}

		const timeoutId = setTimeout(() => {
			const filtered: string[] = []
			const lowerQuery = searchQuery.toLowerCase()

			for (const carGroup of allSuggestions) {
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
				if (filtered.length >= 5) break
			}

			console.log(
				"Search query:",
				searchQuery,
				"Filtered suggestions:",
				filtered.slice(0, 5),
			)
			setSuggestions(filtered.slice(0, 5))
			setShowSuggestions(filtered.length > 0)
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [searchQuery, allSuggestions])

	// Close suggestions when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	useEffect(() => {
		if (!parentRef.current) return

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = parentRef.current!

			// Trigger fetch when user scrolls to 80% of content
			if (
				scrollTop + clientHeight >= scrollHeight * 0.8 &&
				hasNextPage &&
				!isFetchingNextPage
			) {
				fetchNextPage()
			}
		}

		const scrollElement = parentRef.current
		scrollElement.addEventListener("scroll", handleScroll)

		return () => scrollElement.removeEventListener("scroll", handleScroll)
	}, [hasNextPage, fetchNextPage, isFetchingNextPage])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			setShowSuggestions(false)
			router.push(`/car/search?query=${encodeURIComponent(searchQuery.trim())}`)
		}
	}

	const handleClearSearch = () => {
		setSearchQuery("")
		setSuggestions([])
		setShowSuggestions(false)
		router.push("/car/search")
	}

	const handleSuggestionClick = (suggestion: string) => {
		setSearchQuery(suggestion)
		setShowSuggestions(false)
		router.push(`/car/search?query=${encodeURIComponent(suggestion)}`)
	}

	const handleGoBack = () => {
		router.back()
	}

	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Search Header */}
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold text-gray-900">Search Cars</h1>

					{/* Search Bar */}
					<form onSubmit={handleSearch} className="relative">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={handleGoBack}
								className="flex-shrink-0 rounded-lg border border-gray-300 bg-white p-3 shadow-sm transition-colors hover:bg-gray-50"
								aria-label="Go back"
							>
								<ArrowLeft className="h-5 w-5 text-gray-700" />
							</button>
							<div ref={searchContainerRef} className="relative flex-1">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onFocus={() => {
										if (suggestions.length > 0) setShowSuggestions(true)
									}}
									placeholder="Search by make, model, year..."
									className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white py-3 pr-12 pl-12 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:outline-none"
								/>
								<Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
								{searchQuery && (
									<button
										type="button"
										onClick={handleClearSearch}
										className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
									>
										<X className="h-5 w-5" />
									</button>
								)}

								{/* Suggestions Dropdown */}
								{showSuggestions && suggestions.length > 0 && (
									<div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
										{suggestions.map((suggestion, index) => (
											<button
												key={index}
												type="button"
												onClick={() => handleSuggestionClick(suggestion)}
												className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
											>
												<Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
												<span className="text-gray-900">{suggestion}</span>
											</button>
										))}
									</div>
								)}
							</div>
							<button
								type="submit"
								className="bg-primary-600 hover:bg-primary-700 rounded-lg px-8 py-3 font-semibold text-white shadow-sm transition-colors"
							>
								Search
							</button>
						</div>
					</form>
				</div>

				{/* Search Results */}
				{initialError || error ? (
					<div className="flex flex-col items-center justify-center py-16">
						<div className="text-center">
							<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
								<X className="h-8 w-8 text-red-600" />
							</div>
							<h2 className="mb-2 text-2xl font-bold text-gray-900">Error</h2>
							<p className="mb-6 text-gray-600">
								{initialError ||
									(error as Error)?.message ||
									"An error occurred"}
							</p>
							<button
								onClick={() => router.push("/car/search")}
								className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2 font-semibold text-white transition-colors"
							>
								Try Again
							</button>
						</div>
					</div>
				) : query && data ? (
					<div>
						{/* Results Header */}
						<div className="mb-6 flex items-center justify-between">
							<div>
								<h2 className="text-xl font-semibold text-gray-900">
									Search Results for "{query}"
								</h2>
							</div>
						</div>

						{/* Results Grid with Infinite Scroll */}
						{allItems.length > 0 ? (
							<div
								ref={parentRef}
								className="h-[calc(100vh-300px)] overflow-auto"
							>
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{allItems.map((car, index) => (
										<div key={car.id} data-index={index}>
											<CarCard carItem={car} />
										</div>
									))}
									{isFetchingNextPage && (
										<div className="col-span-full flex items-center justify-center py-8">
											<Loader2 className="text-primary-600 h-8 w-8 animate-spin" />
										</div>
									)}
								</div>
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-16">
								<div className="text-center">
									<div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
										<Search className="h-8 w-8 text-gray-400" />
									</div>
									<h2 className="mb-2 text-2xl font-bold text-gray-900">
										No Results Found
									</h2>
									<p className="mb-6 text-gray-600">
										We couldn't find any cars matching "{query}". Try different
										keywords.
									</p>
									<button
										onClick={handleClearSearch}
										className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2 font-semibold text-white transition-colors"
									>
										Clear Search
									</button>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-16">
						<div className="text-center">
							<div className="bg-primary-100 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
								<Search className="text-primary-600 h-8 w-8" />
							</div>
							<h2 className="mb-2 text-2xl font-bold text-gray-900">
								Start Your Search
							</h2>
							<p className="text-gray-600">
								Enter a car make, model, or year to find your perfect vehicle
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
