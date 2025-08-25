import Link from "next/link";
import Button from "./Button";

interface FormProps {
    type: 'register' | 'login';
    instruction: string;
}


export default function Form({ type, instruction }: FormProps) {
    return (
        <div className="w-[90%] mx-auto">
            <div className=" space-y-6">

                <h2 className="text-3xl mb-6 font-semibold flex justify-center">
                    {instruction}
                </h2>
                {type === 'register' && <FirstLastName />}

                <Email />
                <Password />
                <Checkbox type={type} />
                <Button type={type} />
                <Spacer />
                <ThirdPartyRegistration />
                <Switcher type={type} />
            </div>
        </div>
    )
}

function Switcher({ type }: { type: 'register' | 'login' }) {
    return (
        <div className="flex justify-center space-x-1 text-[14px]">
            {type === 'register' && <>
                <span>Already have an account?</span>
                <Link href="/auth/login" className="text-blue-600 font-medium">Login</Link>
            </>}
            {type === 'login' && <>
                <span>Don't have an account?</span>
                <Link href="/auth/register" className="text-blue-600 font-medium">Register</Link>
            </>}
        </div>
    )
}


function ThirdPartyRegistration() {
    return (
        <div className="flex flex-col space-y-4">
            <button className="w-full border border-black  py-2 flex items-center justify-center space-x-2">
                <img src="/Google.png" alt="Google Logo" className="w-7 h-7" />
                <span className="text-md">Continue with <b>Google</b></span>
            </button>
            <button className="w-full border border-black py-2 flex items-center justify-center space-x-2">
                <img src="/line.png" alt="Line Logo" className="w-7 h-7" />
                <span className="text-md">Continue with <b>Line</b></span>
            </button>
        </div>
    )
}

function Spacer() {
    return (
        <div className="flex space-x-14">
            <div className="h-[1px] w-32 bg-black" />
            <div className="h-[1px] w-4 bg-black" />
            <div className="h-[1px] w-32 bg-black" />
        </div>
    )
}

function FirstLastName() {
    return (
        <div className="flex w-full justify-between">
            <input className="outline-none w-[45%] border-b placeholder:text-[12px] py-2 placeholder:pl-2" type="text" placeholder="First Name" />
            <input className="outline-none w-[45%] border-b placeholder:text-[12px] py-2 placeholder:pl-2" type="text" placeholder="Last Name" />
        </div>
    );
}

function Email() {
    return (
        <input className="outline-none w-full border-b placeholder:text-[12px] py-2 placeholder:pl-2" type="email" placeholder="Email" required />
    )
}

function Password() {
    return (
        <input className="outline-none w-full border-b placeholder:text-[12px] py-2 placeholder:pl-2" type="password" placeholder="Password" required minLength={8} maxLength={20} autoComplete="new-password" />
    )
}

function Checkbox(type: { type: 'register' | 'login' }) {
    return (
        <div className="flex items-center">
            {type.type === 'login' &&
                <div className="flex justify-between w-full">
                    <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4 mr-2" id="remember" /><label htmlFor="remember" className="text-[12px]">Remember Me</label>
                    </div>
                    <h3 className="text-[14px] font-medi">Forget Password</h3>
                </div>}
            {type.type === 'register' && <><input type="checkbox" className="w-4 h-4 mr-2" id="terms" required /><label htmlFor="terms" className="text-[12px]">I agree to <b>The Terms of User</b></label></>}
        </div>
    )
}