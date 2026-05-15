import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { Cookie, Shield, BarChart3, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy — GearUp",
  description: "How GearUp uses cookies and similar tracking technologies.",
};

const COOKIE_TYPES = [
  { icon: Shield, title: "Essential", description: "Required for the platform to function — authentication, security, and session management. These cannot be disabled." },
  { icon: BarChart3, title: "Analytics", description: "Help us understand how you use GearUp — pages visited, time on site, and feature usage. All data is anonymized and aggregated." },
  { icon: Settings, title: "Preferences", description: "Remember your choices — language, region, search filters, and display preferences for a personalized experience." },
];

export default function CookiesPage() {
  return (
    <PageShell
      badge="Legal"
      title="Cookie Policy"
      description="Last updated: May 2026. Understand how we use cookies to improve your experience."
    >
      <div className="max-w-3xl space-y-10">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Cookie className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">What Are Cookies</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Cookies are small text files placed on your device when you visit GearUp. They help us provide core functionality,
            remember your preferences, and understand how our platform is used so we can make it better.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {COOKIE_TYPES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
              <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-gray-900">Managing Cookies</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            You can control and delete cookies through your browser settings. Note that disabling essential cookies may affect
            platform functionality. For questions about our cookie practices, contact us at privacy@gearup.com.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
