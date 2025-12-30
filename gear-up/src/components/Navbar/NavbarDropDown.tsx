import { IUser } from "@/app/types/user.types"
import { Car, LogOut, Settings, User, UserPlus } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { HTMLAttributes, ReactNode } from "react"

export function ProfileDropDown({ user }: { user: IUser }) {
	return (
		<div className="bg-background text-primary absolute top-11 right-0 z-30 w-64 rounded-md border-gray-800 shadow-sm shadow-gray-700">
			<ul className="p-1">
				<DropDownItem className="" link={"/profile/user"}>
					<div className="items-center rounded-full p-1">
						<User className="h-5 w-5" />
					</div>
					Profile
				</DropDownItem>
				{user.role === "Dealer" && (
					<DropDownItem className="" link={"/profile/dealer/cars"}>
						<div className="items-center rounded-full p-1">
							<Car className="h-5 w-5" />
						</div>
						Cars
					</DropDownItem>
				)}
				<DropDownItem className="" link={"/profile/user"}>
					<div className="items-center rounded-full p-1">
						<Settings className="h-5 w-5" />
					</div>
					Settings
				</DropDownItem>
				<DropDownItem className="" link={"/profile/dealer/register"}>
					<div className="items-center rounded-full p-1">
						<UserPlus className="h-5 w-5" />
					</div>
					Dealership registration
				</DropDownItem>
				<DropDownItem link={""} onClick={() => signOut()}>
					<div className="items-center rounded-full p-1">
						<LogOut className="h-5 w-5" />
					</div>
					Logout
				</DropDownItem>
			</ul>
		</div>
	)
}

interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
	link: string
	children: ReactNode
}

function DropDownItem({ link, children, ...props }: DropDownProps) {
	return (
		<div {...props}>
			<Link href={link}>
				<div
					className={
						"flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 hover:border-gray-600 hover:bg-gray-300"
					}
				>
					{children}
				</div>
			</Link>
		</div>
	)
}
