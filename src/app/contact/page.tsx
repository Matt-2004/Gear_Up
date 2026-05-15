import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { Mail, Phone, MapPin, MessageCircle, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — GearUp",
  description: "Get in touch with the GearUp team. We're here to help.",
};

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "support@gearup.com", href: "mailto:support@gearup.com" },
  { icon: Phone, label: "Phone", value: "+66 2 123 4567", href: "tel:+6621234567" },
  { icon: MapPin, label: "Office", value: "Bangkok, Thailand" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 9:00–18:00 ICT" },
];

export default function ContactPage() {
  return (
    <PageShell
      badge="Get In Touch"
      title="Contact Us"
      description="Have a question, feedback, or need help? We'd love to hear from you."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <form className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject</label>
              <input type="text" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="How can we help?" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
              <textarea rows={5} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10" placeholder="Tell us more..." />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-md"
            >
              Send Message <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
                {href ? (
                  <a href={href} className="mt-0.5 block text-sm font-medium text-gray-900 hover:text-primary">{value}</a>
                ) : (
                  <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-primary-50 p-6">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Quick Help</h3>
            </div>
            <p className="text-sm text-gray-600">Check our help center for instant answers to common questions.</p>
            <a href="/help" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Visit Help Center <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
