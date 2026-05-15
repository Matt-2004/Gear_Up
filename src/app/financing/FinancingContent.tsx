"use client";

import PageShell from "@/app/shared/ui/PageShell";
import {
  Calculator,
  ShieldCheck,
  Clock,
  CreditCard,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRevealOnScroll } from "@/app/shared/hooks/useRevealOnScroll";

const STEPS = [
  {
    step: 1,
    title: "Check Your Rate",
    description:
      "Fill out a quick form and get personalized rate offers from our lender network.",
  },
  {
    step: 2,
    title: "Choose Your Offer",
    description:
      "Compare rates, terms, and monthly payments. Pick what works best for you.",
  },
  {
    step: 3,
    title: "Shop With Confidence",
    description:
      "Use your pre-approval to shop any listing on GearUp with real buying power.",
  },
];

const FEATURES = [
  {
    icon: Clock,
    title: "Instant Pre-Approval",
    description:
      "Get a decision in under 2 minutes without affecting your credit score.",
  },
  {
    icon: ShieldCheck,
    title: "Competitive Rates",
    description:
      "Access rates as low as 2.99% APR through our network of trusted lenders.",
  },
  {
    icon: CreditCard,
    title: "Flexible Terms",
    description:
      "Choose from 24 to 84 month terms that fit your budget and lifestyle.",
  },
  {
    icon: FileText,
    title: "Simple Paperwork",
    description:
      "Upload documents once and apply to multiple lenders simultaneously.",
  },
];

export default function FinancingContent() {
  const stepsReveal = useRevealOnScroll();
  const calculatorReveal = useRevealOnScroll();
  const featuresReveal = useRevealOnScroll();

  // Calculator state
  const [vehiclePrice, setVehiclePrice] = useState(1500000);
  const [downPayment, setDownPayment] = useState(300000);
  const [termMonths, setTermMonths] = useState(60);
  const [apr, setApr] = useState(7.5);

  const formatCurrency = (n: number) =>
    n.toLocaleString("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const calculatorResult = useMemo(() => {
    if (
      vehiclePrice <= 0 ||
      downPayment < 0 ||
      termMonths <= 0 ||
      apr <= 0
    ) {
      return { error: "Please enter a valid amount" };
    }

    if (downPayment >= vehiclePrice) {
      return { error: "Down payment cannot exceed vehicle price" };
    }

    const principal = vehiclePrice - downPayment;
    const r = apr / 100 / 12;
    const n = termMonths;

    const monthly =
      principal * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    const totalCost = monthly * n + downPayment;
    const totalInterest = totalCost - vehiclePrice;

    return {
      monthly,
      principal,
      totalInterest: Math.max(0, totalInterest),
      totalCost,
    };
  }, [vehiclePrice, downPayment, termMonths, apr]);

  const isValid = !calculatorResult.error;

  return (
    <PageShell
      badge="Financing"
      title="Drive Now, Pay Later"
      description="Get pre-approved for financing in minutes. Competitive rates, flexible terms, and no impact to your credit score."
    >
      <div className="space-y-16">
        {/* Steps */}
        <div ref={stepsReveal.ref}>
          <div
            className={`flex flex-col items-center gap-6 transition-all duration-500 lg:flex-row ${
              stepsReveal.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {STEPS.map((item, i) => (
              <div
                key={item.step}
                className="flex flex-1 flex-col items-center text-center"
                style={{
                  transitionDelay: stepsReveal.isVisible
                    ? `${i * 150}ms`
                    : "0ms",
                }}
              >
                {/* Pill row: circle — line — circle — line — circle */}
                <div className="mb-4 flex w-full items-center">
                  {i > 0 && (
                    <div
                      className={`h-px flex-1 transition-colors duration-500 ${
                        stepsReveal.isVisible
                          ? "bg-[#3B6D11]"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500 ${
                      stepsReveal.isVisible
                        ? "bg-[#3B6D11] text-white"
                        : "border border-gray-300 bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.step}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-px flex-1 bg-gray-200" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <div ref={calculatorReveal.ref}>
          <div
            className={`overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-500 ${
              calculatorReveal.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  Payment Estimator
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <InputField
                label="Vehicle Price (฿)"
                value={vehiclePrice}
                onChange={setVehiclePrice}
                min={0}
                step={10000}
              />
              <InputField
                label="Down Payment (฿)"
                value={downPayment}
                onChange={setDownPayment}
                min={0}
                step={10000}
              />
              <InputField
                label="Term (months)"
                value={termMonths}
                onChange={setTermMonths}
                min={12}
                max={84}
                step={12}
              />
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                  Interest Rate (APR %)
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    Rates from 2.99%
                  </span>
                </label>
                <input
                  type="number"
                  value={apr}
                  onChange={(e) => setApr(parseFloat(e.target.value) || 0)}
                  min={1.99}
                  max={29.99}
                  step={0.01}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all hover:border-gray-300 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            {/* Error */}
            {calculatorResult.error && (
              <div className="mx-6 mb-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-500">
                {calculatorResult.error}
              </div>
            )}

            {/* Result */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Estimated Monthly Payment
                  </p>
                  <p className="font-serif text-5xl font-bold text-[#27500A] transition-all duration-300">
                    {isValid
                      ? formatCurrency(
                          Math.round(calculatorResult.monthly!),
                        )
                      : "฿--"}
                    <span className="font-sans text-lg font-normal text-gray-500">
                      {isValid ? "/mo" : ""}
                    </span>
                  </p>

                  {/* Breakdown */}
                  {isValid && (
                    <div className="mt-3 space-y-1 transition-all duration-300">
                      <p className="text-sm text-gray-500">
                        Principal:{" "}
                        {formatCurrency(calculatorResult.principal!)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total interest:{" "}
                        {formatCurrency(calculatorResult.totalInterest!)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total cost:{" "}
                        {formatCurrency(calculatorResult.totalCost!)}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  href="/contact"
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                    isValid
                      ? "bg-primary text-white hover:bg-primary-700 hover:shadow-md"
                      : "pointer-events-none bg-gray-300 text-gray-500"
                  }`}
                  aria-disabled={!isValid}
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Trust banner */}
              <div className="mt-4 flex items-center justify-center gap-4 border-t border-gray-200 pt-4 text-xs text-gray-400">
                <span>No credit score impact</span>
                <span className="text-gray-300">·</span>
                <span>2-min application</span>
                <span className="text-gray-300">·</span>
                <span>Instant decision</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div ref={featuresReveal.ref}>
          <h2 className="mb-8 text-center font-serif text-2xl font-bold text-gray-900">
            Why Finance With GearUp
          </h2>
          <div
            className={`grid grid-cols-1 gap-6 transition-all duration-500 sm:grid-cols-2 lg:grid-cols-4 ${
              featuresReveal.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#97C459] hover:shadow-md"
                style={{
                  transitionDelay: featuresReveal.isVisible
                    ? `${i * 80}ms`
                    : "0ms",
                }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary-100">
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
      </div>
    </PageShell>
  );
}

function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all hover:border-gray-300 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}
