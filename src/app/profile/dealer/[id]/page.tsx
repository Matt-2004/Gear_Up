import {
  getUserByUserId,
  getCarByUserId,
} from "@/app/shared/utils/API/UserAPI";
import { CarCard } from "@/app/features/car/ui/car-card/CarCard";
import { carMapper } from "@/app/features/car/types/car.mapper";
import { User, Mail, Car, Phone } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { UserMapper } from "@/app/features/profiles/user/types/user.mapper";
import { UserModel } from "@/app/features/profiles/user/types/user.model";
import { CarModel } from "@/app/features/car/types/car.model";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const userRes = await getUserByUserId(id);
    const userData = UserMapper(userRes.data);
    const user = userData;
    const name = user.realName ?? "Dealer";
    const description = user
      ? `${name} — ${user.role} on Gear Up. Browse their vehicle listings and get in touch.`
      : "View this dealer's vehicle listings on Gear Up.";
    return {
      title: `${name} — Gear Up`,
      description,
    };
  } catch {
    return { title: "Dealer Profile — Gear Up" };
  }
}

export default async function DealerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let user: UserModel | null = null;
  let cars: CarModel[] = [];

  try {
    const userRes = await getUserByUserId(id);
    const userData = UserMapper(userRes.data);
    user = userData;
  } catch {
    // user stays null
  }

  if (!user) {
    return notFound();
  }

  try {
    const carsRes = await getCarByUserId(id);
    const data = carsRes.data.items.map(carMapper);
    cars = data;
  } catch {
    // cars stays empty
  }

  const approvedCars = cars.filter(
    (c) => c.status?.toLowerCase() === "approved",
  );
  const carModels = approvedCars;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="from-primary-600 to-primary-800 bg-linear-to-br pb-16 pt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center sm:flex-row sm:gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg sm:h-28 sm:w-28">
              <Image
                src={user.profileImage || "/default_profile.jpg"}
                alt={user.displayName}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:text-left">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {user.realName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80 sm:justify-start">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {String(user.phone)}
                  </span>
                )}
                <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-white">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Cars */}
      <div className="mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Car className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {carModels.length}
              </p>
              <p className="text-xs text-gray-500">Active Listings</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <Car className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
              <p className="text-xs text-gray-500">Total Cars</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">Verified</p>
              <p className="text-xs text-gray-500">Dealer Status</p>
            </div>
          </div>
        </div>

        {/* Car Listings */}
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Listings</h2>
          {carModels.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <Car className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-lg text-gray-500">No active listings</p>
              <p className="text-sm text-gray-400">
                This dealer hasn&apos;t published any cars yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {carModels.map((car) => (
                <CarCard key={car.id} carItem={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
