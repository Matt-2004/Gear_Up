"use client"

import { IUser } from "@/app/types/user.types"
import Input from "@/components/Common/Input"

import Image from "next/image"
import { ChangeEvent, useEffect, useState } from "react"
import { updateProfile } from "./action"

const ProfilePage = ({ data }: { data: IUser }) => {
	const [isDataChange, setIsDataChange] = useState<boolean>(false)
	const [input, setInput] = useState<Partial<IUser>>()
	const [originalInput, setOriginalInput] = useState<Partial<IUser>>()
	const formData = new FormData()

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget

		setInput((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	useEffect(() => {
		if (!data) return
		setInput(data)
		setOriginalInput(data)
	}, [])

	useEffect(() => {
		if (!originalInput || !input) {
			setIsDataChange(false)
			return
		}

		Object.entries(originalInput).map(([key]) => {
			if (
				(originalInput as Record<string, any>)[key] !==
				(input as Record<string, any>)[key]
			) {
				formData.set(key, (input as Record<string, any>)[key])
				setIsDataChange(true)
			}
		})
	}, [input])

	return (
		<form
			action={() => updateProfile(formData)}
			className="flex h-full w-full justify-center"
		>
			<div className="bg-background mt-2 flex h-full w-[95%] justify-center rounded-xl p-4 text-gray-200 shadow-sm shadow-gray-600 md:h-full md:p-8 lg:w-[90%] xl:w-[75%]">
				<div className="flex w-full flex-col">
					<div className="flex items-end justify-center gap-4">
						<Image
							src={data.avatarUrl || "/default_profile.jpg"}
							alt={data.name || "User Avatar"}
							width={120}
							height={120}
							className="h-24 w-24 rounded-full object-cover md:h-36 md:w-36"
						></Image>

						<div className="font-roboto space-y-1 font-medium text-black">
							<h1 className="text-xl md:text-2xl">{data.name}</h1>
							<p className="text-primary rounded-sm underline">{data.role}</p>
						</div>
					</div>

					<div className="mt-4 grid h-full w-full grid-cols-1 justify-items-center gap-4 lg:grid-cols-2 lg:gap-4">
						<Input
							type="text"
							value={input?.name}
							placeholder={"John Doe"}
							onChange={handleInput}
							name="name"
						>
							Real Name
						</Input>

						<Input
							type={"text"}
							value={input?.email}
							placeholder={"test@email.com"}
							onChange={handleInput}
							name="email"
						>
							Email
						</Input>

						<Input
							type="tel"
							value={input?.phoneNumber ?? ""}
							onChange={handleInput}
							name="phoneNumber"
						>
							Phone Number
						</Input>

						<Input
							type="date"
							value={input?.dateOfBirth}
							onChange={handleInput}
							name="dateOfBirth"
							max={Date.now()}
							min={"1990-01-01"}
						>
							Birthday
						</Input>
					</div>

					<div className="mt-6 flex justify-end text-black">
						<div className="flex gap-2">
							<button className="hover:border-primary flex cursor-pointer items-center gap-4 self-start rounded-full border border-gray-600 px-4 py-2 hover:bg-gray-700">
								Cancel
							</button>
							<button
								type="submit"
								disabled={!isDataChange}
								className="bg-primary flex cursor-pointer items-center gap-4 self-start rounded-full px-4 py-2 text-white disabled:bg-gray-500"
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	)
}

export default ProfilePage
