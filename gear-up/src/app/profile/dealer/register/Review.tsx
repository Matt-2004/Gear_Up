import { kycRegister } from "@/utils/FetchAPI"

import { useRouter } from "next/navigation"
import { useKycRegisterContext } from "./context/KycRegisterContext"
import { StepNavigation } from "./StepNavigation"

const Review = () => {
	const router = useRouter()
	const { kycData } = useKycRegisterContext()

	if (!kycData.SelfieImage || !kycData.Kyc || !kycData.DocumentType) {
		return (
			<h1 className="flex justify-center text-red-500">
				KYC data are missing!!
			</h1>
		)
	}

	const onSubmit = async () => {
		if (!kycData.SelfieImage || !kycData.Kyc || !kycData.DocumentType) {
			throw new Error("Missing KYC data")
		}
		// change the data to formdata
		const formdata = new FormData()
		formdata.append("DocumentType", kycData.DocumentType)
		kycData.Kyc.forEach((file) => {
			formdata.append("Kyc", file)
		})
		formdata.append("SelfieImage", kycData.SelfieImage)
		// call the api

		const res = await kycRegister(formdata)
		if (res) {
			router.replace("/")
		}
	}
	return (
		<form
			action={onSubmit}
			className="w-full max-w-2xl rounded-xl bg-gray-800 p-8"
		>
			<h3 className="mb-6 text-2xl font-bold text-white">
				Review Your Information
			</h3>
			<div className="space-y-4">
				<div className="flex items-center justify-between border-b border-gray-700 py-3">
					<span className="text-gray-400">Document Type:</span>
					<span className="font-medium text-white capitalize">
						{(kycData.DocumentType && kycData.DocumentType.replace("_", " ")) ||
							"Not selected"}
					</span>
				</div>
				<div className="border-b border-gray-700 py-3">
					<div className="mb-2 flex items-center justify-between">
						<span className="text-gray-400">Document Files:</span>
						<span className="font-medium text-white">
							{kycData.Kyc.length > 0
								? `${kycData.Kyc.length} file(s)`
								: "✗ Missing"}
						</span>
					</div>
					{kycData.Kyc.length > 0 && (
						<ul className="mt-2 space-y-1">
							{kycData.Kyc.map((file, index) => (
								<li
									key={index}
									className="flex items-center gap-2 text-sm text-green-400"
								>
									<svg
										className="h-4 w-4"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="flex items-center justify-between border-b border-gray-700 py-3">
					<span className="text-gray-400">Selfie Photo:</span>
					<span className="font-medium text-white">
						{kycData.SelfieImage ? (
							<span className="text-green-400">
								✓ {kycData.SelfieImage.name}
							</span>
						) : (
							"✗ Missing"
						)}
					</span>
				</div>
			</div>
			<div className="mt-6 rounded-lg border border-blue-700 bg-blue-900/30 p-4">
				<p className="text-sm text-blue-300">
					Please review all information carefully. Once submitted, you cannot
					edit your KYC application.
				</p>
			</div>
			<StepNavigation />
		</form>
	)
}

export default Review
