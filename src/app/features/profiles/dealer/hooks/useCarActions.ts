import { deleteCarById } from "@/app/shared/utils/API/CarAPI";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function useCarActions() {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<{
    carId: string;
    loading: boolean;
  } | null>(null);

  const confirmDeleteOpen = deleteTarget !== null;
  const confirmDeleteLoading = deleteTarget?.loading ?? false;

  const openDeleteConfirm = useCallback((carId: string) => {
    setDeleteTarget({ carId, loading: false });
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteTarget({ carId: deleteTarget.carId, loading: true });
    try {
      await deleteCarById(deleteTarget.carId);
      setDeleteTarget(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  const handleEdit = useCallback(
    (carId: string) => {
      router.push(`/profile/dealer/cars/edit/${carId}`);
    },
    [router],
  );

  return {
    handleEdit,
    openDeleteConfirm,
    confirmDeleteOpen,
    confirmDeleteLoading,
    cancelDelete,
    handleDelete,
  };
}
