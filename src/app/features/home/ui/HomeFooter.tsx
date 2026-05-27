"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Instagram, Facebook, Youtube } from "lucide-react";

const SOCIALS = [
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
];

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, delay: i * 0.05 },
  }),
};

export default function HomeFooter() {
  return (
    <footer
      className="relative overflow-hidden border-t border-zinc-800 text-zinc-400"
      style={{ background: "linear-gradient(180deg, #050802 0%, #000000 100%)" }}
    >
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-600/[0.03] blur-3xl" />
      <div className="relative z-10 flex w-full justify-center">
        <div className="w-full px-4 py-20 lg:w-[90%] xl:w-[75%]">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  GearUp
                </span>
                <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Beta
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
                Thailand&apos;s most trusted automotive marketplace. Discover, compare,
                and book your next car with confidence.
              </p>
              <div className="mt-5 flex gap-3">
                {SOCIALS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-500 transition-all duration-150 hover:border-zinc-500 hover:text-white cursor-pointer"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Marketplace */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Marketplace
              </p>
              <ul className="mt-4 space-y-3">
                {marketplaceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors duration-150 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Company
              </p>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors duration-150 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Support
              </p>
              <ul className="mt-4 space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 transition-colors duration-150 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 flex flex-col gap-4 border-t border-zinc-800 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-zinc-500">
              &copy; {new Date().getFullYear()} GearUp. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-zinc-500 transition-colors duration-150 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-zinc-500 transition-colors duration-150 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-zinc-500 transition-colors duration-150 hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
