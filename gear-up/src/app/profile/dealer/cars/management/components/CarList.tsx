import { CarItems } from "@/app/types/car.types";
import DealerCarCard from "./DealerCarCard";
import EmptyInventoryState from "./EmptyInventoryState";

interface CarListProps {
  cars: CarItems[];
  onDelete: (carId: string) => void;
  onEdit: (carId: string) => void;
}

export default function CarList({ cars, onDelete, onEdit }: CarListProps) {
  if (!cars || cars.length === 0) {
    return <EmptyInventoryState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-150">
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
  );
}
