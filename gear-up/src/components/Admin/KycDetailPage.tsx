"use client"

import {useQuery} from "@tanstack/react-query";
import {getKycById} from "@/utils/FetchAPI";
import {IKycSubmissions} from "@/app/types/kyc.types";

const KycDetailPage = ({id}: {id: string}) => {

    const { data: detail } = useQuery({
        queryKey: ["KYC", id],
        queryFn: () => getKycById(id),
        staleTime: 5000,
        retry: false,
        enabled: true,
    });



    if(detail) {

        const kycArray: [string, string][] = Object.entries(detail.data.data);

        return (
            <div>
                {kycArray.map((item, i: number) => {
                    return (
                        <div key={i}>{item[0]}: {item[1]}</div>
                    );
                })}
            </div>
        )
    }
}
export default KycDetailPage;