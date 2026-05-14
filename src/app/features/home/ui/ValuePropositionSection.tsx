import { ShieldCheck, BarChart3, BadgeCheck, CalendarDays } from "lucide-react";

export default function ValuePropositionSection() {
  const items = [
    {
      title: "Trust",
      icon: ShieldCheck,
      description:
        "Buy and sell with confidence through a transparent, user-first marketplace.",
    },
    {
      title: "Secure & verified listings",
      icon: BadgeCheck,
      description:
        "Every listing goes through checks to reduce fraud and improve listing quality.",
    },
    {
      title: "Instance booking system",
      icon: CalendarDays,
      description:
        "Book test drives and next steps quickly with a fast, streamlined booking flow.",
    },
  ];

  return (
    <section className="flex w-full justify-center py-12">
      <div className="w-full px-4 lg:w-[90%] xl:w-[75%]">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <h2 className="inline-flex items-center text-xl font-semibold text-gray-900 md:text-2xl">
            Why choose GearUp
          </h2>
          <p className="text-sm text-gray-700">
            Built to help buyers and sellers move faster with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-xl bg-white p-6 shadow-lg"
              >
                <h3 className="inline-flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
