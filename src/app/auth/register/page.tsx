import { Metadata } from "next";
import Register from "../../features/auth/signUp/ui/Register";

export const metadata: Metadata = {
  title: "Register - Gear Up",
  description:
    "Create a new Gear Up account to buy, sell, and discover amazing vehicles.",
};

const Page = () => {
  return <Register />;
};

export default Page;
