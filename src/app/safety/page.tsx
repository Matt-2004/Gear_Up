import type { Metadata } from "next";
import PageShell from "@/app/shared/ui/PageShell";
import { ShieldCheck, Eye, MessageCircle, CreditCard, AlertTriangle, BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Safety Tips — GearUp",
  description: "Tips for buying and selling safely on GearUp.",
};

const TIPS = [
  { icon: BadgeCheck, title: "Look for Verified Listings", description: "Verified listings have been reviewed by our team. Look for the verified badge on cars and dealer profiles before engaging.", color: "text-primary" },
  { icon: Eye, title: "Inspect Before Buying", description: "Always inspect the vehicle in person before making a payment. Bring a trusted mechanic for a professional assessment of the car's condition.", color: "text-blue-600" },
  { icon: CreditCard, title: "Use Secure Payments", description: "Never send cash or wire transfers to strangers. Use our secure payment system which protects both buyers and sellers throughout the transaction.", color: "text-purple-600" },
  { icon: MessageCircle, title: "Communicate on Platform", description: "Keep all communication within GearUp. Avoid sharing personal contact details until you've verified the other party is legitimate.", color: "text-green-600" },
  { icon: AlertTriangle, title: "Trust Your Instincts", description: "If a deal seems too good to be true, it probably is. Report suspicious listings or behavior immediately using the report button on any listing.", color: "text-amber-600" },
  { icon: ShieldCheck, title: "Verify Documentation", description: "Check the vehicle's registration, service history, and ownership documents. Ensure the VIN matches across all paperwork before proceeding.", color: "text-red-600" },
];

export default function SafetyPage() {
  return (
    <PageShell
      badge="Safety"
      title="Safety Tips"
      description="Follow these guidelines to stay safe when buying or selling on GearUp."
    >
      <div className="space-y-8 max-w-4xl">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold text-amber-900">Important</h2>
          </div>
          <p className="text-sm text-amber-800">
            These tips help you stay safe, but no advice can cover every situation.
            Always use your best judgment and contact us if something feels off.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TIPS.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-gray-900">Report a Problem</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            If you encounter a suspicious listing, fraudulent behavior, or any safety concern,
            use the report button on the listing page or contact our safety team directly at safety@gearup.com.
            We review all reports within 24 hours.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
