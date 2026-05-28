"use client";

import { BadgeCheck, ShieldCheck, CalendarDays, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Verified Listings",
    icon: BadgeCheck,
    description:
      "Every vehicle is reviewed by our team to ensure accuracy, quality photos, and honest descriptions.",
  },
  {
    title: "Secure Transactions",
    icon: ShieldCheck,
    description:
      "Buy and sell with confidence through our protected payment and escrow system.",
  },
  {
    title: "Instant Booking",
    icon: CalendarDays,
    description:
      "Schedule test drives in seconds. Pick a time that works for you and show up.",
  },
  {
    title: "Financing Support",
    icon: CreditCard,
    description:
      "Connect with trusted lenders and get pre-approved before you start shopping.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function ValuePropositionSection() {
  return (
    <section className="relative flex w-full justify-center bg-white py-16 md:py-24 overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative z-10 w-full px-4 lg:w-[90%] xl:w-[75%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 flex flex-col items-center text-center"
        >
          <span className="mb-3 inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold tracking-wide text-primary-700">
            Why Choose GearUp
          </span>
          <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            Built for Trust, Speed, and Ease
          </h2>
          <p className="mt-3 max-w-lg text-sm text-gray-600 leading-relaxed">
            Everything you need to find, book, and buy your next car — all in one
            place.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map(({ title, icon: Icon, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all duration-300 hover:border-primary-100 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
