"use client"

import { DocId } from "@/app/types/kycRegister.types"
import clsx from "clsx"
import Image from "next/image"
import { FormEvent, useState } from "react"
import { useKycRegisterContext } from "./context/KycRegisterContext"
import { StepNavigation } from "./StepNavigation"

interface IDocType {
	id: DocId
	label: string
	description: string
	pathIcon: string
}

const DOCUMENT_TYPES: IDocType[] = [
	{
		id: "Passport",
		label: "Passport",
		description: "International travel document",
		pathIcon: "/passport.png",
	},
	{
		id: "NationalId",
		label: "National ID Card",
		description: "Government-issued ID card",
		pathIcon: "/nationalID.png",
	},
	{
		id: "DriverLicense",
		label: "Driver's License",
		description: "Valid driving permit",
		pathIcon: "/driving-license.png",
	},
	{
		id: "UtilityBill",
		label: "Utility Bill ",
		description: "Recent utilit bill",
		pathIcon: "/pay.png",
	},
	{
		id: "Other",
		label: "Other",
		description: "Valid driving permit",
		pathIcon: "/clipboard.png",
	},
]

const DocumentType = () => {
	const { kycData, updateKycData } = useKycRegisterContext()
	const [selected, setSelected] = useState<DocId>(
		kycData.DocumentType ?? "Passport",
	)
	console.log(kycData)

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		updateKycData({ DocumentType: selected })
	}

	return (
		<form
			onSubmit={onSubmit}
			className="w-full max-w-2xl rounded-xl bg-gray-800 p-8"
		>
			<h3 className="mb-3 text-2xl font-bold text-white">
				Select Document Type
			</h3>
			<p className="mb-6 text-gray-400">
				Choose the type of identification document you will be uploading
			</p>

			<div className="grid grid-cols-1 gap-4">
				{DOCUMENT_TYPES.map((doc) => (
					<label
						key={doc.id}
						className={clsx(
							"block cursor-pointer rounded-lg border-2 p-6 transition-all duration-200",
							selected === doc.id
								? "border-blue-500 bg-blue-900/30"
								: "bg-gray-750 border-gray-700 hover:border-gray-600 hover:bg-gray-700",
						)}
					>
						<input
							type="radio"
							name="DocumentType"
							value={doc.id as string}
							checked={selected === doc.id}
							onChange={() => setSelected(doc.id)}
							className="hidden"
						/>

						<div className="flex items-start gap-4">
							<Image
								alt={doc.id as string}
								src={doc.pathIcon}
								width={50}
								height={50}
							/>

							<div className="flex-1">
								<h4 className="text-lg font-semibold text-white">
									{doc.label}
								</h4>
								<p className="mt-1 text-sm text-gray-400">{doc.description}</p>
							</div>
						</div>
					</label>
				))}
			</div>
			<StepNavigation />
		</form>
	)
}

export default DocumentType
