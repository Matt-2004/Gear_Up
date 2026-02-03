import { deleteCarById } from "@/utils/API/CarAPI";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useCarActions() {
  const router = useRouter();

  const handleDelete = useCallback(async (carId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      await deleteCarById(carId);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("An error occurred while deleting the vehicle");
    }
  }, []);

  const handleEdit = useCallback(
    (carId: string) => {
      router.push(`/profile/dealer/cars/edit/${carId}`);
    },
    [router],
  );

  return { handleDelete, handleEdit };
}
