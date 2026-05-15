import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { Search, BookOpen, CarFront, Shield, CreditCard, MessageCircle, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center — GearUp",
  description: "Get help with buying, selling, and using GearUp.",
};

const FAQS = [
  { icon: CarFront, title: "Buying a Car", questions: ["How do I book a test drive?", "What does 'Verified' mean?", "How do I make an offer?"] },
  { icon: CreditCard, title: "Payments & Financing", questions: ["What payment methods are accepted?", "How does financing work?", "Are there any hidden fees?"] },
  { icon: Shield, title: "Account & Security", questions: ["How do I reset my password?", "Is my information secure?", "How do I close my account?"] },
  { icon: BookOpen, title: "Selling a Car", questions: ["How do I list my car?", "How long do listings stay active?", "What photos should I upload?"] },
];

export default function HelpPage() {
  return (
    <PageShell
      badge="Support"
      title="Help Center"
      description="Find answers to common questions or get in touch with our support team."
    >
      <div className="space-y-10">
        {/* Search */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm max-w-xl">
          <Search className="h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Search help articles..." className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none" />
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FAQS.map(({ icon: Icon, title, questions }) => (
            <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mb-3 text-lg font-bold text-gray-900">{title}</h2>
              <ul className="space-y-2">
                {questions.map((q) => (
                  <li key={q}>
                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50">
                      {q}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="rounded-2xl bg-primary-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Still need help?</h2>
          <p className="mt-2 text-sm text-gray-600">Our support team is ready to assist you with any questions.</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-md"
          >
            Contact Support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
