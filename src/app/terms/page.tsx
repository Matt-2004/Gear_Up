import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";

export const metadata: Metadata = {
  title: "Terms of Service — GearUp",
  description: "GearUp's terms of service and conditions of use.",
};

const SECTIONS = [
  { title: "1. Acceptance of Terms", content: "By accessing or using the GearUp platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services." },
  { title: "2. Account Registration", content: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account." },
  { title: "3. Listings and Transactions", content: "Sellers are responsible for the accuracy of their listings. GearUp does not guarantee the availability, quality, or accuracy of any listing. All transactions are between buyers and sellers directly." },
  { title: "4. Prohibited Conduct", content: "Users may not post false or misleading listings, engage in fraudulent activity, harass other users, or use the platform for any illegal purpose. Violations may result in account suspension." },
  { title: "5. Fees and Payments", content: "GearUp may charge fees for certain services. All fees are clearly disclosed before you incur them. Payments between buyers and sellers are processed through our secure payment system." },
  { title: "6. Intellectual Property", content: "The GearUp name, logo, and platform design are proprietary. Users retain ownership of their content but grant GearUp a license to display it on the platform." },
  { title: "7. Limitation of Liability", content: "GearUp provides the platform 'as is' without warranties. We are not liable for disputes between users, listing inaccuracies, or transaction issues. Our liability is limited to the maximum extent permitted by law." },
  { title: "8. Changes to Terms", content: "We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of material changes." },
];

export default function TermsPage() {
  return (
    <PageShell
      badge="Legal"
      title="Terms of Service"
      description="Last updated: May 2026. Please read these terms carefully before using GearUp."
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
