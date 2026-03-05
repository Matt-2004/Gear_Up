import { CarItems } from "@/types/car.types"
import DealerCarCard from "./DealerCarCard"
import EmptyInventoryState from "./EmptyInventoryState"

interface CarListProps {
	cars: CarItems[]
	onDelete: (carId: string) => void
	onEdit: (carId: string) => void
}

export default function CarList({ cars, onDelete, onEdit }: CarListProps) {
	if (!cars || cars.length === 0) {
		return <EmptyInventoryState />
	}

	return (
		<div className="animate-in fade-in grid grid-cols-1 gap-6 duration-150 md:grid-cols-2 xl:grid-cols-3">
			{cars.map((car: CarItems, index: number) => (
				<div
					key={car.id || index}
					className="animate-in fade-in slide-in-from-bottom duration-150"
					style={{ animationDelay: `${index * 50}ms` }}
				>
					<DealerCarCard car={car} onDelete={onDelete} onEdit={onEdit} />
				</div>
			))}
		</div>
	)
}
