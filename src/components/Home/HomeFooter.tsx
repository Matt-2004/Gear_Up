import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="flex w-full justify-center">
        <div className="w-full px-4 py-12 lg:w-[90%] xl:w-[75%]">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-lg font-semibold text-white">Gear Up</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Your trusted marketplace to discover, compare, and book your
                next car with confidence.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white">
                Marketplace
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile/dealer/register?step=1"
                    className="hover:text-white"
                  >
                    Sell My Car
                  </Link>
                </li>
                <li>
                  <Link href="/#featured" className="hover:text-white">
                    Featured Cars
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white">
                Company
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white">
                Contact
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li>support@gearup.com</li>
                <li>+123 456 7890</li>
                <li>Bangkok, Thailand</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-3 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
              <p>© 2026 Gear Up. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-gray-300">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-gray-300">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
