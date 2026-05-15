import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — GearUp",
  description: "How GearUp collects, uses, and protects your personal data.",
};

const SECTIONS = [
  { title: "1. Information We Collect", content: "We collect information you provide directly — name, email, phone number, profile details, and listing content. We also collect usage data including pages visited, searches made, and interactions with listings." },
  { title: "2. How We Use Your Data", content: "Your data helps us provide and improve our services. We use it to match you with relevant listings, process transactions, communicate about your account, and ensure platform safety through verification checks." },
  { title: "3. Data Sharing", content: "We share your information with sellers when you inquire about a listing, with dealers when you book appointments, and with service providers who help us operate the platform. We never sell your personal data." },
  { title: "4. Cookies & Tracking", content: "We use cookies and similar technologies for authentication, analytics, and personalization. You can control cookie preferences through your browser settings. Essential cookies are required for the platform to function." },
  { title: "5. Data Security", content: "We implement industry-standard security measures including encryption, access controls, and regular security audits. However, no online service is 100% secure — we encourage users to practice good security habits." },
  { title: "6. Your Rights", content: "You have the right to access, correct, or delete your personal data. You can export your data or close your account at any time. Contact us at privacy@gearup.com for data-related requests." },
  { title: "7. Data Retention", content: "We retain your data as long as your account is active or as needed to provide services. After account closure, we retain minimal data for legal compliance and dispute resolution purposes." },
  { title: "8. Updates to Policy", content: "We may update this policy to reflect changes in our practices or legal requirements. Users will be notified of material changes via email or platform notification." },
];

export default function PrivacyPage() {
  return (
    <PageShell
      badge="Legal"
      title="Privacy Policy"
      description="Last updated: May 2026. We take your privacy seriously."
    >
      <div className="max-w-3xl space-y-8">
        {SECTIONS.map(({ title, content }) => (
          <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{content}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
