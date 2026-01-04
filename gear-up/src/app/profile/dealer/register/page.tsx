import KycRegisterFormProvider from "./context/KycRegisterContext"
import KycRegister from "./KycRegister"

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
