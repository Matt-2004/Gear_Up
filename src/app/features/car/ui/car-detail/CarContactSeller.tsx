import { Calendar, CircleCheckBig, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { CarDetailModel } from "../../types/car.model";

interface CarContactSellerProps {
  car: CarDetailModel;
}

export default function CarContactSeller({ car }: CarContactSellerProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Contact Seller CTAs */}
      <div>
        <div className="mb-5">
          <h3 className="mb-1 text-xl font-bold text-gray-900">
            Contact Seller
          </h3>
          <p className="text-sm font-medium text-gray-500">
            Get in touch with the seller for more information
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/car/${car.id}/appointment`)}
            className="bg-primary-700 hover:bg-primary-600 flex w-full items-center justify-center gap-3 rounded-xl py-4 font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:cursor-pointer hover:shadow-lg active:scale-100"
          >
            <Calendar className="h-5 w-5" />
            Get Appointment
          </button>
        </div>
      </div>

      {/* Quick Info Block */}
      <div>
        <h4 className="mb-4 text-[16px] font-semibold text-gray-900 border-b border-gray-100 pb-2">
          Quick Info
        </h4>
        <div className="space-y-4 text-[14px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Condition</span>
            <span className="font-semibold text-gray-900">{car.condition}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Status</span>
            <span className="font-semibold text-gray-900">{car.status}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">Validation</span>
            <span
              className={`font-semibold ${
                car.status === "Approved" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {car.status === "Approved" ? (
                <CircleCheckBig className="mr-1.5 inline-block h-4.5 w-4.5" />
              ) : (
                <Clock className="mr-1.5 inline-block h-4.5 w-4.5" />
              )}
              {car.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
