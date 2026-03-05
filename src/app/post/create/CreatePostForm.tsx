"use client"

import { useToast } from "@/app/hooks/useToast"
import { CarItems } from "@/types/car.types"
import { CreatePostData } from "@/types/post.types"
import { CarCard } from "@/components/Car/CarCard"
import { createPost } from "@/utils/API/PostAPI"
import {
	Car,
	Check,
	ChevronLeft,
	ChevronRight,
	Eye,
	FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useCreatePostContext } from "./CreatePostContext"

interface CreatePostFormProps {
	dealerCars: CarItems[]
}

const CreatePostForm = ({ dealerCars }: CreatePostFormProps) => {
	const router = useRouter()
	const { postData, updatePostData, resetPostData } = useCreatePostContext()
	const [currentStep, setCurrentStep] = useState(1)
	const { ToastComponent, addToastMessage } = useToast({
		toastType: null,
		message: null,
	})

	const steps = [
		{ number: 1, name: "Select Car", icon: Car },
		{ number: 2, name: "Post Details", icon: FileText },
		{ number: 3, name: "Review", icon: Eye },
	]

	const selectedCar = dealerCars.find((car) => car.id === postData.carId)

	const handleNext = () => {
		if (currentStep === 1 && !postData.carId) {
			alert("Please select a car")
			return
		}
		if (
			currentStep === 2 &&
			(!postData.caption.trim() || !postData.content.trim())
		) {
			alert("Please fill in caption and content")
			return
		}
		if (currentStep < 3) {
			setCurrentStep(currentStep + 1)
		}
	}

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1)
		}
	}

	const handlePublish = async (data: CreatePostData) => {
		console.log("Publishing post:", postData)
		try {
			const response = await createPost(data)

			if (response?.isSuccess) {
				addToastMessage("success", "Post published successfully!")
				setTimeout(() => {
					router.push("/post/discover")
				}, 2500)
			}
		} catch (error) {
			addToastMessage("error", "Failed to publish post. Please try again.")
		}
	}

	return (
		<>
			<ToastComponent />
			<div className="min-h-screen from-gray-50 via-gray-100 to-gray-50 py-8">
				<div className="mx-auto max-w-4xl px-4">
					{/* Header */}
					<div className="mb-8">
						<h1 className="mb-2 text-3xl font-bold text-gray-900">
							Create New Post
						</h1>
						<p className="text-gray-600">
							Share your vehicle with potential buyers
						</p>
					</div>

					{/* Progress Steps */}
					<div className="mb-8 flex justify-center">
						<div className="flex items-center gap-0">
							{steps.map((step, index) => {
								const StepIcon = step.icon
								const isCompleted = currentStep > step.number
								const isCurrent = currentStep === step.number

								return (
									<>
										{/* Step */}
										<div
											key={step.number}
											className="flex flex-col items-center"
										>
											<div
												className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${
													isCompleted
														? "bg-primary-500 border-primary-500"
														: isCurrent
															? "border-primary-500 bg-white"
															: "border-gray-300 bg-white"
												}`}
											>
												{isCompleted ? (
													<Check className="h-6 w-6 text-white" />
												) : (
													<StepIcon
														className={`h-6 w-6 ${
															isCurrent ? "text-primary-600" : "text-gray-400"
														}`}
													/>
												)}
											</div>
											<span
												className={`mt-2 text-sm font-medium whitespace-nowrap ${
													isCurrent ? "text-primary-600" : "text-gray-600"
												}`}
											>
												{step.name}
											</span>
										</div>

										{/* Bar between steps */}
										{index < steps.length - 1 && (
											<div
												key={`bar-${step.number}`}
												className={`mx-4 h-0.5 w-40 transition-all duration-200 ${
													currentStep > step.number
														? "bg-primary-500"
														: "bg-gray-300"
												}`}
												style={{ marginTop: "-20px" }}
											/>
										)}
									</>
								)
							})}
						</div>
					</div>

					{/* Form Content */}
					<div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
						<div className="p-8">
							{/* Step 1: Select Car */}
							{currentStep === 1 && (
								<div>
									<h2 className="mb-6 text-2xl font-bold text-gray-900">
										Select a Vehicle
									</h2>
									<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
										{dealerCars.map((car) => (
											<div
												key={car.id}
												onClick={() => updatePostData({ carId: car.id })}
												className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
													postData.carId === car.id
														? "border-primary-500 ring-primary-200 shadow-lg ring-2"
														: "border-transparent hover:border-gray-300"
												}`}
											>
												{postData.carId === car.id && (
													<div className="bg-primary-500 absolute top-2 right-2 z-10 rounded-full p-1.5 shadow-lg">
														<Check className="h-5 w-5 text-white" />
													</div>
												)}
												<div className="pointer-events-none">
													<CarCard carItem={car} />
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Step 2: Post Details */}
							{currentStep === 2 && (
								<div>
									<h2 className="mb-6 text-2xl font-bold text-gray-900">
										Post Details
									</h2>
									<div className="space-y-6">
										<div>
											<label className="mb-2 block text-sm font-semibold text-gray-700">
												Caption *
											</label>
											<input
												type="text"
												value={postData.caption}
												onChange={(e) =>
													updatePostData({ caption: e.target.value })
												}
												placeholder="e.g., Check out this amazing Toyota Camry!"
												className="focus:ring-primary-500 w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2"
												maxLength={100}
											/>
											<p className="mt-1 text-xs text-gray-500">
												{postData.caption.length}/100 characters
											</p>
										</div>

										<div>
											<label className="mb-2 block text-sm font-semibold text-gray-700">
												Content *
											</label>
											<textarea
												value={postData.content}
												onChange={(e) =>
													updatePostData({ content: e.target.value })
												}
												placeholder="Describe your vehicle in detail. Include key features, condition, history, and why it's a great choice..."
												rows={8}
												className="focus:ring-primary-500 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2"
												maxLength={500}
											/>
											<p className="mt-1 text-xs text-gray-500">
												{postData.content.length}/500 characters
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Step 3: Review */}
							{currentStep === 3 && selectedCar && (
								<div>
									<h2 className="mb-6 text-2xl font-bold text-gray-900">
										Review Your Post
									</h2>
									<div className="space-y-6">
										{/* Selected Car Preview */}
										<div>
											<h3 className="mb-3 text-sm font-semibold text-gray-700">
												Selected Vehicle
											</h3>
											<div className="max-w-sm">
												<CarCard carItem={selectedCar} />
											</div>
										</div>

										{/* Post Content Preview */}
										<div>
											<h3 className="mb-3 text-sm font-semibold text-gray-700">
												Post Content
											</h3>
											<div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
												<h4 className="mb-3 text-xl font-bold text-gray-900">
													{postData.caption}
												</h4>
												<p className="leading-relaxed whitespace-pre-wrap text-gray-700">
													{postData.content}
												</p>
											</div>
										</div>

										{/* Warning */}
										<div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
											<div className="flex items-start gap-3">
												<Eye className="mt-0.5 h-5 w-5 text-blue-600" />
												<div>
													<p className="mb-1 text-sm font-semibold text-blue-900">
														Ready to publish?
													</p>
													<p className="text-sm text-blue-800">
														Once published, your post will be visible to all
														users. Make sure all information is accurate.
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Navigation Buttons */}
					<div className="flex items-center justify-between">
						<button
							onClick={handleBack}
							disabled={currentStep === 1}
							className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<ChevronLeft className="h-5 w-5" />
							Back
						</button>

						<div className="flex gap-3">
							<button
								onClick={() => router.push("/post/discover")}
								className="rounded-lg border-2 border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
							>
								Cancel
							</button>

							{currentStep < 3 ? (
								<button
									onClick={handleNext}
									className="bg-primary-500 from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:shadow-lg"
								>
									Next
									<ChevronRight className="h-5 w-5" />
								</button>
							) : (
								<button
									onClick={() => handlePublish(postData)}
									className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
								>
									<Check className="h-5 w-5" />
									Publish Post
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CreatePostForm
