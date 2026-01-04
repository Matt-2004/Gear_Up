import clsx from "clsx"

export type Status = "Pending" | "Approved" | "Rejected"

const StatusUI = ({ status }: { status: Status }) => {
	return (
		<div
			className={clsx(
				status === "Pending" && "bg-[#DBEAFE]",
				status === "Approved" && "bg-[#DCFCE7]",
				status === "Rejected" && "bg-[#FEE2E2]",
				"flex h-[1.5rem] w-[7rem] items-center justify-evenly rounded-full text-center",
			)}
		>
			<div
				className={clsx(
					status === "Pending" && "bg-[#EA580C]",
					status === "Approved" && "bg-[#16A34A]",
					status === "Rejected" && "bg-[#DC2626]",
					"h-2 w-2 rounded-full",
				)}
			/>
			<h1
				className={clsx(
					status === "Pending" && "text-[#EA580C]",
					status === "Approved" && "rounded-full text-[#16A34A]",
					status === "Rejected" && "text-[#DC2626]",
				)}
			>
				{status}
			</h1>
		</div>
	)
}

export default StatusUI
