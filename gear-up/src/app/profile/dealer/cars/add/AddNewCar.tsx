"use client"

import Button from "@/components/Common/Button"
import { RadioInput, RadioInputContainer } from "@/components/Common/Input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { CarItems } from "@/types/car.types"
import { ImageUp, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react"
import carSuggestionsData from "../../../../../../public/carSuggestions.json"
import { ISteps } from "../../register/KycRegister"
import { ProgressSteps } from "../../register/ProgressSteps"
import { useVehicleContext } from "./AddNewCarContext"
import Review from "./Review"

interface CarSuggestion {
	make: string
	model: string[]
}

export const AddNewCarSteps: ISteps = [
	{
		id: "1",
		type: "fill-details",
		label: "Fill Details",
		path: "?step=1",
	},
	{
		id: "2",
		type: "car-image-upload",
		label: "Images Upload",
		path: "?step=2",
	},
	{
		id: "3",
		type: "review",
		label: "Review",
		path: "?step=3",
	},
]

const AddNewCar = ({ step }: { step: string }) => {
	return (
		<div
			id={"car-main-container"}
			className={
				"min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8"
			}
		>
			<div className="mx-auto max-w-5xl">
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						Add New Vehicle
					</h1>
					<p className="text-gray-600">
						List your vehicle in just a few simple steps
					</p>
				</div>
				<div className="mb-10 flex justify-center">
					<ProgressSteps Steps={AddNewCarSteps} />
				</div>
				<div className={"rounded-2xl bg-white shadow-xl"}>
					{step === "1" && <FillDetails />}
					{step === "2" && <CarImageUpload />}
					{step === "3" && <Review />}
				</div>
			</div>
		</div>
	)
}

const FillDetails = () => {
	const { updateAddedCar, addedCar } = useVehicleContext()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const currentStep = Number(searchParams.get("step") ?? 1)

	// Car suggestions state — loaded directly from the static JSON (no fetch needed)
	const [carSuggestions] = useState<CarSuggestion[]>(carSuggestionsData)
	const [makeInput, setMakeInput] = useState(addedCar?.make || "")
	const [modelInput, setModelInput] = useState(addedCar?.model || "")
	const [showMakeSuggestions, setShowMakeSuggestions] = useState(false)
	const [showModelSuggestions, setShowModelSuggestions] = useState(false)
	const makeInputRef = useRef<HTMLInputElement>(null)
	const modelInputRef = useRef<HTMLInputElement>(null)

	// Price formatting state
	const [priceInput, setPriceInput] = useState(
		addedCar?.price ? addedCar.price.toLocaleString() : "",
	)
	const priceInputRef = useRef<HTMLInputElement>(null)

	// Mileage formatting state
	const [mileageInput, setMileageInput] = useState(
		addedCar?.mileage ? addedCar.mileage.toLocaleString() : "",
	)
	const mileageInputRef = useRef<HTMLInputElement>(null)

	// Year input state
	const [yearInput, setYearInput] = useState(
		addedCar?.year ? addedCar.year.toString() : "",
	)
	const [showYearDropdown, setShowYearDropdown] = useState(false)
	const yearDropdownRef = useRef<HTMLDivElement>(null)

	// Title and Description character count
	const [titleLength, setTitleLength] = useState(addedCar?.title?.length || 0)
	const [descriptionLength, setDescriptionLength] = useState(
		addedCar?.description?.length || 0,
	)
	const MAX_TITLE_LENGTH = 100
	const MAX_DESCRIPTION_LENGTH = 500

	// Refs for all inputs for auto-focus
	const titleInputRef = useRef<HTMLInputElement>(null)
	const descriptionInputRef = useRef<HTMLTextAreaElement>(null)
	const yearInputRef = useRef<HTMLInputElement>(null)
	const colorInputRef = useRef<HTMLInputElement>(null)
	const engineCapacityInputRef = useRef<HTMLInputElement>(null)
	const vinInputRef = useRef<HTMLInputElement>(null)
	const licensePlateInputRef = useRef<HTMLInputElement>(null)

	// Initialize inputs from context when available
	useEffect(() => {
		if (addedCar?.make) setMakeInput(addedCar.make)
		if (addedCar?.model) setModelInput(addedCar.model)
		if (addedCar?.price) setPriceInput(addedCar.price.toLocaleString())
		if (addedCar?.mileage) setMileageInput(addedCar.mileage.toLocaleString())
		if (addedCar?.year) setYearInput(addedCar.year.toString())
	}, [
		addedCar?.make,
		addedCar?.model,
		addedCar?.price,
		addedCar?.mileage,
		addedCar?.year,
	])

	// Get filtered make suggestions
	const getFilteredMakes = () => {
		if (!makeInput.trim()) return carSuggestions.map((s) => s.make)
		return carSuggestions
			.map((s) => s.make)
			.filter((make) => make.toLowerCase().includes(makeInput.toLowerCase()))
			.slice(0, 8)
	}

	// Get filtered model suggestions based on selected make
	const getFilteredModels = () => {
		if (!makeInput.trim()) return []
		const selectedMake = carSuggestions.find(
			(s) => s.make.toLowerCase() === makeInput.toLowerCase(),
		)
		if (!selectedMake) return []
		if (!modelInput.trim()) return selectedMake.model.slice(0, 8)
		return selectedMake.model
			.filter((model) => model.toLowerCase().includes(modelInput.toLowerCase()))
			.slice(0, 8)
	}

	const handleMakeSelect = (make: string) => {
		setMakeInput(make)
		setShowMakeSuggestions(false)
		setModelInput("") // Reset model when make changes
		if (makeInputRef.current) {
			makeInputRef.current.value = make
		}
		// Auto-focus to model input
		setTimeout(() => {
			if (modelInputRef.current) {
				modelInputRef.current.focus()
			}
		}, 100)
	}

	const handleModelSelect = (model: string) => {
		setModelInput(model)
		setShowModelSuggestions(false)
		if (modelInputRef.current) {
			modelInputRef.current.value = model
		}
		// Auto-focus to year input
		setTimeout(() => {
			if (yearInputRef.current) {
				yearInputRef.current.focus()
			}
		}, 100)
	}

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/,/g, "") // Remove commas
		if (value === "" || /^\d+$/.test(value)) {
			// Only allow digits
			const numericValue = value === "" ? "" : parseInt(value, 10)
			setPriceInput(numericValue === "" ? "" : numericValue.toLocaleString())
			if (priceInputRef.current) {
				priceInputRef.current.value = value // Store raw value for form submission
			}
			// Auto-focus to color input when price has reasonable length (e.g., 6+ digits)
			if (value.length >= 5) {
				setTimeout(() => {
					if (colorInputRef.current) {
						colorInputRef.current.focus()
					}
				}, 100)
			}
		}
	}

	const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/,/g, "") // Remove commas
		if (value === "" || /^\d+$/.test(value)) {
			// Only allow digits
			const numericValue = value === "" ? "" : parseInt(value, 10)
			setMileageInput(numericValue === "" ? "" : numericValue.toLocaleString())
			if (mileageInputRef.current) {
				mileageInputRef.current.value = value // Store raw value for form submission
			}
			// Auto-focus to engine capacity when mileage has reasonable length (e.g., 4+ digits)
			if (value.length >= 4) {
				setTimeout(() => {
					if (engineCapacityInputRef.current) {
						engineCapacityInputRef.current.focus()
					}
				}, 100)
			}
		}
	}

	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		updateAddedCar({
			title: formData.get("Title") as string,
			description: formData.get("Description") as string,

			model: formData.get("Model") as string,
			make: formData.get("Make") as string,
			year: parseInt(formData.get("Year") as string),

			carStatus: "Available",
			carValidationStatus: "Available",

			price: Number(formData.get("PriceValue")),
			color: formData.get("Color") as string,
			mileage: Number(formData.get("MileageValue")) as number,

			seatingCapacity: Number(formData.get("SeatingCapacity")) as 2 | 4 | 6 | 8,
			engineCapacity: Number(formData.get("EngineCapacity")) as number,

			fuelType: formData.get("FuelType") as CarItems["fuelType"],
			carCondition: formData.get("CarCondition") as CarItems["carCondition"],
			transmissionType: formData.get(
				"TransmissionType",
			) as CarItems["transmissionType"],

			vin: formData.get("VIN") as string,
			licensePlate: formData.get("LicensePlate") as string,
		})

		// Navigate to next step after updating context
		router.push(`${pathname}?step=${currentStep + 1}`)
	}

	return (
		<form onSubmit={submit} className="w-full">
			<main className="space-y-8 p-6 sm:p-8 lg:p-10">
				<GroupInputForm
					title={"Basic Information"}
					description="Provide a compelling title and description"
				>
					<div className="flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="flex items-center justify-between text-sm font-semibold text-gray-500">
							<span>
								Title <span className="text-red-500">*</span>
							</span>
							<span
								className={`text-xs ${titleLength > MAX_TITLE_LENGTH ? "text-red-500" : "text-gray-400"}`}
							>
								{titleLength}/{MAX_TITLE_LENGTH}
							</span>
						</label>
						<input
							ref={titleInputRef}
							name="Title"
							type="text"
							placeholder="e.g., 2024 Toyota Camry - Excellent Condition"
							defaultValue={addedCar?.title || ""}
							maxLength={MAX_TITLE_LENGTH}
							onChange={(e) => {
								setTitleLength(e.target.value.length)
								// Auto-focus to description when title reaches reasonable length
								if (e.target.value.length >= 20) {
									setTimeout(() => {
										if (descriptionInputRef.current) {
											descriptionInputRef.current.focus()
										}
									}, 500)
								}
							}}
							required
							className="focus:ring-primary focus:text-primary rounded-lg border border-gray-200 px-4 py-1.5 text-black transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none"
						/>
					</div>
					<div className="col-span-2">
						<label className="mb-1 flex items-center justify-between text-sm font-semibold text-gray-500">
							<span>
								Description <span className="text-red-500">*</span>
							</span>
							<span
								className={`text-xs ${descriptionLength > MAX_DESCRIPTION_LENGTH ? "text-red-500" : "text-gray-400"}`}
							>
								{descriptionLength}/{MAX_DESCRIPTION_LENGTH}
							</span>
						</label>
						<textarea
							ref={descriptionInputRef}
							name="Description"
							rows={4}
							placeholder="Describe the vehicle's key features, condition, and any recent maintenance or upgrades..."
							defaultValue={addedCar?.description || ""}
							maxLength={MAX_DESCRIPTION_LENGTH}
							onChange={(e) => {
								setDescriptionLength(e.target.value.length)
								// Auto-focus to make input when description reaches reasonable length
								if (e.target.value.length >= 50) {
									setTimeout(() => {
										if (makeInputRef.current) {
											makeInputRef.current.focus()
										}
									}, 500)
								}
							}}
							className="focus:ring-primary w-full resize-none rounded-lg border border-gray-200 px-4 py-2 text-black transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none"
							required
						/>
					</div>
				</GroupInputForm>
				<GroupInputForm
					title="Vehicle Specification"
					description="Enter detailed vehicle specifications"
				>
					{/* Make Input with Suggestions */}
					<div className="relative flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="flex items-center gap-1 text-sm font-semibold text-gray-500">
							Make <span className="text-red-500">*</span>
							<span className="text-xs font-normal text-gray-400">
								(Start typing)
							</span>
						</label>
						<input
							ref={makeInputRef}
							name="Make"
							autoComplete="off"
							type="text"
							placeholder="e.g., Toyota, Honda, Tesla"
							value={makeInput}
							onChange={(e) => {
								setMakeInput(e.target.value)
								setShowMakeSuggestions(true)
							}}
							onFocus={() => setShowMakeSuggestions(true)}
							onBlur={() =>
								setTimeout(() => setShowMakeSuggestions(false), 200)
							}
							required
							className="focus:ring-primary focus:text-primary rounded-lg border border-gray-200 px-4 py-1.5 text-black transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none focus:placeholder:text-gray-500"
						/>
						{showMakeSuggestions && getFilteredMakes().length > 0 && (
							<div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-1 w-full max-w-[25rem] rounded-lg border border-gray-200 bg-white shadow-xl duration-200">
								<ul className="max-h-60 overflow-y-auto py-1">
									{getFilteredMakes().map((make, index) => (
										<li
											key={index}
											onClick={() => handleMakeSelect(make)}
											className="group flex cursor-pointer items-center justify-between border-l-2 border-transparent px-4 py-2.5 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
										>
											<span>{make}</span>
											<svg
												className="h-4 w-4 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* Model Input with Suggestions */}
					<div className="relative flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="flex items-center gap-1 text-sm font-semibold text-gray-500">
							Model <span className="text-red-500">*</span>
							{!makeInput && (
								<span className="text-xs font-normal text-amber-500">
									(Select make first)
								</span>
							)}
						</label>
						<input
							ref={modelInputRef}
							name="Model"
							type="text"
							autoComplete="off"
							placeholder="e.g., Camry, Civic, Model 3"
							value={modelInput}
							onChange={(e) => {
								setModelInput(e.target.value)
								setShowModelSuggestions(true)
							}}
							onFocus={() => setShowModelSuggestions(true)}
							onBlur={() =>
								setTimeout(() => setShowModelSuggestions(false), 200)
							}
							required
							disabled={!makeInput}
							className="focus:ring-primary focus:text-primary rounded-lg border border-gray-200 px-4 py-1.5 text-black transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none focus:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
						/>
						{showModelSuggestions && getFilteredModels().length > 0 && (
							<div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-1 w-full max-w-[25rem] rounded-lg border border-gray-200 bg-white shadow-xl duration-200">
								<ul className="max-h-60 overflow-y-auto py-1">
									{getFilteredModels().map((model, index) => (
										<li
											key={index}
											onClick={() => handleModelSelect(model)}
											className="group flex cursor-pointer items-center justify-between border-l-2 border-transparent px-4 py-2.5 text-sm text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
										>
											<span>{model}</span>
											<svg
												className="h-4 w-4 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* Year Select with Grid */}
					<div
						className="relative flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1"
						ref={yearDropdownRef}
					>
						<label className="text-sm font-semibold text-gray-500">
							Year <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<input
								ref={yearInputRef}
								type="text"
								value={yearInput || ""}
								placeholder="Select year"
								onClick={() => setShowYearDropdown(!showYearDropdown)}
								onFocus={() => setShowYearDropdown(true)}
								onBlur={() => setTimeout(() => setShowYearDropdown(false), 200)}
								readOnly
								required
								className="focus:ring-primary focus:text-primary w-full cursor-pointer rounded-lg border border-gray-200 px-4 py-1.5 pr-10 text-black transition-all placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none"
							/>
							<svg
								className={`absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
									showYearDropdown ? "rotate-180" : ""
								}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
						<input type="hidden" name="Year" value={yearInput} />
						{showYearDropdown && (
							<div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-1 max-h-60 w-full max-w-[25rem] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl duration-200">
								<div className="grid grid-cols-4 gap-1 p-2">
									{Array.from(
										{ length: 2026 - 1990 + 1 },
										(_, i) => 2026 - i,
									).map((year) => (
										<button
											key={year}
											type="button"
											onClick={() => {
												setYearInput(year.toString())
												setShowYearDropdown(false)
												// Auto-focus to price input after year selection
												setTimeout(() => {
													const priceInput = document.querySelector(
														'input[name="Price"]',
													) as HTMLInputElement
													if (priceInput) {
														priceInput.focus()
													}
												}, 100)
											}}
											className={`rounded-md px-2 py-1.5 text-sm transition-all hover:bg-blue-50 active:scale-95 ${
												yearInput === year.toString()
													? "bg-blue-500 font-semibold text-white shadow-sm"
													: "text-gray-700 hover:text-blue-600"
											}`}
										>
											{year}
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Price Input with Digit Formatting */}
					<div className="flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="flex items-center gap-1 text-sm font-semibold text-gray-500">
							Price (฿) <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<span className="absolute top-1/2 left-3 -translate-y-1/2 font-medium text-gray-500">
								฿
							</span>
							<input
								name="Price"
								type="text"
								placeholder="850,000"
								value={priceInput}
								onChange={handlePriceChange}
								required
								className="focus:ring-primary focus:text-primary w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-8 text-black transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none focus:placeholder:text-gray-500"
							/>
						</div>
						<input
							ref={priceInputRef}
							type="hidden"
							name="PriceValue"
							value={priceInput.replace(/,/g, "")}
						/>
						{priceInput && (
							<span className="text-xs text-gray-500">฿ {priceInput}</span>
						)}
					</div>

					<div className="flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="text-sm font-semibold text-gray-500">
							Color <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<svg
								className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
								/>
							</svg>
							<input
								ref={colorInputRef}
								name="Color"
								type="text"
								placeholder="e.g., Black, White, Silver"
								defaultValue={addedCar?.color || ""}
								onChange={(e) => {
									// Auto-focus to mileage when color is entered
									if (e.target.value.length >= 3) {
										setTimeout(() => {
											const mileageInput = document.querySelector(
												'input[name="Mileage"]',
											) as HTMLInputElement
											if (mileageInput) {
												mileageInput.focus()
											}
										}, 500)
									}
								}}
								required
								className="focus:ring-primary focus:text-primary w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-9 text-black transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none"
							/>
						</div>
					</div>

					{/* Mileage Input with Digit Formatting */}
					<div className="flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="flex items-center gap-1 text-sm font-semibold text-gray-500">
							Mileage (km) <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<svg
								className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							<input
								name="Mileage"
								type="text"
								placeholder="45,000"
								value={mileageInput}
								onChange={handleMileageChange}
								required
								className="focus:ring-primary focus:text-primary w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-9 text-black transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none focus:placeholder:text-gray-500"
							/>
						</div>
						<input
							ref={mileageInputRef}
							type="hidden"
							name="MileageValue"
							value={mileageInput.replace(/,/g, "")}
						/>
						{mileageInput && (
							<span className="text-xs text-gray-500">
								{mileageInput} kilometers
							</span>
						)}
					</div>

					<div className="flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="text-sm font-semibold text-gray-500">
							Engine Capacity (L) <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<svg
								className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
								/>
							</svg>
							<input
								ref={engineCapacityInputRef}
								name="EngineCapacity"
								type="number"
								step="0.1"
								placeholder="e.g., 2.0"
								min={0}
								defaultValue={addedCar?.engineCapacity || ""}
								onChange={(e) => {
									// Auto-focus to VIN when engine capacity is entered
									if (e.target.value.length >= 1) {
										setTimeout(() => {
											if (vinInputRef.current) {
												vinInputRef.current.focus()
											}
										}, 1000)
									}
								}}
								required
								className="focus:ring-primary focus:text-primary w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-9 text-black transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none"
							/>
						</div>
					</div>
					<div className="col-span-2">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-semibold text-gray-500">
								Seating Capacity <span className="text-red-500">*</span>
							</label>
							<RadioInputContainer title="">
								<RadioInput
									name="SeatingCapacity"
									value={2}
									defaultChecked={addedCar?.seatingCapacity === 2}
								>
									2 Seats
								</RadioInput>
								<RadioInput
									name="SeatingCapacity"
									value={4}
									defaultChecked={addedCar?.seatingCapacity === 4}
								>
									4 Seats
								</RadioInput>
								<RadioInput
									name="SeatingCapacity"
									value={6}
									defaultChecked={addedCar?.seatingCapacity === 6}
								>
									6 Seats
								</RadioInput>
								<RadioInput
									name="SeatingCapacity"
									value={8}
									defaultChecked={addedCar?.seatingCapacity === 8}
								>
									8 Seats
								</RadioInput>
							</RadioInputContainer>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-sm font-semibold text-gray-500">
							Fuel Type <span className="text-red-500">*</span>
						</label>
						<RadioInputContainer title="">
							<RadioInput
								name="FuelType"
								value={"Petrol"}
								defaultChecked={addedCar?.fuelType === "Petrol"}
							>
								Petrol
							</RadioInput>
							<RadioInput
								name="FuelType"
								value={"Diesel"}
								defaultChecked={addedCar?.fuelType === "Diesel"}
							>
								Diesel
							</RadioInput>
							<RadioInput
								name="FuelType"
								value={"Electric"}
								defaultChecked={addedCar?.fuelType === "Electric"}
							>
								Electric
							</RadioInput>
							<RadioInput
								name="FuelType"
								value={"Hybrid"}
								defaultChecked={addedCar?.fuelType === "Hybrid"}
							>
								Hybrid
							</RadioInput>
						</RadioInputContainer>
					</div>
					<div className="flex flex-col gap-2">
						<label className="text-sm font-semibold text-gray-500">
							Condition <span className="text-red-500">*</span>
						</label>
						<RadioInputContainer title="">
							<RadioInput
								name="CarCondition"
								value={"New"}
								defaultChecked={addedCar?.carCondition === "New"}
							>
								Brand New
							</RadioInput>
							<RadioInput
								name="CarCondition"
								value={"Used"}
								defaultChecked={addedCar?.carCondition === "Used"}
							>
								Pre-Owned
							</RadioInput>
						</RadioInputContainer>
					</div>
					<div className="col-span-2">
						<div className="flex flex-col gap-2">
							<label className="text-sm font-semibold text-gray-500">
								Transmission Type <span className="text-red-500">*</span>
							</label>
							<RadioInputContainer title="">
								<RadioInput
									name="TransmissionType"
									value={"Automatic"}
									defaultChecked={addedCar?.transmissionType === "Automatic"}
								>
									Automatic
								</RadioInput>
								<RadioInput
									name="TransmissionType"
									value={"Manual"}
									defaultChecked={addedCar?.transmissionType === "Manual"}
								>
									Manual
								</RadioInput>
								<RadioInput
									name="TransmissionType"
									value={"SemiAutomatic"}
									defaultChecked={
										addedCar?.transmissionType === "SemiAutomatic"
									}
								>
									Semi-Automatic
								</RadioInput>
							</RadioInputContainer>
						</div>
					</div>
				</GroupInputForm>

				<GroupInputForm
					title="Identification"
					description="Vehicle identification numbers"
				>
					<div className="flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="text-sm font-semibold text-gray-500">
							VIN Number <span className="text-red-500">*</span>
							<span className="ml-1 text-xs font-normal text-gray-400">
								(17 characters)
							</span>
						</label>
						<div className="relative">
							<svg
								className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<input
								ref={vinInputRef}
								name="VIN"
								type="text"
								autoComplete="off"
								placeholder="e.g., 1HGBH41JXMN109186"
								maxLength={17}
								defaultValue={addedCar?.vin || ""}
								onChange={(e) => {
									// Auto-focus to license plate when VIN is complete (17 characters)
									if (e.target.value.length === 17) {
										setTimeout(() => {
											if (licensePlateInputRef.current) {
												licensePlateInputRef.current.focus()
											}
										}, 100)
									}
								}}
								required
								className="focus:ring-primary focus:text-primary w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-9 text-black uppercase transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none"
							/>
						</div>
					</div>
					<div className="flex w-full max-w-[25rem] min-w-[10rem] flex-col gap-1">
						<label className="text-sm font-semibold text-gray-500">
							License Plate <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<svg
								className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
								/>
							</svg>
							<input
								ref={licensePlateInputRef}
								name="LicensePlate"
								type="text"
								autoComplete="off"
								placeholder="e.g., ABC-1234"
								defaultValue={addedCar?.licensePlate || ""}
								required
								className="focus:ring-primary focus:text-primary w-full rounded-lg border border-gray-200 py-1.5 pr-4 pl-9 text-black uppercase transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none"
							/>
						</div>
					</div>
				</GroupInputForm>
				<div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
					<StepNavigation isSubmitForm={true} />
				</div>
			</main>
		</form>
	)
}

const StepNavigation = ({
	isSubmitForm = false,
}: {
	isSubmitForm?: boolean
}) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const currentStep = Number(searchParams.get("step") ?? 1)
	const currentPath = usePathname()

	const onNext = () => {
		if (currentStep < AddNewCarSteps.length) {
			router.push(`${currentPath}?step=${currentStep + 1}`)
		}
	}

	const onBack = () => {
		if (currentStep > 1) {
			router.push(`${currentPath}?step=${currentStep - 1}`)
		} else {
			router.push("/profile/dealer/cars")
		}
	}

	return (
		<div className="flex gap-3">
			<button
				type="button"
				onClick={onBack}
				className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
			>
				{currentStep === 1 ? "Cancel" : "Back"}
			</button>
			{isSubmitForm ? (
				<Button width="half" type="submit">
					Continue →
				</Button>
			) : (
				<Button width="half" onClick={onNext}>
					Continue →
				</Button>
			)}
		</div>
	)
}

const GroupInputForm = ({
	title,
	description,
	children,
}: {
	title: string
	description?: string
	children: ReactNode
}) => {
	return (
		<div id="basic-information" className="space-y-4">
			<div className="border-primary-500 border-l-4 pl-4">
				<h2 className="text-xl font-bold text-gray-900">{title}</h2>
				{description && (
					<p className="mt-1 text-sm text-gray-600">{description}</p>
				)}
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
		</div>
	)
}

export interface IFileProps {
	id: number
	progress: string
	url: string
	file: File
}

const CarImageUpload = () => {
	const [files, setFiles] = useState<IFileProps[]>([])
	const nextId = useRef(1)
	const { updateAddedCar, addedCar } = useVehicleContext()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const currentStep = Number(searchParams.get("step") ?? 1)

	// Load existing images from context on mount
	useEffect(() => {
		if (addedCar?.carImages && addedCar.carImages.length > 0) {
			const existingFiles: IFileProps[] = addedCar.carImages.map(
				(file, index) => ({
					id: nextId.current++,
					file: file,
					progress: "Uploaded",
					url: URL.createObjectURL(file),
				}),
			)
			setFiles(existingFiles)
		}
	}, [])

	/* TODO: implement progress bar using FileReader */
	// const reader = new FileReader();
	//   reader.onprogress = (event) => {
	//     if (event.lengthComputable) {
	//       const percent = Math.round((event.loaded / event.total) * 100);
	//       setProgress(percent);
	//     }
	//   };

	useEffect(() => {
		files.forEach((mainfile) => {
			if (mainfile.progress === "Uploading...") {
				const reader = new FileReader()
				reader.onload = () => {
					setTimeout(() => {
						setFiles((file) =>
							file.map((prev) =>
								prev.id === mainfile.id
									? { ...prev, progress: "Uploaded" }
									: prev,
							),
						)
					}, 1000)
				}

				reader.readAsArrayBuffer(mainfile.file)
			}
		})
	}, [files])

	const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
		if (!e.currentTarget.files) return
		const uploadedfiles = Array.from(e.currentTarget.files)
		// When Image upload, need to convert the file into preview and display

		setFiles((file) => [
			...file,
			...uploadedfiles.map((file) => ({
				id: nextId.current++,
				file: file,
				progress: "Uploading...",
				url: URL.createObjectURL(file),
			})),
		])
	}

	const removeFile = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
		e.preventDefault()
		setFiles((prev) => prev.filter((file) => file.id !== id))
	}

	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const carImages: File[] = files.map((file) => file.file)

		updateAddedCar({ carImages })

		// Navigate to next step after updating context
		router.push(`${pathname}?step=${currentStep + 1}`)
	}

	return (
		<form onSubmit={submit} className="p-6 sm:p-8 lg:p-10">
			<div className="space-y-6">
				<div>
					<div className="border-primary-500 mb-6 border-l-4 pl-4">
						<h2 className="text-xl font-bold text-gray-900">Vehicle Images</h2>
						<p className="mt-1 text-sm text-gray-600">
							Upload high-quality photos from multiple angles
						</p>
					</div>
					<div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
						<h6 className="mb-2 text-sm font-semibold text-blue-900">
							📸 Photo Tips:
						</h6>
						<ul className="list-inside list-disc space-y-1 text-xs text-blue-800">
							<li>Front, back, both sides, and interior views</li>
							<li>Dashboard and odometer reading</li>
							<li>Engine bay and any unique features</li>
							<li>Good lighting, clean background</li>
						</ul>
					</div>
					<div className="mb-6">
						<label className="hover:from-primary-50 hover:to-primary-100 hover:border-primary-400 flex w-full cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 p-12 transition-all">
							<div className="bg-primary-100 mb-4 rounded-full p-4">
								<ImageUp className="text-primary-600 h-10 w-10" />
							</div>
							<span className="mb-2 text-base font-semibold text-gray-700">
								Click to upload images
							</span>
							<span className="text-sm text-gray-500">
								PNG or JPG up to 10MB each
							</span>
							<input
								type="file"
								accept="image/*"
								className="hidden"
								multiple
								onChange={handleFileChange}
							/>
						</label>
						<p className="pt-3 text-center text-sm text-gray-500">
							✨ <span className="font-medium">Minimum 3 images required</span>{" "}
							- More photos increase buyer interest!
						</p>
					</div>
					{files.length > 0 && (
						<div>
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-lg font-bold text-gray-900">
									Uploaded Images ({files.length})
								</h3>
								<span className="text-xs text-gray-500">
									Click image to preview
								</span>
							</div>
							<div className="max-h-96 space-y-3 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
								{files.map((file, index) => {
									const sizeInMb = (file.file.size / (1024 * 1024)).toFixed(2)
									const preview = URL.createObjectURL(file.file)
									return (
										<div
											key={index}
											className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md"
										>
											<div className="relative shrink-0">
												<Image
													src={preview}
													alt={`Preview ${index + 1}`}
													width={80}
													height={80}
													className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
												/>
												<span className="bg-primary-500 absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
													{index + 1}
												</span>
											</div>
											<div className="min-w-0 flex-1">
												<h3 className="truncate font-medium text-gray-900">
													{file.file.name}
												</h3>
												<p className="text-sm text-gray-500">{sizeInMb} MB</p>
												<div className="mt-1 flex items-center gap-2">
													{file.progress === "Uploading..." && (
														<span className="flex items-center gap-1 text-xs text-blue-600">
															<span className="animate-spin">⏳</span>{" "}
															Uploading...
														</span>
													)}
													{file.progress === "Uploaded" && (
														<span className="flex items-center gap-1 text-xs text-green-600">
															✓ Ready
														</span>
													)}
												</div>
											</div>
											<button
												onClick={(e) => removeFile(e, file.id)}
												className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500 transition-colors hover:bg-red-600"
												title="Remove image"
											>
												<Trash2 className="h-5 w-5 text-white" />
											</button>
										</div>
									)
								})}
							</div>
						</div>
					)}
				</div>
			</div>
			{files.length > 0 && (
				<div className="mt-6 flex w-full justify-center">
					<label
						htmlFor="file-input"
						className="border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:border-primary-400 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-6 py-3 font-semibold transition-colors"
					>
						<input
							type="file"
							id="file-input"
							accept="image/*"
							className="hidden"
							multiple
							onChange={handleFileChange}
						/>
						<Plus className="h-5 w-5" />
						<span>Add More Images</span>
					</label>
				</div>
			)}
			<div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
				<StepNavigation isSubmitForm={true} />
			</div>
		</form>
	)
}

export default AddNewCar
