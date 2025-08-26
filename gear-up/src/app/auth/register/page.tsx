import Form from "@/components/Form"
import Image from "next/image"

export default function Register() {
    return (
        <main className="w-full h-full mx-auto ">
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
        <div className="w-full border-[#7ED957] border-b h-20">

            <div className="lg:w-[75%] w-[90%] mx-auto h-20 object-contain object-center items-start flex flex-col justify-center ">
                <Image src={"/Gear.png"} priority alt="Logo" height={120} width={120} className="" />
            </div>
        </div>
    )
}