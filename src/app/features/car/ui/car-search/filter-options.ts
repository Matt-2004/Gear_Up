export const PRICE_RANGES = [
  { min: "", max: "", label: "Any Price" },
  { min: "", max: "500000", label: "Under ฿500K" },
  { min: "500000", max: "1000000", label: "฿500K – ฿1M" },
  { min: "1000000", max: "2000000", label: "฿1M – ฿2M" },
  { min: "2000000", max: "5000000", label: "฿2M – ฿5M" },
  { min: "5000000", max: "", label: "Above ฿5M" },
];

export const COLOR_OPTIONS = [
  { value: "", label: "Any Color" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "silver", label: "Silver" },
  { value: "gray", label: "Gray" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "brown", label: "Brown" },
  { value: "beige", label: "Beige" },
];

export const SORT_BY_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price", label: "Price" },
  { value: "year", label: "Year" },
  { value: "mileage", label: "Mileage" },
  { value: "createdAt", label: "Newest Listings" },
];

export const SORT_ORDER_OPTIONS = [
  { value: "", label: "Default Order" },
  { value: "asc", label: "Low to High" },
  { value: "desc", label: "High to Low" },
];
