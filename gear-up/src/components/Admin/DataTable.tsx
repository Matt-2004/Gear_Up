"use client"

import { IKycSubmissions } from "@/app/types/kyc.types"
import StatusUI, { Status } from "@/components/Common/StatusUI"
import { useKycFilterContext } from "@/Context/AdminKycFilterContext"
import clsx from "clsx"
import { ArrowUpRight, Check } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const DataTable = ({ kyc }: { kyc: IKycSubmissions[] }) => {
	const { searchData, statusType, documentType } = useKycFilterContext()
	const [filterData, setFilterData] = useState<IKycSubmissions[]>([])

	useEffect(() => {
		if (!kyc) return
		setFilterData(
			kyc.filter(
				(prev) =>
					(statusType === "All" || prev.status === statusType) &&
					(documentType === "All" || prev.documentType === documentType) &&
					prev.fullName.toLowerCase().includes(searchData.toLowerCase()),
			),
		)
	}, [searchData, statusType, documentType, kyc])

	return (
		<div className="mx-auto overflow-x-auto rounded-sm border border-gray-300">
			<table className="bg-background min-w-full text-gray-600">
				<thead className="bg-background">
					<tr>
						<th
							className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-medium tracking-wider uppercase"
							scope="col"
						>
							No.
						</th>
						<th
							className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-medium tracking-wider uppercase"
							scope="col"
						>
							Name
						</th>

						<th
							className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-medium tracking-wider uppercase"
							scope="col"
						>
							Document Type
						</th>
						<th
							className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-medium tracking-wider uppercase"
							scope="col"
						>
							Email
						</th>
						<th
							className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-medium tracking-wider uppercase"
							scope="col"
						>
							Status
						</th>
						<th
							className="border-r border-b border-gray-300 px-4 py-3 text-center text-xs font-medium tracking-wider uppercase"
							scope="col"
						>
							Review
						</th>
					</tr>
				</thead>
				<tbody className={"h-full"}>
					{filterData.length < 0 ? (
						<h1 className={"text-gray-500"}>No Data Match with filter</h1>
					) : (
						filterData.map((submission: IKycSubmissions, index: number) => {
							return (
								<tr key={submission.id} className={"border-b border-gray-300"}>
									<th
										className="border-r border-gray-300 py-2.5 text-center text-sm whitespace-nowrap"
										scope="row"
									>
										{index + 1}
									</th>

									<td className="border-r border-gray-300 py-2.5 text-center text-sm whitespace-nowrap">
										{submission.fullName}
									</td>

									<td className="border-r border-gray-300 py-2.5 text-center text-sm whitespace-nowrap">
										{submission.documentType}
									</td>
									<td className="border-r border-gray-300 py-2.5 text-center text-sm whitespace-nowrap">
										{submission.email}
									</td>
									<td
										className={clsx(
											"h-full border-r border-gray-300 text-center text-sm whitespace-nowrap",
										)}
									>
										<div className={"flex justify-center"}>
											<StatusUI status={submission.status} />
										</div>
									</td>
									<td className="border-r border-gray-300 py-2.5 text-center text-sm whitespace-nowrap">
										<ReviewBtn status={submission.status} id={submission.id} />
									</td>
								</tr>
							)
						})
					)}
				</tbody>
			</table>
		</div>
	)
}

const ReviewBtn = ({ id, status }: { id: string; status: Status }) => {
	const currentPath = usePathname()
	const router = useRouter()

	return (
		<div className={"flex justify-center"}>
			<button
				onClick={() => router.push(`${currentPath}/management/kyc/${id}`)}
				className={
					"flex cursor-pointer items-center hover:underline hover:underline-offset-1"
				}
			>
				{status === "Pending" ? (
					<div className="flex gap-1">
						<h1>View</h1>
						<ArrowUpRight className={"h-4 w-4"} />
					</div>
				) : (
					<div className="flex items-center gap-1">
						<h1>Completed</h1>
						<div className="flex h-4 w-4 flex-col items-center justify-center rounded-full bg-green-500">
							<Check className="h-2 w-2 text-white" />
						</div>
					</div>
				)}
			</button>
		</div>
	)
}

export default DataTable
