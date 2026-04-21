import { MapPin, User } from "lucide-react";

export interface AppointmentDetailsGridProps {
  location: string;
  contactPersonLabel: string;
  contactPersonName: string;
}

export const AppointmentDetailsGrid = ({
  location,
  contactPersonLabel,
  contactPersonName,
}: AppointmentDetailsGridProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-500 transition-colors group-hover:border-primary-100 group-hover:bg-primary-50 group-hover:text-primary-600">
          <MapPin className="h-4 w-4" />
        </div>
        <div className="pt-0.5">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Location
          </p>
          <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">
            {location}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-500 transition-colors group-hover:border-primary-100 group-hover:bg-primary-50 group-hover:text-primary-600">
          <User className="h-4 w-4" />
        </div>
        <div className="pt-0.5">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            {contactPersonLabel}
          </p>
          <p className="line-clamp-1 text-sm font-medium leading-snug text-gray-900">
            {contactPersonName}
          </p>
        </div>
      </div>
    </div>
  );
};
