import Link from "next/link";

const marketplaceLinks = [
  { label: "Browse Cars", href: "/car/search" },
  { label: "Featured Cars", href: "/#featured" },
  { label: "Sell My Car", href: "/profile/dealer/register?step=1" },
  { label: "Book a Test Drive", href: "/car/search" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Press", href: "/press" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Contact Us", href: "/contact" },
  { label: "Safety Tips", href: "/safety" },
  { label: "Report a Listing", href: "/report" },
];

export default function HomeFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="flex w-full justify-center">
        <div className="w-full px-4 py-16 lg:w-[90%] xl:w-[75%]">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <p className="text-xl font-bold tracking-tight text-white">
                GearUp
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
                The most trusted automotive marketplace. Discover, compare, and
                book your next car with confidence.
              </p>
              {/* Social icons */}
              <div className="mt-5 flex gap-3">
                {["Twitter", "Instagram", "Facebook", "YouTube"].map(
                  (social) => (
                    <span
                      key={social}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-xs text-gray-400 transition-colors hover:border-white/20 hover:text-white"
                    >
                      {social[0]}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Marketplace */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                Marketplace
              </p>
              <ul className="mt-4 space-y-3">
                {marketplaceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                Company
              </p>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">
                Support
              </p>
              <ul className="mt-4 space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 GearUp. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
