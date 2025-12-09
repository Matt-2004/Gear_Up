"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getKycById, updateKycByAdmin } from "@/utils/FetchAPI"
import clsx from "clsx"
import Image from "next/image"
import { ArrowLeft, Check, FileCheck, UserCheck, X } from "lucide-react"
import { timeFormat } from "@/utils/timeFormat"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { IKycUpdateByAdmin } from "@/app/types/kyc.types"
import StatusUI from "@/components/Common/StatusUI"

export interface KycResponse {
	isSuccess: boolean
	message: string
	data: KycData
	status: number
}

export interface KycData {
	id: string
	userId: string
	fullName: string
	email: string
	phoneNumber: string // can be empty string
	dateOfBirth: string // ISO date string, e.g., "0001-01-01"
	status: "Pending" | "Approved" | "Rejected" // based on your app's possible values
	documentType: string
	documentUrls: string[] // array of image URLs
	selfieUrl: string
	submittedAt: string // ISO datetime string
	rejectionReason: string | null // nullable
}

const KycDetailPage = ({ id }: { id: string }) => {
	const [text, setText] = useState("")
	const [kycData, setKycData] = useState<KycData>()

	useQuery({
		queryKey: ["KYC", id],
		queryFn: async () => {
			const res = await getKycById(id)
			setKycData(res?.data)
			return res
		},
		staleTime: 5000,
		retry: false,
		enabled: true,
	})

	/*
	 *  Pending - Orange
	 *  Approved - Green
	 *  Rejected - Red
	 */

	if (kycData) {
		console.log("KYC Data:", kycData)
		return (
			<div
				className={"flex h-full w-full flex-col items-center justify-center"}
			>
				<div className={"h-full w-8/10"}>
					<PageHeader />
					<div
						className={
							"grid-col-2 grid h-7/8 w-full grid-flow-col grid-rows-4 gap-4"
						}
					>
						<PersonalInfoComponent kycData={kycData} text={text} />
						<div
							className={"bg-foreground w-96 rounded-lg border border-gray-600"}
						>
							01
						</div>
						<RejectReasonComponent text={text} setText={setText} />
						<HistoryComponent submittedAt={kycData.submittedAt ?? "12345"} />
					</div>
				</div>
			</div>
		)
	}
}

const PageHeader = () => {
	const router = useRouter()
	return (
		<div className={"flex items-center gap-6 py-4 pr-4"}>
			<div
				className={"cursor-pointer rounded-full p-2 hover:bg-gray-600"}
				onClick={() => router.back()}
			>
				<ArrowLeft className={"h-7 w-7 text-gray-300"} />
			</div>
			<div className={"flex flex-col"}>
				<h1 className={"text-2xl font-semibold text-white"}>
					User Detail Review
				</h1>
				<h3 className={"text-gray-300"}>
					Review and approve user verification
				</h3>
			</div>
		</div>
	)
}

interface PersonalInfoComponentProps {
	kycData: KycData
	text: string
}

const PersonalInfoComponent = ({
	kycData,
	text,
}: PersonalInfoComponentProps) => {
	return (
		<div
			className={
				"bg-foreground col-span-2 row-span-4 w-full rounded-lg border p-4"
			}
		>
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
									(item[0] === "id" ||
										item[0] === "email" ||
										item[0] === "fullName" ||
										item[0] === "phoneNumber" ||
										item[0] === "dateOfBirth") && (
										<div key={i} className={""}>
											<label className={"font-normal text-gray-300"}>
												{(item[0] === "id" && "ID") ||
													(item[0] === "email" && "Email") ||
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
				<div className={"n w-full gap-7"}>
					<div className={"flex w-full justify-between gap-4"}>
						<div className={"flex flex-col gap-2"}>
							<h1>KYC documents</h1>
							<div
								className={
									"flex h-80 w-full justify-between rounded-lg border border-gray-400 p-4 shadow-sm"
								}
							>
								{kycData.documentUrls.map((items: string, i: number) => {
									if (items) {
										return (
											<div key={i} className={"flex justify-center gap-2"}>
												<Image
													className={"max-h-full max-w-full object-contain"}
													key={i}
													src={items}
													alt={"Document-image"}
													width={450}
													height={400}
												/>
											</div>
										)
									}
								})}
							</div>
						</div>
						<div className={"flex flex-col gap-2"}>
							<label className={"font-normal"}>Selfie Image</label>
							<div
								className={
									"flex h-80 w-80 justify-center rounded-lg border border-gray-400 p-4 shadow-sm"
								}
							>
								<Image
									className={"max-h-full max-w-full object-contain"}
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
	data: IKycUpdateByAdmin
}

const RejectButton = ({ id, data }: IDecision) => {
	const mutation = useMutation({
		mutationFn: async (params: { id: string; data: IKycUpdateByAdmin }) =>
			await updateKycByAdmin(params.data, params.id),
		onSuccess: () => console.log("Successfully Rejected!"),
	})

	const onSubmit = () => {
		mutation.mutate({
			id: id,
			data: {
				status: data.status,
				rejectionReason: data.rejectionReason,
			},
		})
	}
	return (
		<button
			className={
				"border-background flex cursor-pointer items-center gap-2 rounded-lg border bg-red-600 px-4 py-2 text-white"
			}
			onClick={onSubmit}
		>
			<X />
			Reject
		</button>
	)
}

const ApprovedButton = ({ id, data }: IDecision) => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (params: { id: string; data: IKycUpdateByAdmin }) =>
			await updateKycByAdmin(params.data, params.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["KYC"] })
		},
	})

	const onSubmit = () => {
		mutation.mutate({
			id: id,
			data: {
				status: data.status,
				rejectionReason: data.rejectionReason,
			},
		})
	}

	return (
		<button
			className={
				"border-background flex cursor-pointer items-center gap-2 rounded-lg border bg-green-600 px-4 py-2 text-white"
			}
			onClick={onSubmit}
		>
			<Check />
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
					<h3 className={"text-sm text-gray-400"}>{timeFormat(submittedAt)}</h3>
				</div>
			</div>
		</div>
	)
}

export default KycDetailPage
