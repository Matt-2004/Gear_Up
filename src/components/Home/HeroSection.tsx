import { Search } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const heroImages = [
    {
      src: "/carImages/1.jpg",
      layout:
        "col-span-2 row-span-2 md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2",
    },
    {
      src: "/carImages/2.jpg",
      layout:
        "col-span-1 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-1",
    },
    {
      src: "/carImages/3.jpg",
      layout:
        "col-span-1 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-1",
    },
    {
      src: "/carImages/4.jpg",
      layout:
        "col-span-1 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-1",
    },
    {
      src: "/carImages/5.jpg",
      layout:
        "col-span-1 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-4 lg:row-span-1",
    },
    {
      src: "/carImages/6.jpg",
      layout:
        "col-span-2 row-span-1 md:col-span-3 md:row-span-1 lg:col-span-6 lg:row-span-1",
    },
    {
      src: "/carImages/7.jpg",
      layout:
        "col-span-2 row-span-1 md:col-span-3 md:row-span-1 lg:col-span-6 lg:row-span-1",
    },
  ];

  return (
    <section className="w-full px-4 py-6 md:py-10">
      <div className="mx-auto w-full lg:w-[90%] xl:w-[75%]">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="grid grid-flow-dense auto-rows-[110px] grid-cols-2 gap-2 md:auto-rows-[130px] md:grid-cols-6 md:gap-3 lg:auto-rows-[140px] lg:grid-cols-12">
            {heroImages.map((item, index) => (
              <div
                key={`${item.src}-${index}`}
                className={`relative overflow-hidden rounded-xl ${item.layout}`}
              >
                <Image
                  src={item.src}
                  alt={`Car image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index < 2}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/35 to-black/45" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
            <h1 className="text-center text-3xl font-bold text-white drop-shadow-md md:text-5xl">
              Find Your Next Car
            </h1>

            <form className="flex w-full max-w-lg items-center gap-2 rounded-xl border border-white/40 p-2 shadow-lg backdrop-blur-md md:max-w-lg lg:w-2/3 lg:max-w-none">
              <Search className="mx-4 h-5 w-5 text-white/90" />
              <input
                type="text"
                placeholder="Search by make, model, or year..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/75 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg border border-primary/50 bg-primary-600 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-primary md:text-sm"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
