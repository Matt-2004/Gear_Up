import { CarItems } from "@/app/features/car/types/car.types";
import DealerCarCard from "./DealerCarCard";
import EmptyInventoryState from "./EmptyInventoryState";
import CarTable from "./CarTable";

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
    <div className="animate-in fade-in duration-150">
      {/* Mobile view: Cards grid */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
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

      {/* Desktop view: Table layout */}
      <div className="hidden lg:block w-full">
        <CarTable cars={cars} onDelete={onDelete} onEdit={onEdit} />
      </div>
    </div>
  );
}
