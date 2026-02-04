"use client"

import { IAdminUpdateStatus, IKycSubmissions } from "@/app/types/kyc.types"
import StatusUI from "@/components/Common/StatusUI"


import { updateKycByAdmin } from "@/utils/API/AdminAPI"
import { timeFormat } from "@/utils/timeFormat"
import clsx from "clsx"
import { ArrowLeft, Check, FileCheck, UserCheck, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"

const KycDetailPage = ({ kycById }: { kycById: IKycSubmissions }) => {
	const [text, setText] = useState("")

	/*
	 *  Pending - Orange
	 *  Approved - Green
	 *  Rejected - Red
	 */

	return (
		<div className={"flex h-full w-full flex-col items-center justify-center"}>
			<div className={"h-full w-8/10"}>
				<PageHeader />
				<div className={"grid w-full grid-cols-3 grid-rows-4 gap-4"}>
					<PersonalInfoComponent kycData={kycById} text={text} />
					<div
						className={"bg-foreground w-96 rounded-lg border border-gray-600"}
					>
						01
					</div>
					<RejectReasonComponent text={text} setText={setText} />
					<HistoryComponent submittedAt={kycById.submittedAt ?? "12345"} />
				</div>
			</div>
		</div>
	)
}

const PageHeader = () => {
	const router = useRouter()
	return (
		<div className={"flex items-center gap-6 py-4 pr-4"}>
			<div
				className={"cursor-pointer rounded-full p-2 hover:bg-gray-600"}
				onClick={() => router.back()}
			>
				<ArrowLeft className={"h-7 w-7 text-gray-500"} />
			</div>
			<div className={"flex flex-col"}>
				<h1 className={"text-2xl font-semibold text-gray-600"}>
					User Detail Review
				</h1>
				<h3 className={"text-gray-400"}>
					Review and approve user verification
				</h3>
			</div>
		</div>
	)
}

interface PersonalInfoComponentProps {
	kycData: IKycSubmissions
	text: string
}

const PersonalInfoComponent = ({
	kycData,
	text,
}: PersonalInfoComponentProps) => {
	return (
		<div className={"bg-foreground col-span-2 row-span-4 mb-4 rounded-lg p-10"}>
			<div className={"mb-4 flex flex-col justify-center"}>
				<h1
					className={
						"mb-4 flex items-center gap-2 py-2 text-xl font-semibold text-white"
					}
				>
					<UserCheck className={"text-gray-300"} />
					Personal Information
				</h1>
				<div className={"grid grid-flow-col grid-cols-2 grid-rows-3 gap-4"}>
					{Object.entries(kycData).map((item, i: number) => {
						return (
							<>
								{item[0] === "status" ? (
									<div className={""}>
										<label className={"font-normal text-gray-300"}>
											Status
										</label>

										<StatusUI status={item[1]} />
									</div>
								) : (
									(item[0] === "email" ||
										item[0] === "fullName" ||
										item[0] === "phoneNumber" ||
										item[0] === "dateOfBirth") && (
										<div key={i} className={""}>
											<label className={"font-normal text-gray-300"}>
												{(item[0] === "email" && "Email") ||
													(item[0] === "fullName" && "Full Name") ||
													(item[0] === "phoneNumber" && "Phone Number") ||
													(item[0] === "dateOfBirth" && "BirthDay")}
											</label>
											<div
												className={clsx(
													item[1] === "" ? "text-red-400" : "text-white",
													"w-[200px] font-medium",
												)}
											>
												{item[1] === "" ? "No Data" : item[1]}
											</div>
										</div>
									)
								)}
							</>
						)
					})}
					;
				</div>
			</div>
			<div id={"spacer"} className={"my-8 h-1 border-b border-gray-600"} />
			<div className={"flex flex-col justify-center text-white"}>
				<h1
					className={"mb-4 flex items-center gap-2 py-2 text-xl font-semibold"}
				>
					<FileCheck className={"text-gray-300"} />
					Documents Review
				</h1>
				<div className={"w-full gap-7"}>
					<div className={"flex w-full flex-col justify-between gap-4"}>
						<div className={"flex flex-col gap-2"}>
							<h1>KYC documents</h1>
							<div
								className={
									"grid h-80 w-full grid-cols-2 gap-4 rounded-lg border-gray-400 shadow-sm"
								}
							>
								{kycData.documentUrls.map((items: string, i: number) => {
									if (items) {
										return (
											<Image
												className={"h-full w-fit object-cover"}
												key={i}
												src={items}
												alt={"Document-image"}
												width={200}
												height={300}
											/>
										)
									}
								})}
							</div>
						</div>
						<div className={"flex flex-col gap-2"}>
							<label className={"font-normal"}>Selfie Image</label>
							<div
								className={
									"flex h-80 w-80 justify-center rounded-lg border-gray-400 shadow-sm"
								}
							>
								<Image
									className={"h-full w-full object-contain"}
									src={kycData.selfieUrl}
									alt={"selfie-image"}
									width={300}
									height={300}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={"my-6 flex justify-end gap-4"}>
				<RejectButton
					id={kycData.id}
					data={{ status: "Rejected", rejectionReason: text }}
				/>
				<ApprovedButton
					id={kycData.id}
					data={{ status: "Approved", rejectionReason: text }}
				/>
			</div>
		</div>
	)
}

interface IDecision {
	id: string
	data: IAdminUpdateStatus
}

const RejectButton = ({ id, data }: IDecision) => {
	const router = useRouter()
	const onSubmit = () => {
		console.log(data.rejectionReason)
		const reject = async () => {

			await updateKycByAdmin(data, id)
			router.replace("/profile/admin?tab=kyc-verification")
		}
		reject()
	}

	return (
		<button
			className={
				"flex cursor-pointer items-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-white"
			}
			onClick={onSubmit}
		>
			<X className="h-5 w-5" />
			Reject
		</button>
	)
}

const ApprovedButton = ({ id, data }: IDecision) => {
	const router = useRouter()
	const onSubmit = () => {
		const approve = async () => {
			await updateKycByAdmin(data, id)

			router.replace("/profile/admin?tab=kyc-verification")

		}
		approve()
	}

	return (
		<button
			className={
				"flex cursor-pointer items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-white"
			}
			onClick={onSubmit}
		>
			<Check className="h-5 w-5" />
			Approve
		</button>
	)
}



interface ITextArea {
	text: string
	setText: Dispatch<SetStateAction<string>>
}

const RejectReasonComponent = ({ text, setText }: ITextArea) => {
	const wordCount = text.trim().split(/\s+/).filter(Boolean).length

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value
		const newWords = newValue.trim().split(/\s+/).filter(Boolean)

		// CASE 1: User is deleting or reducing text → ALWAYS ALLOW
		if (newValue.length < text.length) {
			setText(newValue)
			return
		}

		// CASE 2: New words <= max → ALLOW
		if (newWords.length <= 150) {
			setText(newValue)
			return
		}
	}
	return (
		<div
			className={
				"bg-foreground row-span-2 flex w-96 flex-col gap-2 rounded-lg border border-gray-600 p-4 text-white"
			}
		>
			<h1 className={"text-xl font-semibold"}>Reject Reasons</h1>
			<textarea
				value={text}
				onChange={handleChange}
				className={
					"h-full w-full rounded-md border border-gray-600 bg-gray-700 p-4 placeholder:text-gray-300"
				}
				name={"reject-textarea"}
				id={"reject-textarea"}
				placeholder={"Type your message here..."}
			></textarea>
			<div className={"flex justify-between"}>
				<label className={"text-gray-400"}>{wordCount} /150 words </label>
				<button className={"cursor-pointer text-blue-400"}>Save Draft</button>
			</div>
		</div>
	)
}

const HistoryComponent = ({ submittedAt }: { submittedAt: string }) => {
	return (
		<div
			className={
				"bg-foreground flex w-96 flex-col gap-4 rounded-lg border border-gray-600 p-4 text-white"
			}
		>
			<h1 className={"text-xl font-semibold"}>History</h1>
			<div className={"flex gap-4"}>
				<div className={"h-full w-1 bg-yellow-500"} />
				<div>
					<h2 className={"font-semibold"}>Initial Submission</h2>
					<h3 className={"text-sm text-gray-400"}>
						{timeFormat(submittedAt, "Hour")}
					</h3>
				</div>
			</div>
		</div>
	)
}

export default KycDetailPage
