"use client"

import Button from "@/components/Common/Button"
import Input, {
	RadioInput,
	RadioInputContainer,
} from "@/components/Common/Input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { CarItems } from "@/app/types/car.types"
import { ImageUp, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react"
import { ISteps } from "../../register/KycRegister"
import { ProgressSteps } from "../../register/ProgressSteps"
import { useVehicleContext } from "./AddNewCarContext"
import Review from "./Review"

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
			className={"min-w-screen space-y-4 sm:md:px-4"}
		>
			<div className="mt-10 flex justify-center">
				<ProgressSteps Steps={AddNewCarSteps} />
			</div>
			<div className={"mx-auto rounded-xl py-8 lg:w-[90%] xl:w-[75%]"}>
				{step === "1" && <FillDetails />}
				{step === "2" && <CarImageUpload />}
				{step === "3" && <Review />}
			</div>
		</div>
	)
}

const FillDetails = () => {
	const { updateAddedCar } = useVehicleContext()

	const submit = (formData: FormData) => {
		updateAddedCar({
			title: formData.get("Title") as string,
			description: formData.get("Description") as string,

			model: formData.get("Model") as string,
			make: formData.get("Make") as string,
			year: Number(formData.get("Year")) as number,

			carStatus: "Available",
			carValidationStatus: "Available",

			price: Number(formData.get("Price")),
			color: formData.get("Color") as string,
			mileage: Number(formData.get("Mileage")) as number,

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
	}

	return (
		<form action={submit} className="w-full rounded-xl bg-white">
			<main className="mx-auto flex flex-col items-center gap-10 py-8">
				<GroupInputForm title={"Basic Information"}>
					<Input name="Title" type="text" placeholder="Enter listing title">
						Title
					</Input>
					<Input
						name="Description"
						type="text"
						placeholder="Enter vehicle description"
					>
						Description
					</Input>
				</GroupInputForm>
				<GroupInputForm title="Vehicle Specification">
					<Input
						name="Model"
						type="text"
						placeholder="e.g. Camry, Civic, Model 3,..."
					>
						Model
					</Input>
					<div className="flex gap-2">
						<Input
							name="Make"
							type="text"
							placeholder="e.g. Toyota, Honda, Tesla,..."
						>
							Make
						</Input>
						<Input
							name="Year"
							type="month"
							min={1990}
							max={2025}
							placeholder="Select year"
						>
							Year
						</Input>
					</div>
					<Input name="Price" type="number" placeholder="Enter price (baht)">
						Price
					</Input>
					<Input
						name="Color"
						type="text"
						placeholder="e.g. Black, White, Silver"
					>
						Color
					</Input>
					<Input name="Mileage" type="text" placeholder="e.g. 45,000km">
						Mileage
					</Input>
					<Input name="EngineCapacity" type="text" placeholder="e.g. 2.0L">
						Engine Capacity
					</Input>
					<RadioInputContainer title="Seating Capacity">
						<RadioInput name="SeatingCapacity" value={2}>
							2
						</RadioInput>
						<RadioInput name="SeatingCapacity" value={4}>
							4
						</RadioInput>
						<RadioInput name="SeatingCapacity" value={6}>
							6
						</RadioInput>
						<RadioInput name="SeatingCapacity" value={8}>
							8
						</RadioInput>
					</RadioInputContainer>

					<RadioInputContainer title="Fuel Type">
						<RadioInput name="FuelType" value={"Petrol"}>
							Petrol
						</RadioInput>
						<RadioInput name="FuelType" value={"Diesel"}>
							Diesel
						</RadioInput>
						<RadioInput name="FuelType" value={"EV"}>
							EV
						</RadioInput>
						<RadioInput name="FuelType" value={"Hybrid"}>
							Hybrid
						</RadioInput>
					</RadioInputContainer>
					<RadioInputContainer title="Car Condition">
						<RadioInput name="CarCondition" value={"New"}>
							New
						</RadioInput>
						<RadioInput name="CarCondition" value={"Used"}>
							Used
						</RadioInput>
					</RadioInputContainer>
					{/* <Input type="text">Transmission Type</Input> */}
					<RadioInputContainer title="Transmission Type">
						<RadioInput name="TransmissionType" value={"Auto"}>
							Auto
						</RadioInput>
						<RadioInput name="TransmissionType" value={"Manual"}>
							Manual
						</RadioInput>
						<RadioInput name="TransmissionType" value={"Dual-clutch"}>
							Dual-Clutch
						</RadioInput>
					</RadioInputContainer>
				</GroupInputForm>

				<GroupInputForm title="Identification">
					<Input name="VIN" type="text" placeholder="17-character VIN">
						VIN
					</Input>
					<Input
						name="LicensePlate"
						type="text"
						placeholder="Enter license plate number"
					>
						Licence Plate
					</Input>
				</GroupInputForm>
				<div className="flex w-7/8 justify-end">
					<StepNavigation />
				</div>
			</main>
		</form>
	)
}

const StepNavigation = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const currentStep = Number(searchParams.get("step") ?? 1)
	const currentPath = usePathname()

	const onNext = () => {
		if (currentStep < AddNewCarSteps.length) {
			router.push(`${currentPath}?step=${currentStep + 1}`)
		}
	}
	return (
		<Button width="half" onClick={onNext}>
			Next
		</Button>
	)
}

const GroupInputForm = ({
	title,
	children,
}: {
	title: string
	children: ReactNode
}) => {
	return (
		<div id="basic-information" className="flex w-7/8 flex-col gap-5">
			<h1>{title}</h1>
			<div className="columns-2 space-y-3">{children}</div>
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
	const { updateAddedCar } = useVehicleContext()

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
	}

	return (
		<form
			onSubmit={submit}
			className="shadow-background broder mx-auto w-full max-w-2xl rounded-xl border-white bg-white p-8 shadow-lg"
		>
			<div className="">
				<div className="space-y-2">
					<h3 className="text-xl font-semibold text-black">Vehicle Images</h3>
					<h6 className="mb-6 text-sm text-red-500">
						Recommended: Front, Back, Interior, Dashboard
					</h6>
					<div className="mb-6">
						<label className="bg-background flex w-full cursor-pointer flex-col items-center rounded-xl border border-dashed border-gray-300 p-16">
							<ImageUp className="m-4 h-9 w-9 text-gray-500" />
							<span className="mb-1 text-sm text-gray-500">
								Click to upload
							</span>
							<span className="text-xs text-gray-600">
								PNG, JPG, PDF up to 10MB
							</span>
							<input
								type="file"
								accept="image/*,.pdf"
								className="hidden"
								multiple
								onChange={handleFileChange}
							/>
						</label>
						<h4 className="pt-1 text-sm text-gray-400">
							Please upload at least 3 images to continue
						</h4>
					</div>
					{files.length > 0 && (
						<>
							<h3 className="text-xl font-semibold text-black">
								Uploaded Files
							</h3>
							<h6 className="mb-6 text-sm text-gray-400">Click to preview</h6>
							<div className="bg-background max-h-[14rem] space-y-2 overflow-y-auto rounded-xl border-gray-500 p-4">
								{files.map((file, index) => {
									const sizeInMb = (file.file.size / (1024 * 1024)).toFixed(2)
									const preview = URL.createObjectURL(file.file)
									return (
										<div
											key={index}
											className="flex items-center justify-between gap-6 rounded-lg border border-gray-400 bg-white p-3 shadow-sm shadow-white"
										>
											<Image
												src={preview}
												alt={index.toString()}
												width={50}
												height={50}
												className="h-16 object-cover"
											/>
											<div className="flex w-full flex-col truncate">
												<h3 className="font-semibold text-black">
													{file.file.name}
												</h3>

												<h6 className="text-sm text-gray-500">{sizeInMb}MB</h6>
												<h6 className="text-sm text-green-600">
													{file.progress}
												</h6>
											</div>
											<button
												onClick={(e) => removeFile(e, file.id)}
												className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg bg-red-500"
											>
												<Trash2 className="h-6 w-6 text-red-200" />
											</button>
										</div>
									)
								})}
							</div>
						</>
					)}
				</div>
			</div>
			{files.length > 0 && (
				<div className="mt-8 flex w-full justify-center">
					<label
						htmlFor="file-input"
						className="flex w-full max-w-[12rem] cursor-pointer justify-center rounded-lg bg-green-300 px-8 py-2 text-gray-500 hover:bg-green-500 hover:text-green-100"
					>
						<input
							type="file"
							id="file-input"
							accept="image/*,.pdf"
							className="hidden"
							multiple
							onChange={handleFileChange}
						/>
						<h1 className="flex items-center gap-1">
							<Plus className="h-5 w-5" /> Add more
						</h1>
					</label>
				</div>
			)}
			<div className="flex justify-end">
				<StepNavigation />
			</div>
		</form>
	)
}

export default AddNewCar
