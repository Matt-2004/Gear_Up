import Form from "@/components/Form"
import { Title } from "../register/page"

const Login = () => {
    return (
        <div>
            <Title />
            <Form type="login" instruction="Login to Your Account" />
        </div>
    )
}

export default Login