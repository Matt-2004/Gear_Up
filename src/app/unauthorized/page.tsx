import { Home, LogIn, ShieldUser } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <ShieldUser className="h-7 w-7 text-red-600" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">
          Session expired
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Your session has expired or you’re not signed in. Please log in again
          to continue.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={"/auth/login"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
