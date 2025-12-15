import ResetPassword from "./ResetPassword"
import { submit } from "./action"

const Page = () => {
	return <ResetPassword onSubmit={submit} />
}

export default Page
