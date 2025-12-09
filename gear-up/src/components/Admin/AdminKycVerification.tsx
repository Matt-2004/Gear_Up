"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllKyc } from "@/utils/FetchAPI"
import DataTable from "@/components/Admin/DataTable"
import { kycFilter } from "@/utils/Filter"
import {
	CircleCheck,
	CircleX,
	Clock,
	LayoutGrid,
	Search,
	SlidersHorizontal,
} from "lucide-react"
import { IKycRes } from "@/app/types/kyc.types"
import clsx from "clsx"
import {
	KycDocumentType,
	StatusType,
	useKycFilterContext,
} from "@/Context/AdminKycFilterContext"

const AdminKycVerification = () => {
	const { data: kyc, isLoading } = useQuery({
		queryKey: ["kycVerification"],
		queryFn: getAllKyc,
		retry: false,
		enabled: true,
	})

	if (isLoading) {
		return <div>Loading</div>
	}

	if (kyc) {
		return (
			<div className={"flex w-full justify-center"}>
				<div className={"w-9/10 space-y-8"}>
					<div id={"header"} className={"pt-4"}>
						<h1 className={"text-2xl font-semibold"}>Document Verification</h1>
						<h3 className={"text-sm text-gray-300"}>
							Review and verify user-submitted documents
						</h3>
					</div>
					<div
						id={"Records"}
						className={"flex w-full flex-col justify-between gap-4"}
					>
						<div className={"flex justify-between"}>
							<StatusCountComponent status={"All"} kyc={kyc.data} />
							<StatusCountComponent status={"Pending"} kyc={kyc.data} />
							<StatusCountComponent status={"Approved"} kyc={kyc.data} />
							<StatusCountComponent status={"Rejected"} kyc={kyc.data} />
						</div>
						<div
							className={
								"bg-background mt-6 flex h-[68px] w-full items-center justify-between rounded-sm border-gray-800 px-2 shadow-sm shadow-gray-600"
							}
						>
							<FilterUI />
						</div>
						<div className={"w-full"}>
							<DataTable kyc={kyc.data.data.kycSubmissions} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const FilterUI = () => {
	const { setFilter } = useKycFilterContext()

	return (
		<>
			<div className={"flex w-2/3 gap-2"}>
				<div
					className={
						"flex w-1/2 items-center gap-4 rounded-sm border border-gray-600 p-2"
					}
				>
					<Search className={"h-5 w-5"} />
					<input
						className={"w-full focus:outline-none"}
						type={"text"}
						placeholder={"Search by name, ID, or document type"}
						onChange={(e) => setFilter({ searchData: e.currentTarget.value })}
					/>
				</div>

				<div className={"rounded-sm border border-gray-600 p-2 text-white"}>
					<select
						name="doc-type"
						id="all-doc-type"
						className={"focus:outline-none"}
						defaultValue={""}
						onChange={(e) =>
							setFilter({
								documentType: e.currentTarget.value as KycDocumentType,
							})
						}
					>
						<option value={""} disabled hidden>
							All Document Type
						</option>
						<option value="Passport">Passport</option>
						<option value="NationalID">National ID</option>
						<option value="DriverLicense">Driver License</option>
						<option value="UtilityBill">Utility Bill</option>
						<option value="Other">Other</option>
					</select>
				</div>
				<div className={"rounded-sm border border-gray-600 p-2 text-white"}>
					<select
						name="doc-type"
						id="all-doc-type"
						className={"focus:outline-none"}
						defaultValue={""}
						onChange={(e) =>
							setFilter({ statusType: e.currentTarget.value as StatusType })
						}
					>
						<option value={""} disabled hidden>
							All Status
						</option>
						<option value="All">All</option>
						<option value="Pending">Pending</option>
						<option value="Approved">Approved</option>
						<option value="Rejected">Rejected</option>
					</select>
				</div>
			</div>
			<div
				className={
					"bg-primary hover:bg-primary-btn-hover mr-2 flex cursor-pointer gap-2 rounded-sm px-8 py-2"
				}
			>
				<SlidersHorizontal />
				Filter
			</div>
		</>
	)
}

const StatusCountComponent = ({
	status,
	kyc,
}: {
	status: string
	kyc: IKycRes
}) => {
	return (
		<div
			id={status}
			className={clsx(
				status === "Approved" && "bg-[#DCFCE7]",
				status === "All" && "bg-[#DBEAFE]",
				status === "Pending" && "bg-[#FFEDD5]",
				status === "Rejected" && "bg-[#FEE2E2]",
				"flex h-40 w-2/10 flex-col justify-center gap-1 rounded-sm border-gray-800 p-4 text-black shadow-sm shadow-gray-600",
			)}
		>
			<div
				className={clsx(
					status === "Approved" && "bg-[#16A34A]",
					status === "All" && "bg-[#2563EB]",
					status === "Pending" && "bg-[#EA580C]",
					status === "Rejected" && "bg-[#DC2626]",
					"flex h-10 w-10 items-center justify-center rounded-lg",
				)}
			>
				{(status === "Pending" && <Clock className={"text-[#FFEDD5]"} />) ||
					(status === "Approved" && (
						<CircleCheck className={"text-[#DCFCE7]"} />
					)) ||
					(status === "Rejected" && <CircleX className={"text-[#FEE2E2]"} />) ||
					(status === "All" && <LayoutGrid className={"text-[#DBEAFE]"} />)}
			</div>
			<h2 className={"text-3xl font-semibold"}>
				{status === "All" ? kyc.data.totalCount : kycFilter(kyc, status)}
			</h2>
			<h1 className={"text-sm"}>{status} Reviews</h1>
		</div>
	)
}

export default AdminKycVerification
