import EmailSend from "../EmailSend"
import { submit } from "./action"

const Page = () => {
	return <EmailSend onSubmit={submit} />
}

export default Page
