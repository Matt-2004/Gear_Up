// const getOwnCarData = () => {

import { CarItems } from "@/app/types/car.types"
import Cars from "./Cars"

// }

const Page = () => {
	// const carData = getOwnCarData()
	const carData: CarItems[] = [
		{
			id: "d83894df-8c5b-4363-92ce-cda1c6dd5494",
			title: "Escalade",
			description:
				"Voluptatem quasi veniam consequatur. Inventore molestiae tenetur impedit voluptatibus reiciendis laudantium voluptatibus neque. Rerum voluptas est. Fugiat quo provident aperiam sint.",
			model: "Civic",
			make: "Dodge",
			year: 2024,
			price: 37630.311973938,
			color: "indigo",
			mileage: 181118,
			seatingCapacity: 4,
			engineCapacity: 4778,
			carImages: [
				{
					id: "27bda1b0-11a7-436d-88f9-a00a6e844eb0",
					carId: "d83894df-8c5b-4363-92ce-cda1c6dd5494",
					url: "https://picsum.photos/640/480/?image=208",
				},
				{
					id: "6712f0b6-3b02-468f-b897-1032132ad2a9",
					carId: "d83894df-8c5b-4363-92ce-cda1c6dd5494",
					url: "https://picsum.photos/640/480/?image=351",
				},
				{
					id: "9c21267a-891c-4164-8b80-55109273d483",
					carId: "d83894df-8c5b-4363-92ce-cda1c6dd5494",
					url: "https://picsum.photos/640/480/?image=92",
				},
				{
					id: "a778841f-f527-4d25-ad2a-d7f0f2813256",
					carId: "d83894df-8c5b-4363-92ce-cda1c6dd5494",
					url: "https://picsum.photos/640/480/?image=248",
				},
				{
					id: "fe2dbbee-46df-411a-8f2f-13a3433d2765",
					carId: "d83894df-8c5b-4363-92ce-cda1c6dd5494",
					url: "https://picsum.photos/640/480/?image=462",
				},
			],
			fuelType: "Hybrid",
			carCondition: "Used",
			transmissionType: "Automatic",
			carStatus: "Available",
			carValidationStatus: "Approved",
			vin: "PI45G4ZOELKE36794",
			licensePlate: "1530",
		},
		{
			id: "7564052b-2552-4c99-8906-2bea69e672b2",
			title: "Cruze",
			description:
				"Provident labore sed voluptas. Quis minima laudantium at repellendus aut est. Vel iusto neque et quia ut. Voluptas quia ut in commodi omnis dicta. Rem ipsa voluptatum. Voluptas voluptas omnis repellat aut est eius.",
			model: "Silverado",
			make: "BMW",
			year: 2021,
			price: 21709.15679409601,
			color: "azure",
			mileage: 119434,
			seatingCapacity: 6,
			engineCapacity: 3903,
			carImages: [
				{
					id: "6ed28613-5f92-4f76-940b-a030901d2d69",
					carId: "7564052b-2552-4c99-8906-2bea69e672b2",
					url: "https://picsum.photos/640/480/?image=812",
				},
				{
					id: "8087c7db-b17d-498a-a0fd-11ec9da4b92b",
					carId: "7564052b-2552-4c99-8906-2bea69e672b2",
					url: "https://picsum.photos/640/480/?image=220",
				},
				{
					id: "c96e0097-5a93-493d-b382-f8cf6a6a4c87",
					carId: "7564052b-2552-4c99-8906-2bea69e672b2",
					url: "https://picsum.photos/640/480/?image=564",
				},
				{
					id: "f83a2ffb-7cf5-43bf-b9ce-324c1b8702d4",
					carId: "7564052b-2552-4c99-8906-2bea69e672b2",
					url: "https://picsum.photos/640/480/?image=361",
				},
				{
					id: "fbc460af-3c6c-4fbd-a5e3-ef5aa1d7caf5",
					carId: "7564052b-2552-4c99-8906-2bea69e672b2",
					url: "https://picsum.photos/640/480/?image=735",
				},
			],
			fuelType: "Petrol",
			carCondition: "New",
			transmissionType: "SemiAutomatic",
			carStatus: "Available",
			carValidationStatus: "Approved",
			vin: "FZ1G8SLG97P276457",
			licensePlate: "9767",
		},
		{
			id: "03f6c411-5bb2-4561-8835-96ba4dff864c",
			title: "A8",
			description:
				"Eos inventore illo nisi nostrum amet dolores dolorum et libero. Excepturi eaque a commodi perferendis. Assumenda nostrum tempora velit error tempora veniam consequatur sapiente nobis. Aperiam porro veritatis consequatur distinctio qui commodi velit velit. Aut voluptas quo.",
			model: "Prius",
			make: "Nissan",
			year: 2017,
			price: 41715.36768861947,
			color: "indigo",
			mileage: 196978,
			seatingCapacity: 8,
			engineCapacity: 1582,
			carImages: [
				{
					id: "1b309fb0-7925-4bb9-8ef1-735ba891b0fe",
					carId: "03f6c411-5bb2-4561-8835-96ba4dff864c",
					url: "https://picsum.photos/640/480/?image=26",
				},
				{
					id: "64186966-161f-42a0-8242-ed0d12d6f0c7",
					carId: "03f6c411-5bb2-4561-8835-96ba4dff864c",
					url: "https://picsum.photos/640/480/?image=933",
				},
				{
					id: "6ad0cc18-dd3d-4efe-8422-5d1ac8748802",
					carId: "03f6c411-5bb2-4561-8835-96ba4dff864c",
					url: "https://picsum.photos/640/480/?image=417",
				},
				{
					id: "8b3fcfd8-37c0-49b6-a742-5da45db82fc4",
					carId: "03f6c411-5bb2-4561-8835-96ba4dff864c",
					url: "https://picsum.photos/640/480/?image=541",
				},
			],
			fuelType: "Electric",
			carCondition: "Used",
			transmissionType: "Manual",
			carStatus: "Available",
			carValidationStatus: "Approved",
			vin: "BUR2L8EQKZJQ48208",
			licensePlate: "3118",
		},
	]

	return <Cars carData={carData} />
}

export default Page
