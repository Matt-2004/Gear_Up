import Link from "next/link";
import { useProfile } from "../useProfile";
import Input from "@/components/Input";

export default function ViewProfile() {

    const { data, isLoading } = useProfile();

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }
    if (data) {
        const userData = Object.entries(data.data);

        return (
            <>
                <div className="p-4">
                    <h1 className="text-2xl font-medium">View Profile</h1>
                    <div className="flex flex-col gap-4 mt-4">
                        <img src={data.data.avatarUrl} alt="Profile Picture" className="w-32 h-32 rounded-full object-cover" />
                        <Link href={"/profile/dealer/register"}>
                            <button className=" text-primary font-medium px-4 py-2 rounded-md cursor-pointer">
                                Become our partner
                            </button>
                        </Link>
                        {userData.map(([key, value]) => (
                            key !== "id" && key !== "role" && key !== "avatarUrl" && key !== "provider" &&
                            <Input key={key} id={key} disabled={true} name={key} type="text" value={String(value)}>{key.charAt(0).toUpperCase() + key.slice(1)}</Input>
                        ))}
                    </div>
                </div>

            </>
        );

    }
}