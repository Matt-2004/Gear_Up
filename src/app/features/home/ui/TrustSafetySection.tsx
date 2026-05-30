"use client";

import { ShieldCheck, FileCheck, Users, Eye } from "lucide-react";
import { motion } from "framer-motion";

const TRUST_ITEMS = [
  {
    icon: FileCheck,
    title: "Verified Listings & Dealers",
    description:
      "Every vehicle passes a 150-point inspection before listing. All dealers undergo identity verification and background checks — so you browse with total confidence.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Escrow Payments",
    description:
      "Your payment is held safely in escrow until you confirm the car matches the listing. End-to-end encrypted transactions protect every deal.",
  },
  {
    icon: Users,
    title: "Buyer Protection Guarantee",
    description:
      "7-day return window on all certified vehicles. If the car isn't what you expected, we'll make it right. We stand behind every transaction on our platform.",
  },
  {
    icon: Eye,
    title: "Full Transparency & Financing",
    description:
      "Complete vehicle history, ownership records, and pricing insights for every listing. Get pre-approved in minutes through our trusted lending partners with competitive rates.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function TrustSafetySection() {
  return (
    <section
      className="relative flex w-full justify-center overflow-hidden py-20 md:py-28"
      style={{
        background: "linear-gradient(180deg, #061E09 0%, #0a0f05 100%)",
      }}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-primary-600/4 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-600/3 blur-3xl" />

      <div className="relative z-10 w-full px-4 lg:w-[90%] xl:w-[75%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.15 }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
            Built on Trust, Backed by Protection
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">
            Every transaction on GearUp is protected by industry-leading
            security and verification systems.
          </p>
        </motion.div>

        {/* 2x2 Trust Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2"
        >
          {TRUST_ITEMS.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -3 }}
              className="group flex flex-col items-center text-center gap-5 rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/10 md:p-8"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600/20 transition-colors duration-300 group-hover:bg-primary-600/30">
                <item.icon className="h-6 w-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-base tracking-wide font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed tracking-wide text-zinc-400">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom compliance bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.15, delay: 0.12 }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-6 rounded-2xl border border-white/8 bg-white/5 px-6 py-4 backdrop-blur-sm">
            <span className="text-xs font-medium text-zinc-400">
              256-bit SSL
            </span>
            <span className="h-4 w-px bg-white/12" />
            <span className="text-xs font-medium text-zinc-400">
              PCI Compliant
            </span>
            <span className="h-4 w-px bg-white/12" />
            <span className="text-xs font-medium text-zinc-400">
              GDPR Ready
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
