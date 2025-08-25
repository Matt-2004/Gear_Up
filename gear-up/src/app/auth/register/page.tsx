import Form from "@/components/Form"
import Image from "next/image"

export default function Register() {
    return (
        <main className="w-full h-full mx-auto">
            <Title />
            <Form instruction="Create an Account" type="register" />
            {/* <Form />
            <Button />
            <ThirdPartyRegistration /> Google and Line */}
        </main>
    )
}

export function Title() {
    return (
        <div>
            <Image src={"/GearUp.png"} priority alt="Logo" height={170} width={170} className="mt-[-40px] ml-[-10px]" />
        </div>
    )
}