"use client"

import React, { useState } from "react"
import clsx from "clsx"
import Image from "next/image"

interface FileItem {
	id: string
	file: File | null
	preview: string
	label: string
}

interface KycUploadProps {
	documentType: string
	onUploadFiles: (files: File[]) => void
}

const KycUpload: React.FC<KycUploadProps> = ({
	documentType,
	onUploadFiles,
}) => {
	const [fileItems, setFileItems] = useState<FileItem[]>([
		{ id: "1", file: null, preview: "", label: "Front Side" },
		{ id: "2", file: null, preview: "", label: "Back Side" },
	])

	const getDocumentLabel = () => {
		const labels: Record<string, string> = {
			passport: "Passport",
			national_id: "National ID Card",
			drivers_license: "Driver's License",
		}
		return labels[documentType] || "Document"
	}

	const handleFileChange = (id: string, file: File | null) => {
		const updatedItems = fileItems.map((item) => {
			if (item.id === id && file) {
				const preview = URL.createObjectURL(file)
				return { ...item, file, preview }
			}
			return item
		})

		setFileItems(updatedItems)

		// Send array of files to parent (filter out nulls)
		const validFiles = updatedItems
			.filter((item) => item.file !== null)
			.map((item) => item.file!)
		onUploadFiles(validFiles)
	}

	const handleAddFile = () => {
		const newId = (fileItems.length + 1).toString()
		setFileItems([
			...fileItems,
			{
				id: newId,
				file: null,
				preview: "",
				label: `Additional Document ${fileItems.length - 1}`,
			},
		])
	}

	const handleRemoveFile = (id: string) => {
		if (fileItems.length > 2) {
			const updatedItems = fileItems.filter((item) => item.id !== id)
			setFileItems(updatedItems)

			// Update parent with remaining files
			const validFiles = updatedItems
				.filter((item) => item.file !== null)
				.map((item) => item.file!)
			onUploadFiles(validFiles)
		}
	}

	const handleLabelChange = (id: string, label: string) => {
		setFileItems(
			fileItems.map((item) => (item.id === id ? { ...item, label } : item)),
		)
	}

	return (
		<div className="w-full max-w-2xl rounded-xl bg-gray-800 p-8">
			<h3 className="mb-3 text-2xl font-bold text-white">
				Upload {getDocumentLabel()}
			</h3>
			<p className="mb-6 text-gray-400">
				Please upload clear photos of your {getDocumentLabel().toLowerCase()}.
				You can add multiple documents.
			</p>

			<div className="space-y-4">
				{fileItems.map((item) => (
					<div
						key={item.id}
						className="bg-gray-750 rounded-lg border border-gray-700 p-4"
					>
						<div className="mb-3 flex items-center justify-between">
							<div className="flex-1">
								<label className="mb-1 block text-sm font-medium text-gray-300">
									Document Label
								</label>
								<input
									disabled={true}
									type="text"
									value={item.label}
									onChange={(e) => handleLabelChange(item.id, e.target.value)}
									placeholder="e.g., Front Side, Back Side"
									className="w-full rounded-md border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
								/>
							</div>
							{fileItems.length > 2 && (
								<button
									type="button"
									onClick={() => handleRemoveFile(item.id)}
									className="ml-3 text-sm font-medium text-red-400 hover:text-red-300"
								>
									Remove
								</button>
							)}
						</div>

						<div
							className={clsx(
								"rounded-lg border-2 border-dashed p-6 transition-all duration-200",
								item.file
									? "border-green-500 bg-green-900/20"
									: "border-gray-600 hover:border-gray-500",
							)}
						>
							{item.preview ? (
								<div className="relative">
									<Image
										src={item.preview}
										alt={`${item.label} preview`}
										className="h-48 w-full rounded-lg object-contain"
										width={50}
										height={50}
									/>
									<div className="mt-3 flex items-center justify-between rounded-lg bg-gray-900 p-2">
										<span className="flex-1 truncate text-sm text-gray-300">
											{item.file?.name}
										</span>
										<label className="ml-3 cursor-pointer rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium transition-colors hover:bg-blue-700">
											Change
											<input
												type="file"
												accept="image/*,.pdf"
												onChange={(e) =>
													handleFileChange(item.id, e.target.files?.[0] || null)
												}
												className="hidden"
											/>
										</label>
									</div>
								</div>
							) : (
								<label className="flex cursor-pointer flex-col items-center">
									<svg
										className="mb-3 h-12 w-12 text-gray-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
										/>
									</svg>
									<span className="mb-1 text-sm text-gray-400">
										Click to upload
									</span>
									<span className="text-xs text-gray-500">
										PNG, JPG, PDF up to 10MB
									</span>
									<input
										type="file"
										accept="image/*,.pdf"
										onChange={(e) =>
											handleFileChange(item.id, e.target.files?.[0] || null)
										}
										className="hidden"
									/>
								</label>
							)}
						</div>
					</div>
				))}

				{/* Add More Files Button */}
				<button
					type="button"
					onClick={handleAddFile}
					className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-600 py-3 text-gray-400 transition-all duration-200 hover:border-blue-500 hover:text-blue-400"
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Add Another Document
				</button>
			</div>

			{/* Upload Summary */}
			<div className="mt-6 rounded-lg border border-blue-700 bg-blue-900/30 p-4">
				<div className="mb-2 flex items-center justify-between">
					<p className="text-sm font-medium text-blue-200">Upload Summary</p>
					<span className="text-sm text-blue-300">
						{fileItems.filter((item) => item.file).length} / {fileItems.length}{" "}
						uploaded
					</span>
				</div>
				<p className="text-xs text-blue-300">
					Total size:{" "}
					{(
						fileItems.reduce((sum, item) => sum + (item.file?.size || 0), 0) /
						1024 /
						1024
					).toFixed(2)}{" "}
					MB
				</p>
			</div>

			{/* Upload Tips */}
			<div className="mt-4 rounded-lg border border-yellow-700 bg-yellow-900/30 p-4">
				<div className="flex items-start gap-3">
					<svg
						className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					<div>
						<p className="text-sm font-medium text-yellow-200">Upload Tips</p>
						<ul className="mt-1 list-inside list-disc space-y-1 text-sm text-yellow-300">
							<li>Ensure all text is clearly readable</li>
							<li>Avoid glare and shadows</li>
							<li>Include all corners of the document</li>
							<li>Use landscape orientation for best results</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default KycUpload
