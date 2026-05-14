import { SkeletonHero, SkeletonCard } from "@/app/shared/ui/Skeleton";

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <SkeletonHero />
      <section className="flex w-full justify-center bg-[#F2F3FF] py-8">
        <div className="grid w-full grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-6 lg:w-[90%] xl:w-[75%]">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    </main>
  );
}
