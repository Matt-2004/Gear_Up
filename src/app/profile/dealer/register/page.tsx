import { Metadata } from "next";
import KycRegisterFormProvider from "../../../features/profiles/dealer/context/KycFormContext";
import KycRegister from "@/app/features/profiles/dealer/ui/dealer-kyc-register/KycRegister";

export const metadata: Metadata = {
  title: "Dealer Registration - Gear Up",
  description: "Register as a dealer and start selling vehicles on Gear Up.",
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ step: string }>;
}) => {
  const param = await searchParams;

  return (
    <KycRegisterFormProvider>
      <KycRegister step={param.step} />
    </KycRegisterFormProvider>
  );
};

export default Page;
