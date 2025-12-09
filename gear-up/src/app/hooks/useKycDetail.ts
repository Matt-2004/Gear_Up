// hooks/useKycDetail.ts
import { useQuery } from "@tanstack/react-query"
import { getKycById } from "@/utils/FetchAPI"

export const useKycDetail = (id?: string) => {
	return useQuery({
		queryKey: ["kycDetail", id], // ✅ cache per id
		queryFn: () => getKycById(id!),
		enabled: !!id, // ✅ only fetch if id exists
		staleTime: 5 * 60 * 1000, // 5 minutes cache
	})
}
