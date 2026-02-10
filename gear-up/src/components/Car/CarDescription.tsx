interface CarDescriptionProps {
  description: string;
}

export default function CarDescription({ description }: CarDescriptionProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 flex items-center gap-2">
        <div className="h-1 w-10 bg-primary-500 rounded"></div>
        Description
      </h2>
      <p className="leading-relaxed text-gray-700 text-sm">{description}</p>
    </div>
  );
}
