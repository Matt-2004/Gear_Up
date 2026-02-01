import { Calendar, Clock, FileText, MapPin } from "lucide-react";
import { FormEvent } from "react";

interface AppointmentFormData {
  schedule: string;
  time: string;
  location: string;
  notes: string;
}

interface AppointmentFormProps {
  formData: AppointmentFormData;
  isSubmitting: boolean;
  error: string;
  onSubmit: (e: FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export default function AppointmentForm({
  formData,
  isSubmitting,
  error,
  onSubmit,
  onChange,
}: AppointmentFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Schedule an Appointment
        </h1>
        <p className="text-gray-600">
          Fill out the form below to schedule a visit to see this car. The
          dealer will confirm your appointment shortly.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="h-4 w-4 text-primary-600" />
            Preferred Date
          </label>
          <input
            type="date"
            name="schedule"
            value={formData.schedule}
            onChange={onChange}
            min={new Date().toISOString().split("T")[0]}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900"
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="h-4 w-4 text-primary-600" />
            Preferred Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900"
          />
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="h-4 w-4 text-primary-600" />
            Preferred Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="Enter your preferred meeting location"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
          />
          <p className="mt-2 text-xs text-gray-500">
            You can specify the dealership location or request a different
            meeting point
          </p>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText className="h-4 w-4 text-primary-600" />
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            placeholder="Any special requests or questions about the car?"
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="h-5 w-5" />
                Schedule Appointment
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Note:</span> By scheduling an
            appointment, you agree to be contacted by the dealer. Your
            appointment is not confirmed until the dealer accepts it.
          </p>
        </div>
      </form>
    </div>
  );
}
