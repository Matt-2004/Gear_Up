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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cars.map((car: CarItems, index: number) => (
        <DealerCarCard
          key={car.id || index}
          car={car}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
