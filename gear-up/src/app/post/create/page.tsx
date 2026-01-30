import { CarItems } from "@/app/types/car.types";
import { CreatePostProvider } from "./CreatePostContext";
import CreatePostForm from "./CreatePostForm";

const CreatePostPage = async () => {
  // Mock dealer cars data - replace with actual API call
  const dealerCars: CarItems[] = [
    {
      id: "1",
      title: "Toyota Camry 2023 - Premium Sedan",
      description:
        "Well maintained, low mileage, excellent condition with full service history",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      price: 850000,
      color: "Pearl White",
      mileage: 15000,
      seatingCapacity: 5,
      engineCapacity: 2500,
      carImages: [
        {
          id: "img1",
          carId: "1",
          url: "/carPlaceholderImage.jpg",
        },
      ],
      fuelType: "Hybrid",
      carCondition: "Used",
      transmissionType: "Automatic",
      carStatus: "Available",
      carValidationStatus: "Approved",
      vin: "1HGBH41JXMN109186",
      licensePlate: "ABC-1234",
    },
    {
      id: "2",
      title: "Honda Accord 2022 - Sport Edition",
      description:
        "Excellent condition, single owner, full service history with premium package",
      make: "Honda",
      model: "Accord",
      year: 2022,
      price: 920000,
      color: "Midnight Blue",
      mileage: 28000,
      seatingCapacity: 5,
      engineCapacity: 1500,
      carImages: [
        {
          id: "img2",
          carId: "2",
          url: "/carPlaceholderImage.jpg",
        },
      ],
      fuelType: "Petrol",
      carCondition: "Used",
      transmissionType: "Automatic",
      carStatus: "Available",
      carValidationStatus: "Approved",
      vin: "1HGCP2F85BA123456",
      licensePlate: "XYZ-5678",
    },
    {
      id: "3",
      title: "BMW 3 Series 2024 - Luxury Package",
      description:
        "Brand new, luxury sedan with premium features and latest technology",
      make: "BMW",
      model: "3 Series",
      year: 2024,
      price: 1850000,
      color: "Jet Black",
      mileage: 5000,
      seatingCapacity: 5,
      engineCapacity: 2000,
      carImages: [
        {
          id: "img3",
          carId: "3",
          url: "/carPlaceholderImage.jpg",
        },
      ],
      fuelType: "Petrol",
      carCondition: "New",
      transmissionType: "Automatic",
      carStatus: "Available",
      carValidationStatus: "Approved",
      vin: "WBA8E9C54JA123456",
      licensePlate: "LUX-9999",
    },
  ];

  return (
    <CreatePostProvider>
      <CreatePostForm dealerCars={dealerCars} />
    </CreatePostProvider>
  );
};

export default CreatePostPage;
