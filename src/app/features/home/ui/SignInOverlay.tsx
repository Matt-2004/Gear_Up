import { User } from "lucide-react";
import Link from "next/link";

export default function SignInOverlay({ onClose }: { onClose: () => void }) {
  // parent component's control show and hide ovelay
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={() => onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <User className="text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Sign in required
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Please log in or create an account to access this feature and
            explore our platform.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="w-full rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors text-center"
          >
            Log In
          </Link>
          <Link
            href="/auth/register"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors text-center"
          >
            Create Account
          </Link>
        </div>

        <button
          onClick={() => onClose()}
          className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
