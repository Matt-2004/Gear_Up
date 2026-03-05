// hooks/useKycDetail.ts
import { getKycById } from "@/utils/API/AdminAPI"
import { useQuery } from "@tanstack/react-query"

export const useKycDetail = (id?: string) => {
	return useQuery({
		queryKey: ["kycDetail", id], // ✅ cache per id
		queryFn: async () => {
			const response = await getKycById(id!)
			return response?.data
		},
		enabled: !!id, // ✅ only fetch if id exists
		staleTime: 5 * 60 * 1000, // 5 minutes cache
	})
}
