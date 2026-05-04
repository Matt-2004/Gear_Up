import KycDetailPage from "@/app/features/profiles/admin/ui/kyc/AdminKycDetail";
import { KycMapper } from "@/app/features/profiles/dealer/types/kyc.mapper";
import { getKycById } from "@/app/shared/utils/API/AdminAPI";

const getKycDataById = async (id: string) => {
  const response = await getKycById(id);
  const kycData = KycMapper(response.data);
  return kycData;
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const kycById = await getKycDataById(id);

  return <KycDetailPage kycById={kycById} />;
};

export default Page;
