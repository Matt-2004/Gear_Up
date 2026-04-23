import { Metadata } from "next";
import ProfilePage from "../../features/user/ui/UserProfile";

export const metadata: Metadata = {
  title: "My Profile - Gear Up",
  description: "View and manage your Gear Up profile and settings.",
};

const Page = async () => {
  return (
    <>
      <ProfilePage />
    </>
  );
};

export default Page;
