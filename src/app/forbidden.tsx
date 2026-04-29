import { Home, LogIn, ShieldUser } from "lucide-react";
import Link from "next/link";

const Forbidden = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <ShieldUser className="h-7 w-7 text-red-600" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">
          Access Resitrcted
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          This account doesn’t have permission to view this page. Please switch
          accounts or go back to a page you can access.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href={"/"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
