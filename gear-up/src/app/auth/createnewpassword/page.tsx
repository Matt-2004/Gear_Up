import Input from "@/components/Input"
import Image from "next/image"

const Page = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
            <form className="relative h-[70%] w-[60%] bg-white rounded-lg flex flex-col justify-center items-center gap-1 p-8">
                <Image src={"/Gear.png"} alt="logo" width={180} height={120} className="absolute -top-8 left-0 " />
                <div id="header" className="h-1/4 flex justify-center items-center text-4xl font-bold">
                    {/* Logo */}
                    <h1>Create New Password</h1>
                </div>

                <p className="w-2/4 mb-4 -ml-4">Your new password must be different from previous and password.</p>
                <div className="flex flex-col gap-4 mb-4">

                    <Input type="password" placeholder="Enter your new password">New Password</Input>
                    <Input type="password" placeholder="Re-enter your new password">Confirm Password</Input>
                </div>

                <button type="submit" className="w-[30rem] main-color-gradient py-3 rounded-md font-semibold text-lg text-white mb-4">Change Password</button>

            </form>
        </div>
    )
}

export default Page