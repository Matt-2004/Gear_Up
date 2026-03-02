import { CarItems } from "@/app/types/car.types";
import { Calendar, CircleCheckBig, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface CarContactSellerProps {
  car: CarItems;
}

export default function CarContactSeller({ car }: CarContactSellerProps) {
  const router = useRouter();

  return (
    <div className="sm:sticky sm:top-8 space-y-2">
      {/* Contact Seller Card */}
      <div className="rounded-xl bg-white p-4 sm:p-6 border border-gray-100">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Contact Seller
          </h3>
          <p className="text-sm text-gray-600">
            Get in touch with the seller for more information
          </p>
        </div>

        <div className="">
          <button
            onClick={() => router.push(`/car/${car.id}/appointment`)}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-500 py-4 font-bold text-white transition-all shadow-md hover:bg-primary-600 hover:cursor-pointer hover:shadow-lg hover:scale-105 active:scale-100"
          >
            <Calendar className="h-5 w-5" />
            Get a Appointment
          </button>
        </div>

        <div className="mt-6 pt-6">
          <div className="rounded-lg p-4 border bg-blue-100 border-blue-500">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-bold text-blue-600 mb-1">
                  Schedule Test Drive
                </div>
                <div className="text-xs text-blue-700">
                  Experience this car in person. Book your test drive today!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Card */}
      <div className="rounded-xl bg-white p-6  border border-gray-100 shadow-sm ">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-gray-600">Condition</span>
            <span className="font-semibold ">
              {car.carCondition}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-gray-600">Status</span>
            <span className="font-semibold ">{car.carStatus}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-gray-600">Validation</span>
            <span
              className={`font-bold ${car.carValidationStatus === "Approved"
                ? "text-green-600"
                : "text-yellow-600"
                }`}
            >
              {
                car.carValidationStatus === "Approved" ? <CircleCheckBig className="inline-block mr-1 h-5 w-5" /> : <Clock className="inline-block mr-1 h-5 w-5" />
              }
              {car.carValidationStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
