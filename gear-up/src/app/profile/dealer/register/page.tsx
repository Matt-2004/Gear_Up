import { Metadata } from "next"
import KycRegisterFormProvider from "./context/KycRegisterContext"
import KycRegister from "./KycRegister"

export const metadata: Metadata = {
	title: "Dealer Registration - Gear Up",
	description: "Register as a dealer and start selling vehicles on Gear Up.",
}

const Page = async ({
	searchParams,
}: {
	searchParams: Promise<{ step: string }>
}) => {
	const param = await searchParams

	return (
		<KycRegisterFormProvider>
			<KycRegister step={param.step} />
		</KycRegisterFormProvider>
	)
}

export default Page
