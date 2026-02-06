import { CarItems } from "@/app/types/car.types";
import { Calendar, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

interface CarContactSellerProps {
  car: CarItems;
}

export default function CarContactSeller({ car }: CarContactSellerProps) {
  const router = useRouter();

  return (
    <div className="sticky top-8 space-y-4">
      {/* Contact Seller Card */}
      <div className="rounded-xl bg-white p-6 shadow-lg border-2 border-primary-200">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Contact Seller
          </h3>
          <p className="text-sm text-gray-600">
            Get in touch with the seller for more information
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/car/${car.id}/appointment`)}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-600 py-4 font-bold text-white transition-all shadow-md hover:bg-primary-700 hover:shadow-lg hover:scale-105 active:scale-100"
          >
            <Calendar className="h-5 w-5" />
            Get a Appointment
          </button>
          <button
            onClick={() => router.push(`/messages?userId=${car.dealerId}`)}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white border border-primary-500 py-4 font-bold text-primary-700 transition-all shadow-sm shadow-gray-300 hover:bg-primary-50 hover:shadow-md hover:scale-105 active:scale-100"
          >
            <Mail className="h-5 w-5" />
            Send Message
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-primary-100">
          <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-4 border border-primary-200">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-primary-900 mb-1">
                  Schedule Test Drive
                </div>
                <div className="text-xs text-primary-700">
                  Experience this car in person. Book your test drive today!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Card */}
      <div className="rounded-xl bg-white p-6 shadow-lg border border-primary-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-gray-600">Condition</span>
            <span className="font-bold text-primary-700">
              {car.carCondition}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-gray-600">Status</span>
            <span className="font-bold text-primary-700">{car.carStatus}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="text-gray-600">Validation</span>
            <span
              className={`font-bold ${car.carValidationStatus === "Approved"
                ? "text-green-600"
                : "text-yellow-600"
                }`}
            >
              {car.carValidationStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
