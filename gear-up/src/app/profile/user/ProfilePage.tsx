"use client"

import { getUserProfileRes } from "@/app/types/user.types"
import { Edit } from "lucide-react"
import { UserData } from "next-auth/providers/42-school"
import { useState } from "react"

const ProfilePage = ({ data }: { data: getUserProfileRes }) => {
	console.log("ProfilePage received data:", data?.data.name)
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isDataChange, setIsDataChange] = useState<boolean>(false)

	const [inputData, setInputData] = useState<Partial<UserData>>({})

	// useEffect(() => {
	// 	setInputData({
	// 		email: data?.data.email,
	// 		name: data?.data.name,
	// 		role: data?.data.role,
	// 	})
	// })

	// data and user input match check

	return (
		<div className="flex h-full w-full justify-center">
			<div className="bg-background mt-2 flex h-full w-[95%] justify-center rounded-xl p-4 text-gray-200 shadow-sm shadow-gray-600 md:h-full md:p-8 lg:w-[90%] xl:w-[75%]">
				<div className="w-full">
					<div className="flex justify-between">
						<div className="flex items-end gap-4">
							{/* <Image
								src={data?.data.avatarUrl}
								alt={data?.data.name}
								width={120}
								height={120}
								className="h-24 w-24 rounded-full object-cover md:h-36 md:w-36"
							></Image> */}
							<div className="font-roboto space-y-1 font-medium">
								<h1 className="text-xl md:text-2xl">{data?.data.name}</h1>
								<p className="text-primary rounded-sm"># {data?.data.role}</p>
							</div>
						</div>
					</div>
					<div className="mt-4 grid grid-cols-1 gap-2 space-x-2 lg:grid-cols-2 lg:gap-4">
						{/* <Input
							type={"text"}
							value={userInput.email}
							placeholder={userInput.email}
							onChange={handleInput}
							disabled={!isEdit}
							name="email"
						>
							Email
						</Input>
						<Input
							type={"text"}
							value={userInput.name}
							placeholder={userInput.name}
							onChange={handleInput}
							disabled={!isEdit}
							name="name"
						>
							User Name
						</Input>
						<Input
							type={"text"}
							value={userInput.role}
							placeholder={userInput.role}
							onChange={handleInput}
							disabled={!isEdit}
							name="role"
						>
							Role
						</Input> */}
					</div>
					<div className="mt-6 flex justify-end">
						{isEdit ? (
							<div className="flex gap-2">
								<button
									onClick={() => setIsEdit(false)}
									className="hover:border-primary flex cursor-pointer items-center gap-4 self-start rounded-lg border border-gray-600 px-4 py-2 hover:bg-gray-700"
								>
									Cancel
								</button>
								<button
									disabled={!isDataChange}
									className="bg-primary flex cursor-pointer items-center gap-4 self-start rounded-lg px-4 py-2 text-black disabled:bg-gray-500"
								>
									Save
								</button>
							</div>
						) : (
							<button
								onClick={() => setIsEdit(true)}
								className="hover:border-primary flex cursor-pointer items-center gap-2 self-start rounded-lg border border-gray-600 px-3 py-2 hover:bg-gray-700"
							>
								<Edit />
								Edit
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage
