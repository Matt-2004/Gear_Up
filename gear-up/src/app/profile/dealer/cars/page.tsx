// Dealer car inventory page

import { getMyCars } from "@/utils/API/CarAPI";
import DealerCarDashboard from "./DealerCarDashboard";

const Page = async () => {
  let carData = [];

  try {
    const response = await getMyCars();
    carData = response?.data?.items || [];
  } catch (error) {
    console.error("Failed to fetch dealer cars:", error);
    // Use empty array as fallback
    carData = [];
  }

  return <DealerCarDashboard carData={carData} />;
};

export default Page;
