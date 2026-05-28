"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const STEPS = [
  {
    step: 1,
    image: "/progress-landing/explore.png",
    title: "Explore Cars",
    description:
      "Browse verified vehicles with transparent pricing, inspection reports, and trusted dealer info.",
  },
  {
    step: 2,
    image: "/progress-landing/appointment.png",
    title: "Book Test Drive",
    description:
      "Schedule appointments instantly with available time slots and real-time dealer confirmation.",
  },
  {
    step: 3,
    image: "/progress-landing/contact.png",
    title: "Contact Dealer",
    description:
      "Communicate securely with verified dealers directly through the platform.",
  },
  {
    step: 4,
    image: "/progress-landing/deal.png",
    title: "Make a Deal",
    description:
      "Review financing, inspection reports, and finalize the agreement securely.",
  },
  {
    step: 5,
    image: "/progress-landing/finish.png",
    title: "Drive Away",
    description:
      "Complete the purchase process and enjoy your new vehicle with confidence.",
  },
];

const cardVariants = {
  hidden: (i: number) => ({ opacity: 0, x: i % 2 === 0 ? -60 : 60 }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function HowGearUpWorksSection() {
  return (
    <section
      className="relative flex w-full justify-center overflow-hidden py-20 md:py-28"
      style={{
        background: "linear-gradient(180deg, #0a0f05 0%, #061E09 100%)",
      }}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-primary-600/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-600/[0.03] blur-3xl" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:w-[90%] xl:w-[80%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.15 }}
          className="mb-16 flex flex-col items-center text-center md:mb-24"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Your Journey to Ownership
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-400 md:text-base">
            From discovering your next vehicle to closing the deal — everything
            happens seamlessly in one trusted platform.
          </p>
        </motion.div>

        {/* ========== DESKTOP: Horizontal timeline ========== */}
        <div className="relative hidden md:block">
          {/* Center vertical line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2">
            <div className="h-full w-full rounded-full bg-zinc-800" />
            <motion.div
              className="absolute left-0 top-0 w-px rounded-full bg-gradient-to-b from-primary-500 via-primary-600 to-primary-700"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2.0, delay: 0.2, ease: "easeInOut" }}
            />
          </div>

          <div className="flex flex-col gap-14 lg:gap-20">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={step.step} className="relative flex items-center">
                  {/* Center step circle */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: i * 0.12 + 0.1 }}
                    className="absolute left-1/2 z-10 flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full bg-white text-base font-bold text-primary-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-gray-200"
                  >
                    {step.step}
                  </motion.div>

                  {/* Connector stub from center to card */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 h-px w-12 bg-zinc-700 ${isLeft ? "right-1/2 mr-[26px]" : "left-1/2 ml-[26px]"}`}
                  >
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-500 ${isLeft ? "left-0" : "right-0"}`}
                    />
                  </div>

                  {/* Card */}
                  <motion.div
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className={`flex w-[calc(50%-56px)] ${isLeft ? "mr-auto justify-end" : "ml-auto justify-start"}`}
                  >
                    <div
                      className={`flex w-full max-w-[480px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                    >
                      {/* Text side */}
                      <div className="flex flex-1 flex-col justify-center px-6 py-6">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                          Step {step.step}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-5 tracking-wide text-gray-600">
                          {step.description}
                        </p>
                      </div>

                      {/* Image side */}
                      <div className="relative flex h-44 w-44 shrink-0 items-center justify-center bg-white lg:h-48 lg:w-48">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={200}
                          height={200}
                          className="h-full w-full object-contain p-4"
                          sizes="192px"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== MOBILE: Vertical timeline ========== */}
        <div className="relative mx-auto max-w-lg md:hidden">
          <div className="absolute left-5 top-0 h-full w-px">
            <div className="h-full w-full rounded-full bg-zinc-800" />
            <motion.div
              className="absolute left-0 top-0 w-px rounded-full bg-gradient-to-b from-primary-500 via-primary-600 to-primary-700"
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.1, ease: "easeInOut" }}
            />
          </div>

          <div className="flex flex-col gap-5">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.25, delay: i * 0.08 }}
                className="relative flex gap-4"
              >
                <div className="flex shrink-0 flex-col items-center">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-gray-200">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                  <div className="relative flex h-36 items-center justify-center bg-gray-50">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={400}
                      height={300}
                      className="h-full w-full object-contain p-3"
                      sizes="240px"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-5 pb-5 pt-4">
                    <h3 className="text-base font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
