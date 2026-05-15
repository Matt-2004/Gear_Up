import { BadgeCheck, ShieldCheck, CalendarDays, CreditCard } from "lucide-react";

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

export default function ValuePropositionSection() {
  return (
    <section className="flex w-full justify-center bg-white py-16 md:py-20">
      <div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold tracking-wide text-primary-700">
            Why Choose GearUp
          </span>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Built for Trust, Speed, and Ease
          </h2>
          <p className="mt-2 max-w-lg text-sm text-gray-500">
            Everything you need to find, book, and buy your next car — all in
            one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, icon: Icon, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-all duration-300 hover:border-primary-100 hover:bg-white hover:shadow-lg hover:shadow-gray-100"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
