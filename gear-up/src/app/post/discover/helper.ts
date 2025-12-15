import fs from "fs/promises"
import path from "path"

export async function getPostData() {
	const filePath = path.join(process.cwd(), "public", "postdata.json")

	const json = await fs.readFile(filePath, "utf-8")
	const cars = JSON.parse(json)
	return cars
}
