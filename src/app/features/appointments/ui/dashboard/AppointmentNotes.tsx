import { StickyNote } from "lucide-react";

export interface AppointmentNotesProps {
  notes?: string;
  notesLabel: string;
}

export const AppointmentNotes = ({
  notes,
  notesLabel,
}: AppointmentNotesProps) => {
  if (!notes) return null;

  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50/80 p-4">
      <div className="mb-2 flex items-center gap-2">
        <StickyNote className="h-4 w-4 text-gray-400" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
          {notesLabel}
        </p>
      </div>
      <p className="pl-6 text-sm leading-relaxed text-gray-700">{notes}</p>
    </div>
  );
};
