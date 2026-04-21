import ResetPassword from "@/app/features/auth/resetPassword/ui/resetPassword";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback="Loading...">
      <ResetPassword />
    </Suspense>
  );
};

export default Page;
