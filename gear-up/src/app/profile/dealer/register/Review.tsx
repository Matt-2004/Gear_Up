import { AlertCircle, Camera, CheckCircle, CreditCard, FileText } from "lucide-react"
import { useKycRegisterContext } from "./context/KycRegisterContext"
import { StepNavigation } from "./StepNavigation"

const Review = () => {
	const { kycData } = useKycRegisterContext()

	if (!kycData.SelfieImage || !kycData.Kyc || !kycData.DocumentType) {
		return (
			<div className="w-full max-w-2xl rounded-xl bg-white shadow-lg border-2 border-red-200 p-8">
				<div className="flex items-center gap-3 text-red-600">
					<AlertCircle className="h-8 w-8" />
					<h1 className="text-xl font-semibold">
						KYC data are missing!! Please complete all previous steps.
					</h1>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full max-w-2xl rounded-xl bg-white shadow-lg border-2 border-gray-200 p-8">
			<div className="mb-6 flex items-center gap-3">
				<div className="rounded-full bg-primary-100 p-3">
					<FileText className="h-6 w-6 text-primary-600" />
				</div>
				<div>
					<h3 className="text-2xl font-bold text-gray-900">
						Review Your Information
					</h3>
					<p className="text-sm text-gray-600">Please verify all details before submission</p>
				</div>
			</div>
			<div className="space-y-4">
				<div className="flex items-center justify-between border-b border-gray-200 py-4 bg-gray-50 px-4 rounded-lg">
					<div className="flex items-center gap-2">
						<CreditCard className="h-5 w-5 text-primary-600" />
						<span className="text-gray-700 font-medium">Document Type:</span>
					</div>
					<span className="font-semibold text-gray-900 capitalize">
						{(kycData.DocumentType && kycData.DocumentType.replace("_", " ")) ||
							"Not selected"}
					</span>
				</div>
				<div className="border-b border-gray-200 py-4 bg-gray-50 px-4 rounded-lg">
					<div className="mb-3 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-primary-600" />
							<span className="text-gray-700 font-medium">Document Files:</span>
						</div>
						<span className="font-semibold text-gray-900">
							{kycData.Kyc.length > 0
								? `${kycData.Kyc.length} file(s)`
								: "✗ Missing"}
						</span>
					</div>
					{kycData.Kyc.length > 0 && (
						<ul className="mt-2 space-y-2">
							{kycData.Kyc.map((file, index) => (
								<li
									key={index}
									className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-primary-200"
								>
									<CheckCircle className="h-4 w-4 text-primary-600 flex-shrink-0" />
									<span className="text-gray-700 flex-1">{file.name}</span>
									<span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="flex items-center justify-between border-b border-gray-200 py-4 bg-gray-50 px-4 rounded-lg">
					<div className="flex items-center gap-2">
						<Camera className="h-5 w-5 text-primary-600" />
						<span className="text-gray-700 font-medium">Selfie Photo:</span>
					</div>
					<span className="font-semibold text-gray-900">
						{kycData.SelfieImage ? (
							<span className="flex items-center gap-1 text-primary-600">
								<CheckCircle className="h-4 w-4" />
								{kycData.SelfieImage.name}
							</span>
						) : (
							<span className="text-red-600">✗ Missing</span>
						)}
					</span>
				</div>
			</div>
			<div className="mt-6 rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
				<div className="flex items-start gap-3">
					<AlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
					<p className="text-sm text-primary-800">
						Please review all information carefully. Once submitted, you cannot
						edit your KYC application. Click Submit to complete your verification.
					</p>
				</div>
			</div>
			<StepNavigation />
		</div>
	)
}

export default Review
