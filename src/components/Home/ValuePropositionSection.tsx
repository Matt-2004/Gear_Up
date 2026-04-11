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
      title: "Real-time market insight",
      icon: BarChart3,
      description:
        "Track current pricing trends and demand signals to make better decisions.",
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
        <div className="mb-6">
          <h2 className="inline-flex items-center text-xl font-bold text-gray-900 md:text-3xl">
            Why choose GearUp
          </h2>
          <p className="text-base text-gray-500">
            Built to help buyers and sellers move faster with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <h3 className="inline-flex items-center gap-2 text-base font-semibold text-gray-900">
                  <Icon className="h-4 w-4 text-primary" />
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
