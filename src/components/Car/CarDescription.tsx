interface CarDescriptionProps {
  description: string;
}

export default function CarDescription({ description }: CarDescriptionProps) {
  return (
    <p className="leading-relaxed text-[16px] text-gray-700">{description}</p>
  );
}
