"use client"

import { usePathname, useRouter } from "next/navigation"
import { IKycSubmissions } from "@/app/types/kyc.types"
import clsx from "clsx"
import { ArrowUpRight } from "lucide-react"
import StatusUI from "@/components/Common/StatusUI"
import { useEffect, useState } from "react"
import { useKycFilterContext } from "@/Context/AdminKycFilterContext"

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
		<div className="mx-auto overflow-x-auto rounded-sm border border-gray-700">
			<table className="bg-background min-w-full text-white">
				<thead className="bg-background">
					<tr>
						<th
							className="border-r border-b border-gray-700 px-4 py-3 text-center text-xs font-medium tracking-wider text-white uppercase"
							scope="col"
						>
							No.
						</th>
						<th
							className="border-r border-b border-gray-700 px-4 py-3 text-center text-xs font-medium tracking-wider text-white uppercase"
							scope="col"
						>
							Name
						</th>

						<th
							className="border-r border-b border-gray-700 px-4 py-3 text-center text-xs font-medium tracking-wider text-white uppercase"
							scope="col"
						>
							Document Type
						</th>
						<th
							className="border-r border-b border-gray-700 px-4 py-3 text-center text-xs font-medium tracking-wider text-white uppercase"
							scope="col"
						>
							Email
						</th>
						<th
							className="border-r border-b border-gray-700 px-4 py-3 text-center text-xs font-medium tracking-wider text-white uppercase"
							scope="col"
						>
							Status
						</th>
						<th
							className="border-r border-b border-gray-700 px-4 py-3 text-center text-xs font-medium tracking-wider text-white uppercase"
							scope="col"
						>
							Review
						</th>
					</tr>
				</thead>
				<tbody className={"h-full"}>
					{filterData.length < 0 ? (
						<h1 className={"text-white"}>No Data Match with filter</h1>
					) : (
						filterData.map((submission: IKycSubmissions, index: number) => {
							return (
								<tr key={submission.id} className={"border-b border-gray-700"}>
									<th
										className="border-r border-gray-700 py-2.5 text-center text-sm whitespace-nowrap"
										scope="row"
									>
										{index + 1}
									</th>

									<td className="border-r border-gray-700 py-2.5 text-center text-sm whitespace-nowrap">
										{submission.fullName}
									</td>

									<td className="border-r border-gray-700 py-2.5 text-center text-sm whitespace-nowrap">
										{submission.documentType}
									</td>
									<td className="border-r border-gray-700 py-2.5 text-center text-sm whitespace-nowrap">
										{submission.email}
									</td>
									<td
										className={clsx(
											"h-full border-r border-gray-700 text-center text-sm whitespace-nowrap",
										)}
									>
										<div className={"flex justify-center"}>
											<StatusUI status={submission.status} />
										</div>
									</td>
									<td className="border-r border-gray-700 py-2.5 text-center text-sm whitespace-nowrap">
										<ReviewBtn id={submission.id} />
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

const ReviewBtn = ({ id }: { id: string }) => {
	const currentPath = usePathname()
	const router = useRouter()

	return (
		<div className={"flex justify-center"}>
			<button
				onClick={() => router.push(`${currentPath}/management/kyc/${id}`)}
				className={
					"flex cursor-pointer items-center text-white hover:underline hover:underline-offset-1"
				}
			>
				<h1>View</h1>
				<ArrowUpRight className={"h-4 w-4"} />
			</button>
		</div>
	)
}

export default DataTable
