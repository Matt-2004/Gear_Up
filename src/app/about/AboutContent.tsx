"use client";

import PageShell from "@/app/shared/ui/PageShell";
import {
  Shield,
  Heart,
  Zap,
  Users,
  ArrowRight,
  CalendarDays,
  Smile,
  Building2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRevealOnScroll } from "@/app/shared/hooks/useRevealOnScroll";
import { useCountUp } from "@/app/shared/hooks/useCountUp";

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "Every listing is verified. Every transaction is protected. We believe car buying should be honest.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "We built GearUp around what buyers and sellers actually need — not what the industry has always done.",
  },
  {
    icon: Zap,
    title: "Speed & Simplicity",
    description:
      "From search to signing, we remove friction at every step. Book a test drive in seconds, not days.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Thousands of buyers, sellers, and dealers make our marketplace better every day with reviews and feedback.",
  },
];

const TEAM = [
  {
    name: "Alex Chen",
    role: "CEO & Co-Founder",
    initials: "AC",
    bg: "bg-[#EAF3DE]",
    text: "text-[#27500A]",
    bio: "Previously built two marketplace startups to successful exits.", // TODO: replace with real content
  },
  {
    name: "Sarah Williams",
    role: "CTO & Co-Founder",
    initials: "SW",
    bg: "bg-[#E1F5EE]",
    text: "text-[#085041]",
    bio: "Former engineering lead at a Fortune 500 automotive company.", // TODO: replace with real content
  },
  {
    name: "Mark Thompson",
    role: "Head of Product",
    initials: "MT",
    bg: "bg-[#E6F1FB]",
    text: "text-[#0C447C]",
    bio: "10+ years building consumer products used by millions.", // TODO: replace with real content
  },
  {
    name: "Priya Patel",
    role: "Head of Design",
    initials: "PP",
    bg: "bg-[#FAEEDA]",
    text: "text-[#633806]",
    bio: "Award-winning designer who shaped experiences at leading e-commerce platforms.", // TODO: replace with real content
  },
];

export default function AboutContent() {
  const statsReveal = useRevealOnScroll();
  const valuesReveal = useRevealOnScroll();
  const teamReveal = useRevealOnScroll();

  return (
    <PageShell
      badge="Our Story"
      title="About GearUp"
      description="We're rebuilding the automotive marketplace from the ground up — making car buying and selling simpler, safer, and faster for everyone."
    >
      <div className="space-y-20">
        {/* Stats */}
        <div
          ref={statsReveal.ref}
          suppressHydrationWarning
          className={`grid grid-cols-2 gap-4 sm:grid-cols-4 transition-all duration-500 ${
            statsReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <StatCard
            icon={CalendarDays}
            value="2024"
            label="Founded"
            index={0}
          />
          <StatCard
            icon={Smile}
            targetValue={50}
            suffix="k+"
            label="Happy Drivers"
            index={1}
          />
          <StatCard
            icon={Building2}
            targetValue={1200}
            suffix="+"
            label="Dealer Partners"
            index={2}
          />
          <StatCard
            icon={Star}
            targetValue={98}
            suffix="%"
            label="Satisfaction"
            index={3}
          />
        </div>

        {/* Mission */}
        <div className="rounded-3xl bg-[#1C3309] px-8 py-14 text-white md:px-16 md:py-20">
          <h2 className="text-center font-serif text-2xl font-bold md:text-3xl">
            Our Mission
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed text-gray-200 md:text-xl">
            To create the world&apos;s most trusted automotive marketplace —
            where every listing is verified, every transaction is secure, and
            every customer walks away confident in their decision.
          </p>
        </div>

        {/* Values */}
        <div ref={valuesReveal.ref}>
          <h2 className="mb-10 text-center font-serif text-2xl font-bold text-gray-900 md:text-3xl">
            What We Stand For
          </h2>
          <div
            suppressHydrationWarning
            className={`grid grid-cols-1 gap-5 transition-all duration-500 sm:grid-cols-2 ${
              valuesReveal.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {VALUES.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#97C459] hover:shadow-md"
                style={{
                  transitionDelay: valuesReveal.isVisible
                    ? `${i * 80}ms`
                    : "0ms",
                }}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary-100">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div ref={teamReveal.ref}>
          <h2 className="mb-10 text-center font-serif text-2xl font-bold text-gray-900 md:text-3xl">
            Leadership
          </h2>
          <div
            suppressHydrationWarning
            className={`grid grid-cols-2 gap-5 transition-all duration-500 sm:grid-cols-4 ${
              teamReveal.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#97C459] hover:shadow-md"
                style={{
                  transitionDelay: teamReveal.isVisible
                    ? `${i * 80}ms`
                    : "0ms",
                }}
              >
                <div
                  className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-xl font-semibold transition-transform group-hover:scale-105 ${member.bg} ${member.text}`}
                  role="img"
                  aria-label={member.name}
                >
                  {member.initials}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{member.role}</p>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-[#1C3309] px-8 py-14 text-center text-white md:px-16 md:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
            aria-hidden="true"
          />
          <h2 className="relative font-serif text-3xl font-bold md:text-4xl">
            Ready to get started?
          </h2>
          <p className="relative mt-3 text-lg text-gray-300">
            Join thousands of happy drivers on GearUp today.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/car/search"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#1C3309] shadow-sm transition-all hover:bg-gray-100 hover:shadow-md"
            >
              Browse Cars <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/80 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function StatCard({
  icon: Icon,
  value,
  targetValue,
  suffix,
  label,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value?: string;
  targetValue?: number;
  suffix?: string;
  label: string;
  index: number;
}) {
  const { ref, displayValue } = useCountUp({
    target: targetValue ?? 0,
    suffix: suffix ?? "",
  });

  return (
    <div
      ref={ref}
      suppressHydrationWarning
      className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#97C459] hover:shadow-md"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary-100">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-serif text-5xl font-bold tracking-tight text-gray-900">
        {targetValue !== undefined ? displayValue : value}
      </p>
      <p className="mt-1.5 text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}
