// Car Management
// Edit Car -> Update
// Remove Car -> Delete
// Create Car -> POST

import { CarItems } from "@/app/types/car.types";
import { CursorBaseDTO } from "@/app/types/post.types";

const CarManagementPage = ({
  car,
}: {
  car: Omit<CursorBaseDTO, "items"> & { items: CarItems[] };
}) => {
  return <div>CarManagementPage</div>;
};

export default CarManagementPage;
