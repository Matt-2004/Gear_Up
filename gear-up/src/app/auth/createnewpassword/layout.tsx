import { Metadata } from "next";

export default function CreateNewPasswordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
        </div>
    )
}

export const metadata: Metadata = {
    title: "Create New Password - Gear Up",
    description: "Set a new password for your Gear Up account to enhance security and regain access.",
}