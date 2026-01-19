"use client"

import { TableRow } from "@/app/profile/dealer/cars/add/Review"
import { PostItem } from "@/app/types/post.types"
import { addComment } from "@/utils/FetchAPI"

import { useState } from "react"
import { Comment } from "../discover/Comment"
import { CarouselImages, PostContent } from "../discover/DiscoverPost"

interface IDetailProp {
	access_token: string,
	id: string,
	data: PostItem
}

const Details = ({
	access_token,
	id,
	data
}: IDetailProp) => {

	const [commnetInput, setCommnetInput] = useState<string>("");
	const [commnetsLike, setCommnetsLike] = useState<{ commnetId: string, likeCount: number }>();
	const [postLike, setPostLike] = useState<{ postid: string, likeCount: number }>();

	const { make, model, year, color } = data.carDto
	const basicSpecTableData = [
		{ Make: make },
		{ Model: model },
		{ Year: year },
		{ Color: color },
	]

	const { engineCapacity, fuelType, transmissionType } = data.carDto
	const performanceSpecTableData = [
		{ EngineCapacity: engineCapacity },
		{ FuelType: fuelType },
		{ TransmissionType: transmissionType },
	]

	const { mileage, seatingCapacity } = data.carDto
	const capacitySpecTableData = [
		{ Mileage: mileage },
		{ SeatingCapacity: seatingCapacity },
	]




	async function createNewComment(postId: string, text: string, parentCommentId: string | null) {
		try {
			await addComment({ postId, text, parentCommentId })
		} catch (err) {
			console.error("Error in creating comment:: ", err)
		}
	}

	async function submit(e: React.FormEvent<HTMLFormElement>) {
		if (!commnetInput) {
			console.log("comments doesn't exist")
			return
		}
		e.preventDefault()

		await createNewComment(id, commnetInput, null)
	}

	if (!data) {
		return <h3>Loading...</h3>
	}

	return (
		<div className={"flex h-full w-full flex-col items-center"}>
			<div className={"h-full w-7/10 rounded-xl mt-2 bg-white px-4 flex justify-between"}>
				<div className="min-h-screen overflow-hidden py-2">
					<div className="overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
						<div id="header-container" className="w-lg space-y-2 mt-6">
							<h1 id="caption" className="text-xl">{data.caption}</h1>
							<PostContent postContent={data.content} />
						</div>

						<div className="">
							<CarouselImages images={data.carDto.carImages} />
							<table className="flex flex-col gap-4">
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
							</table>
						</div>
					</div>
				</div>
				<div className="h-screen bg-white p-4 w-2/5 overflow-hidden">
					<div className="overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>

						<Comment access_token={access_token} postId={id} level={0} />
					</div>
				</div>
			</div>
		</div>

	)
}

export default Details
