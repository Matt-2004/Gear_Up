"use client"

import { IUser } from "@/app/types/user.types"
import { Login, SearchBar, User } from "@/components/Navbar/NavUtils"
import * as signalR from '@microsoft/signalr'
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"

export default function NavbarUtility({ user }: { user: IUser }) {
	return (
		<div className="flex items-center gap-2 ">
			<div className="items-center">
				<SearchBar />
			</div>

			{user && <NotificationBell />}
			{user ? <User user={user} /> : <Login />}
		</div>
	)
}

export const NotificationBell = () => {
	// Connect to notification system
	// When notification is clicked, navigate to relevant page
	// When there are unread notifications, show a red dot on the bell icon
	// When hovered, show a dropdown with recent notifications
	const [token, setToken] = useState<string>("")

	useEffect(() => {

		const fetchToken = async () => {
			const response = await fetch('/api/token/access_token_get')
			const data = await response.json()
			setToken(data.access_token)
		}

		fetchToken();
	}, [])

	useEffect(() => {

		const conn = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:5255/hubs/notification", { accessTokenFactory: () => token })
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build()

		conn.start().then(() => {
			console.log("Notification Hub Connected")
		})

		conn.on("NotificationCreated", (data) => {
			console.log("New Notification:", data)
		})
	}, [token])
	return (
		<Bell />
	)
}
