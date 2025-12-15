import Register from "./Register"
import { submit } from "./action"

const Page = () => {
	return <Register onSubmit={submit} />
}

export default Page
