import {useQuery} from "@tanstack/react-query";
import {getAllKyc} from "@/utils/FetchAPI";
import DataTable from "@/components/Admin/DataTable";

const AdminKycVerification = () => {

    const { data: kyc, isLoading } = useQuery({
        queryKey: ["kycVerification"],
        queryFn: getAllKyc,
        retry: false,
        enabled: true,
    });

    console.log(kyc);

    if(isLoading) {
        return (
            <div>Loading</div>
        )
    }

    if(kyc) {
        return (
            <div>
                this is kyc dashboard
                <DataTable kyc={kyc.data} />
            </div>
        )
    }
}

export default AdminKycVerification;