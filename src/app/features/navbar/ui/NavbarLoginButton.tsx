import Link from "next/link";

export default function NavbarLoginButton() {
  return (
    <Link
      href="/auth/login"
      className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
    >
      Sign In
    </Link>
  );
}
