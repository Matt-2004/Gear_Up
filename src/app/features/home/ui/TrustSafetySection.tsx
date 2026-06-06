"use client";

import { motion } from "framer-motion";

// ─── Data ────────────────────────────────────────────────────────────────

const METRICS = [
  { value: "12,000+", label: "Verified Vehicles" },
  { value: "4,500+", label: "Successful Transactions" },
  { value: "98.7%", label: "Customer Satisfaction" },
  { value: "24h", label: "Average Response Time" },
];

const PROTECTION_CARDS = [
  {
    badge: "VERIFIED",
    title: "Verified Listings & Dealers",
    points: [
      "150-point vehicle inspection",
      "Identity-verified dealerships",
      "Background verification completed",
    ],
  },
  {
    badge: "SECURE",
    title: "Escrow Payment Protection",
    points: [
      "Funds held securely until approval",
      "End-to-end encrypted transactions",
      "Fraud monitoring system",
    ],
  },
  {
    badge: "PROTECTED",
    title: "Buyer Protection Guarantee",
    points: [
      "7-day return policy",
      "Dispute resolution support",
      "Purchase protection coverage",
    ],
  },
  {
    badge: "TRANSPARENT",
    title: "Full Vehicle Transparency",
    points: [
      "Ownership history",
      "Service records",
      "Market pricing insights",
      "Financing options available",
    ],
  },
];

const PROTECTION_STEPS = [
  "Dealer Verification",
  "Vehicle Inspection",
  "Test Drive",
  "Secure Escrow Payment",
  "Ownership Transfer",
];

const REVIEWS = [
  {
    text: "Sold my car in 3 days. The escrow system gave me real peace of mind.",
    author: "Tanawat, Bangkok",
  },
  {
    text: "The inspection report was incredibly detailed. Knew exactly what I was buying.",
    author: "Sarah, Chiang Mai",
  },
  {
    text: "Finally a marketplace where both buyers and sellers are protected. Game changer.",
    author: "Michael, Phuket",
  },
];

// ─── Component ──────────────────────────────────────────────────────────

export default function TrustSafetySection() {
  return (
    <section
      className="relative flex w-full justify-center overflow-hidden pb-20 md:pb-28 pt-0"
      style={{
        background: "linear-gradient(180deg, #061E09 0%, #0a0f05 100%)",
      }}
    >
      {/* Subtle ambient orbs */}
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-primary-600/3 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-600/2 blur-3xl" />

      <div className="relative z-10 w-full px-4 lg:w-[90%] xl:w-[75%]">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
            Built on Trust, Backed by Protection
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
            Every transaction is protected through dealer verification, vehicle
            inspection, secure payments, and buyer safeguards.
          </p>
        </motion.div>

        {/* ── Trust Metrics ── */}
        <div className="mb-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="font-serif text-3xl font-bold tabular-nums tracking-tight text-white md:text-4xl">
                {metric.value}
              </p>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-widest text-zinc-500">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Protection Cards ── */}
        <div className="mb-14 grid gap-4 sm:grid-cols-2">
          {PROTECTION_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/8 bg-white/3 p-6 transition-colors duration-300 hover:border-white/12 md:p-7"
            >
              {/* Small trust badge */}
              <span className="inline-flex items-center gap-1 rounded-full border border-primary-500/20 bg-primary-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-400">
                ✓ {card.badge}
              </span>

              <h3 className="mt-4 text-base font-semibold tracking-wide text-white">
                {card.title}
              </h3>

              <ul className="mt-3 space-y-1.5">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-sm leading-relaxed text-zinc-400"
                  >
                    <span className="block h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── How It Works ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mb-20"
        >
          <h3 className="mb-6 text-center font-serif text-2xl font-bold text-white">
            How Your Purchase Is Protected
          </h3>

          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-4">
            {PROTECTION_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-4 py-2">
                  <span className="text-[10px] font-bold text-zinc-600 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-zinc-300">
                    {step}
                  </span>
                </div>
                {i < PROTECTION_STEPS.length - 1 && (
                  <span className="hidden text-zinc-700 sm:block">→</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Social Proof ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-20"
        >
          {/* Rating */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-amber-400">
              {"★★★★★"}
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-white">
              4.8/5
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Trusted by thousands of buyers and sellers across Thailand
            </p>
          </div>

          {/* Review snippets */}
          <div className="grid gap-4 sm:grid-cols-3">
            {REVIEWS.map((review) => (
              <div
                key={review.author}
                className="rounded-xl border border-white/5 bg-white/2 p-5"
              >
                <p className="text-sm leading-relaxed text-zinc-400">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-3 text-xs font-medium text-zinc-500">
                  — {review.author}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Certification Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-5 rounded-xl border border-white/5 bg-white/2 px-6 py-4"
        >
          <span className="text-xs font-medium text-zinc-500">
            256-bit SSL Encryption
          </span>
          <span className="hidden h-4 w-px bg-white/8 sm:block" />
          <span className="text-xs font-medium text-zinc-500">
            PCI-Compliant Payments
          </span>
          <span className="hidden h-4 w-px bg-white/8 sm:block" />
          <span className="text-xs font-medium text-zinc-500">
            Identity Verified Dealers
          </span>
          <span className="hidden h-4 w-px bg-white/8 sm:block" />
          <span className="text-xs font-medium text-zinc-500">
            Buyer Protection Policy
          </span>
        </motion.div>
      </div>
    </section>
  );
}
