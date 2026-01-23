"use client"

import { TableRow } from "@/app/profile/dealer/cars/add/Review"
import { CommentData } from "@/app/types/comment.types"
import { PostItem } from "@/app/types/post.types"
import { getCommentsByPostId, getNestedCommentsByCommentId } from "@/utils/FetchAPI"
import * as signalR from "@microsoft/signalr"
import { useEffect } from "react"
import { Comment } from "../discover/Comment"
import { CarouselImages, PostContent } from "../discover/DiscoverPost"
import { useCommentContext } from "./CommentContext"

interface IDetailProp {
	access_token: string,
	postData: PostItem
}

const Details = ({
	access_token,
	postData
}: IDetailProp) => {

	/*
			Data flow 

		1. This page will handle data fetching from the server using the id param
		2. Connect the real-time and listen updates using signalR
		3. Minipulate the data and update context stores

		
	
	
	*/
	const { comments, handleDataUpdate, requestedParentCommentId } = useCommentContext()


	const { make, model, year, color } = postData.carDto
	const basicSpecTableData = [
		{ Make: make },
		{ Model: model },
		{ Year: year },
		{ Color: color },
	]

	const { engineCapacity, fuelType, transmissionType } = postData.carDto
	const performanceSpecTableData = [
		{ EngineCapacity: engineCapacity },
		{ FuelType: fuelType },
		{ TransmissionType: transmissionType },
	]

	const { mileage, seatingCapacity } = postData.carDto
	const capacitySpecTableData = [
		{ Mileage: mileage },
		{ SeatingCapacity: seatingCapacity },
	]

	const fetchComments = async (postId: string) => {
		const data = await getCommentsByPostId(postId)
		handleDataUpdate(data, null)
	}

	const fetchNestedComments = async (requestedParentCommentId: string) => {
		const data = await getNestedCommentsByCommentId(requestedParentCommentId)
		handleDataUpdate(data, requestedParentCommentId)
	}


	useEffect(() => {

		fetchComments(postData.id)

	}, [])

	useEffect(() => {
		if (!requestedParentCommentId) return

		fetchNestedComments(requestedParentCommentId)

	}, [requestedParentCommentId, postData.id])

	// SignalR connection for real-time comments
	useEffect(() => {
		if (!postData.id) {
			console.log("Id doesn't exist")
			return
		}

		// SignalR connection start
		const connection = new signalR.HubConnectionBuilder()
			.withUrl("http://localhost:5255/hubs/post", {
				accessTokenFactory: () => access_token
			})
			.withAutomaticReconnect()
			.configureLogging(signalR.LogLevel.Information)
			.build()

		// Join group to Commnet Group
		const JoinGroups = async () => {

			await connection.start().catch(err => console.error(err))

			try {
				await connection.invoke('JoinGroup', postData.id)
				await connection.invoke('JoinCommentsGroup', postData.id)
			} catch (err) {
				console.error("Join group error:: ", err)
			}
		}
		// Join Group
		JoinGroups()

		connection.on('CommentCreated', (data: CommentData) => {

			handleDataUpdate(data, data.parentCommentId)
		})



		return () => {
			connection.off("CommentCreated")
			connection.stop()
		}
	}, [])

	if (!postData) {
		return <h3>Loading...</h3>
	}

	return (
		<div className={"flex h-full w-full flex-col items-center"}>
			<div className={"h-full w-7/10 rounded-xl mt-2 bg-white px-4 flex justify-between"}>
				<div className="min-h-screen overflow-hidden py-2">
					<div className="overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
						<div id="header-container" className="w-lg space-y-2 mt-6">
							<h1 id="caption" className="text-xl">{postData.caption}</h1>
							<PostContent postContent={postData.content} />
						</div>

						<div className="">
							<CarouselImages images={postData.carDto.carImages} />
							<table className="flex flex-col items-center min-w-full">
								<tbody className="w-full flex flex-col items-center">

									{basicSpecTableData.map((d, i) => {
										const [key, value] = Object.entries(d)[0]

										return (
											<TableRow key={i} index={i}>
												<td className=" pl-2">{key}</td>
												<td className="">{value}</td>
											</TableRow>
										)
									})}
									{performanceSpecTableData.map((d, i) => {
										const [key, value] = Object.entries(d)[0]

										return (
											<TableRow key={i} index={i}>
												<td className=" pl-2">{key}</td>
												<td className="">{value}</td>
											</TableRow>
										)
									})}
									{capacitySpecTableData.map((d, i) => {
										const [key, value] = Object.entries(d)[0]

										return (
											<TableRow key={i} index={i}>
												<td className=" pl-2">{key}</td>
												<td className="">{value}</td>
											</TableRow>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className="h-screen bg-white p-4 w-2/5 overflow-hidden">
					<div className="overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>

						<Comment comment={comments} level={0} />
					</div>
				</div>
			</div>
		</div>

	)
}

export default Details
