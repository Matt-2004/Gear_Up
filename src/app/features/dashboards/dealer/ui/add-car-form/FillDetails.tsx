import { RadioInput } from "@/components/Common/Input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CarItems } from "@/types/car.types";
import {
  ChevronDown,
  Cpu,
  CreditCard,
  FileText,
  Palette,
  Zap,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import carSuggestionsData from "../../../../../../../public/carSuggestions.json";
import { useVehicleContext } from "../../../../../profile/dealer/cars/add/AddNewCarContext";
import {
  FillDetailField,
  FillDetailInput,
  FillDetailLabel,
  FillDetailTextarea,
  RadioGroupField,
  SuggestionDropdown,
} from "./FillDetailFormComponents";
import { GroupInputForm } from "./FillDetailSection";
import StepNavigation from "./StepNavigation";

interface CarSuggestion {
  make: string;
  model: string[];
}

export interface FillDetailsFormState {
  carSuggestions: CarSuggestion[];
  makeInput: string;
  modelInput: string;
  showMakeSuggestions: boolean;
  showModelSuggestions: boolean;
  priceInput: string;
  mileageInput: string;
  yearInput: string;
  showYearDropdown: boolean;
  titleLength: number;
  descriptionLength: number;
}

export const handleEnterFocus = (
  e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  nextRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  options?: {
    requireValue?: boolean;
    onEnter?: () => void;
    allowShiftEnter?: boolean;
  },
) => {
  if (e.key !== "Enter") return;
  if (options?.allowShiftEnter && e.shiftKey) return;

  e.preventDefault();

  if (options?.requireValue && !e.currentTarget.value.trim()) {
    return;
  }

  options?.onEnter?.();
  nextRef.current?.focus();
};

const FillDetails = () => {
  const { updateAddedCar, addedCar, isDraftReady } = useVehicleContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);

  const [formState, setFormState] = useState<FillDetailsFormState>({
    carSuggestions: carSuggestionsData as CarSuggestion[],
    makeInput: addedCar?.make || "",
    modelInput: addedCar?.model || "",
    showMakeSuggestions: false,
    showModelSuggestions: false,
    priceInput: addedCar?.price ? addedCar.price.toLocaleString() : "",
    mileageInput: addedCar?.mileage ? addedCar.mileage.toLocaleString() : "",
    yearInput: addedCar?.year ? addedCar.year.toString() : "",
    showYearDropdown: false,
    titleLength: addedCar?.title?.length || 0,
    descriptionLength: addedCar?.description?.length || 0,
  });
  const {
    carSuggestions,
    makeInput,
    modelInput,
    showMakeSuggestions,
    showModelSuggestions,
    priceInput,
    mileageInput,
    yearInput,
    showYearDropdown,
    titleLength,
    descriptionLength,
  } = formState;
  const makeInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const mileageInputRef = useRef<HTMLInputElement>(null);
  const visiblePriceInputRef = useRef<HTMLInputElement>(null);
  const visibleMileageInputRef = useRef<HTMLInputElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const MAX_TITLE_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 500;

  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const engineCapacityInputRef = useRef<HTMLInputElement>(null);
  const vinInputRef = useRef<HTMLInputElement>(null);
  const licensePlateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      makeInput: addedCar?.make ? addedCar.make : prev.makeInput,
      modelInput: addedCar?.model ? addedCar.model : prev.modelInput,
      priceInput: addedCar?.price
        ? addedCar.price.toLocaleString()
        : prev.priceInput,
      mileageInput: addedCar?.mileage
        ? addedCar.mileage.toLocaleString()
        : prev.mileageInput,
      yearInput: addedCar?.year ? addedCar.year.toString() : prev.yearInput,
    }));
  }, [
    addedCar?.make,
    addedCar?.model,
    addedCar?.price,
    addedCar?.mileage,
    addedCar?.year,
  ]);

  const getFilteredMakes = () => {
    if (!makeInput.trim()) return carSuggestions.map((s) => s.make);
    return carSuggestions
      .map((s) => s.make)
      .filter((make) => make.toLowerCase().includes(makeInput.toLowerCase()))
      .slice(0, 8);
  };

  const getFilteredModels = () => {
    if (!makeInput.trim()) return [];
    const selectedMake = carSuggestions.find(
      (s) => s.make.toLowerCase() === makeInput.toLowerCase(),
    );
    if (!selectedMake) return [];
    if (!modelInput.trim()) return selectedMake.model.slice(0, 8);
    return selectedMake.model
      .filter((model) => model.toLowerCase().includes(modelInput.toLowerCase()))
      .slice(0, 8);
  };

  const handleMakeSelect = (make: string) => {
    setFormState((prev) => ({
      ...prev,
      makeInput: make,
      showMakeSuggestions: false,
      modelInput: "",
    }));
    if (makeInputRef.current) {
      makeInputRef.current.value = make;
    }
  };

  const handleModelSelect = (model: string) => {
    setFormState((prev) => ({
      ...prev,
      modelInput: model,
      showModelSuggestions: false,
    }));
    if (modelInputRef.current) {
      modelInputRef.current.value = model;
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "" || /^\d+$/.test(value)) {
      const numericValue = value === "" ? "" : parseInt(value, 10);
      setFormState((prev) => ({
        ...prev,
        priceInput: numericValue === "" ? "" : numericValue.toLocaleString(),
      }));
      if (priceInputRef.current) {
        priceInputRef.current.value = value;
      }
    }
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "" || /^\d+$/.test(value)) {
      const numericValue = value === "" ? "" : parseInt(value, 10);
      setFormState((prev) => ({
        ...prev,
        mileageInput: numericValue === "" ? "" : numericValue.toLocaleString(),
      }));
      if (mileageInputRef.current) {
        mileageInputRef.current.value = value;
      }
    }
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateAddedCar({
      title: formData.get("Title") as string,
      description: formData.get("Description") as string,
      model: formData.get("Model") as string,
      make: formData.get("Make") as string,
      year: parseInt(formData.get("Year") as string),
      price: Number(formData.get("PriceValue")),
      color: formData.get("Color") as string,
      mileage: Number(formData.get("MileageValue")) as number,
      seatingCapacity: Number(formData.get("SeatingCapacity")) as 2 | 4 | 6 | 8,
      engineCapacity: Number(formData.get("EngineCapacity")) as number,
      fuelType: formData.get("FuelType") as CarItems["fuelType"],
      carCondition: formData.get("CarCondition") as CarItems["carCondition"],
      transmissionType: formData.get(
        "TransmissionType",
      ) as CarItems["transmissionType"],
      vin: formData.get("VIN") as string,
      licensePlate: formData.get("LicensePlate") as string,
    });

    router.push(`${pathname}?step=${currentStep + 1}`);
  };

  if (!isDraftReady) {
    return (
      <div className="p-6 text-sm text-gray-500 sm:p-8 lg:p-10">
        Loading your saved draft...
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <main className="space-y-8 p-6 sm:p-8 lg:p-10">
        <GroupInputForm
          title={"Basic Information"}
          description="Provide a compelling title and description"
        >
          <FillDetailField>
            <FillDetailLabel
              label="Title"
              required
              rightContent={
                <span
                  className={`text-xs ${titleLength > MAX_TITLE_LENGTH ? "text-red-500" : "text-gray-400"}`}
                >
                  {titleLength}/{MAX_TITLE_LENGTH}
                </span>
              }
            />
            <FillDetailInput
              inputRef={titleInputRef}
              name="Title"
              type="text"
              placeholder="e.g., 2024 Toyota Camry - Excellent Condition"
              defaultValue={addedCar?.title || ""}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  titleLength: e.target.value.length,
                }));
              }}
              onKeyDown={(e) => handleEnterFocus(e, descriptionInputRef)}
              required
            />
          </FillDetailField>
          <FillDetailField className="md:col-span-2">
            <FillDetailLabel
              label="Description"
              required
              className="mb-1"
              rightContent={
                <span
                  className={`text-xs ${descriptionLength > MAX_DESCRIPTION_LENGTH ? "text-red-500" : "text-gray-400"}`}
                >
                  {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                </span>
              }
            />
            <FillDetailTextarea
              textareaRef={descriptionInputRef}
              name="Description"
              rows={4}
              placeholder="Describe the vehicle's key features, condition, and any recent maintenance or upgrades..."
              defaultValue={addedCar?.description || ""}
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  descriptionLength: e.target.value.length,
                }));
              }}
              onKeyDown={(e) =>
                handleEnterFocus(e, makeInputRef, { allowShiftEnter: true })
              }
              required
            />
          </FillDetailField>
        </GroupInputForm>

        <GroupInputForm
          title="Vehicle Specification"
          description="Enter detailed vehicle specifications"
        >
          <FillDetailField className="relative">
            <FillDetailLabel
              label="Make"
              required
              helper={
                <span className="text-xs font-normal text-gray-400">
                  (Start typing)
                </span>
              }
            />
            <FillDetailInput
              inputRef={makeInputRef}
              name="Make"
              autoComplete="off"
              type="text"
              placeholder="e.g., Toyota, Honda, Tesla"
              value={makeInput}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  makeInput: e.target.value,
                  showMakeSuggestions: true,
                }));
              }}
              onFocus={() =>
                setFormState((prev) => ({ ...prev, showMakeSuggestions: true }))
              }
              onKeyDown={(e) =>
                handleEnterFocus(e, modelInputRef, {
                  requireValue: true,
                  onEnter: () =>
                    setFormState((prev) => ({
                      ...prev,
                      showMakeSuggestions: false,
                    })),
                })
              }
              onBlur={() =>
                setTimeout(
                  () =>
                    setFormState((prev) => ({
                      ...prev,
                      showMakeSuggestions: false,
                    })),
                  200,
                )
              }
              required
              className="focus:placeholder:text-gray-500"
            />
            {showMakeSuggestions && (
              <SuggestionDropdown
                items={getFilteredMakes()}
                onSelect={handleMakeSelect}
              />
            )}
          </FillDetailField>

          <FillDetailField className="relative">
            <FillDetailLabel
              label="Model"
              required
              helper={
                !makeInput ? (
                  <span className="text-xs font-normal text-amber-500">
                    (Select make first)
                  </span>
                ) : undefined
              }
            />
            <FillDetailInput
              inputRef={modelInputRef}
              name="Model"
              type="text"
              autoComplete="off"
              placeholder="e.g., Camry, Civic, Model 3"
              value={modelInput}
              onChange={(e) => {
                setFormState((prev) => ({
                  ...prev,
                  modelInput: e.target.value,
                  showModelSuggestions: true,
                }));
              }}
              onFocus={() =>
                setFormState((prev) => ({
                  ...prev,
                  showModelSuggestions: true,
                }))
              }
              onKeyDown={(e) =>
                handleEnterFocus(e, yearInputRef, {
                  requireValue: true,
                  onEnter: () =>
                    setFormState((prev) => ({
                      ...prev,
                      showModelSuggestions: false,
                    })),
                })
              }
              onBlur={() =>
                setTimeout(
                  () =>
                    setFormState((prev) => ({
                      ...prev,
                      showModelSuggestions: false,
                    })),
                  200,
                )
              }
              required
              disabled={!makeInput}
              className="focus:placeholder:text-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            />
            {showModelSuggestions && (
              <SuggestionDropdown
                items={getFilteredModels()}
                onSelect={handleModelSelect}
              />
            )}
          </FillDetailField>

          <FillDetailField className="relative" containerRef={yearDropdownRef}>
            <FillDetailLabel label="Year" required />
            <div className="relative">
              <FillDetailInput
                inputRef={yearInputRef}
                type="text"
                value={yearInput || ""}
                placeholder="Select year"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showYearDropdown: !prev.showYearDropdown,
                  }))
                }
                onFocus={() =>
                  setFormState((prev) => ({ ...prev, showYearDropdown: true }))
                }
                onKeyDown={(e) =>
                  handleEnterFocus(e, visiblePriceInputRef, {
                    requireValue: true,
                    onEnter: () =>
                      setFormState((prev) => ({
                        ...prev,
                        showYearDropdown: false,
                      })),
                  })
                }
                onBlur={() =>
                  setTimeout(
                    () =>
                      setFormState((prev) => ({
                        ...prev,
                        showYearDropdown: false,
                      })),
                    200,
                  )
                }
                readOnly
                required
                className="cursor-pointer pr-10"
              />
              <ChevronDown
                className={`absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
                  showYearDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
            <input type="hidden" name="Year" value={yearInput} />
            {showYearDropdown && (
              <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto max-w-full rounded-lg border border-gray-200 bg-white shadow-xl duration-200">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 p-2">
                  {Array.from(
                    { length: 2026 - 1990 + 1 },
                    (_, i) => 2026 - i,
                  ).map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setFormState((prev) => ({
                          ...prev,
                          yearInput: year.toString(),
                          showYearDropdown: false,
                        }));
                        visiblePriceInputRef.current?.focus();
                      }}
                      className={`rounded-md px-2 py-1.5 text-sm transition-all hover:bg-primary-50 active:scale-95 ${
                        yearInput === year.toString()
                          ? "bg-primary font-semibold text-white shadow-sm"
                          : "text-gray-700 hover:text-primary"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </FillDetailField>

          <FillDetailField>
            <FillDetailLabel label="Price (฿)" required />
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 font-medium text-gray-500">
                ฿
              </span>
              <FillDetailInput
                inputRef={visiblePriceInputRef}
                name="Price"
                type="text"
                placeholder="850,000"
                value={priceInput}
                onChange={handlePriceChange}
                onKeyDown={(e) => handleEnterFocus(e, colorInputRef)}
                required
                className="pl-8 focus:placeholder:text-gray-500"
              />
            </div>
            <input
              ref={priceInputRef}
              type="hidden"
              name="PriceValue"
              value={priceInput.replace(/,/g, "")}
            />
            {priceInput && (
              <span className="text-xs text-gray-500">฿ {priceInput}</span>
            )}
          </FillDetailField>

          <FillDetailField>
            <FillDetailLabel label="Color" required />
            <FillDetailInput
              inputRef={colorInputRef}
              name="Color"
              type="text"
              placeholder="e.g., Black, White, Silver"
              defaultValue={addedCar?.color || ""}
              leadingIcon={<Palette className="h-4 w-4" />}
              onKeyDown={(e) => handleEnterFocus(e, visibleMileageInputRef)}
              required
            />
          </FillDetailField>

          <FillDetailField>
            <FillDetailLabel label="Mileage (km)" required />
            <FillDetailInput
              inputRef={visibleMileageInputRef}
              name="Mileage"
              type="text"
              placeholder="45,000"
              value={mileageInput}
              onChange={handleMileageChange}
              onKeyDown={(e) => handleEnterFocus(e, engineCapacityInputRef)}
              leadingIcon={<Zap className="h-4 w-4" />}
              required
              className="focus:placeholder:text-gray-500"
            />
            <input
              ref={mileageInputRef}
              type="hidden"
              name="MileageValue"
              value={mileageInput.replace(/,/g, "")}
            />
            {mileageInput && (
              <span className="text-xs text-gray-500">
                {mileageInput} kilometers
              </span>
            )}
          </FillDetailField>

          <FillDetailField>
            <FillDetailLabel label="Engine Capacity (L)" required />
            <FillDetailInput
              inputRef={engineCapacityInputRef}
              name="EngineCapacity"
              type="number"
              step="0.1"
              placeholder="e.g., 2.0"
              min={0}
              defaultValue={addedCar?.engineCapacity || ""}
              leadingIcon={<Cpu className="h-4 w-4" />}
              onKeyDown={(e) => handleEnterFocus(e, vinInputRef)}
              required
            />
          </FillDetailField>

          <RadioGroupField label="Seating Capacity" className="md:col-span-2">
            <RadioInput
              name="SeatingCapacity"
              value={2}
              defaultChecked={addedCar?.seatingCapacity === 2}
            >
              2 Seats
            </RadioInput>
            <RadioInput
              name="SeatingCapacity"
              value={4}
              defaultChecked={addedCar?.seatingCapacity === 4}
            >
              4 Seats
            </RadioInput>
            <RadioInput
              name="SeatingCapacity"
              value={6}
              defaultChecked={addedCar?.seatingCapacity === 6}
            >
              6 Seats
            </RadioInput>
            <RadioInput
              name="SeatingCapacity"
              value={8}
              defaultChecked={addedCar?.seatingCapacity === 8}
            >
              8 Seats
            </RadioInput>
          </RadioGroupField>

          <RadioGroupField label="Fuel Type">
            <RadioInput
              name="FuelType"
              value={"Petrol"}
              defaultChecked={addedCar?.fuelType === "Petrol"}
            >
              Petrol
            </RadioInput>
            <RadioInput
              name="FuelType"
              value={"Diesel"}
              defaultChecked={addedCar?.fuelType === "Diesel"}
            >
              Diesel
            </RadioInput>
            <RadioInput
              name="FuelType"
              value={"Electric"}
              defaultChecked={addedCar?.fuelType === "Electric"}
            >
              Electric
            </RadioInput>
            <RadioInput
              name="FuelType"
              value={"Hybrid"}
              defaultChecked={addedCar?.fuelType === "Hybrid"}
            >
              Hybrid
            </RadioInput>
          </RadioGroupField>

          <RadioGroupField label="Condition">
            <RadioInput
              name="CarCondition"
              value={"New"}
              defaultChecked={addedCar?.carCondition === "New"}
            >
              Brand New
            </RadioInput>
            <RadioInput
              name="CarCondition"
              value={"Used"}
              defaultChecked={addedCar?.carCondition === "Used"}
            >
              Pre-Owned
            </RadioInput>
          </RadioGroupField>

          <RadioGroupField label="Transmission Type" className="md:col-span-2">
            <RadioInput
              name="TransmissionType"
              value={"Automatic"}
              defaultChecked={addedCar?.transmissionType === "Automatic"}
            >
              Automatic
            </RadioInput>
            <RadioInput
              name="TransmissionType"
              value={"Manual"}
              defaultChecked={addedCar?.transmissionType === "Manual"}
            >
              Manual
            </RadioInput>
            <RadioInput
              name="TransmissionType"
              value={"SemiAutomatic"}
              defaultChecked={addedCar?.transmissionType === "SemiAutomatic"}
            >
              Semi-Automatic
            </RadioInput>
          </RadioGroupField>
        </GroupInputForm>

        <GroupInputForm
          title="Identification"
          description="Vehicle identification numbers"
        >
          <FillDetailField>
            <FillDetailLabel
              label="VIN Number"
              required
              helper={
                <span className="ml-1 text-xs font-normal text-gray-400">
                  (17 characters)
                </span>
              }
            />
            <FillDetailInput
              inputRef={vinInputRef}
              name="VIN"
              type="text"
              autoComplete="off"
              placeholder="e.g., 1HGBH41JXMN109186"
              maxLength={17}
              defaultValue={addedCar?.vin || ""}
              leadingIcon={<FileText className="h-4 w-4" />}
              onKeyDown={(e) => handleEnterFocus(e, licensePlateInputRef)}
              required
              className="uppercase"
            />
          </FillDetailField>

          <FillDetailField>
            <FillDetailLabel label="License Plate" required />
            <FillDetailInput
              inputRef={licensePlateInputRef}
              name="LicensePlate"
              type="text"
              autoComplete="off"
              placeholder="e.g., ABC-1234"
              defaultValue={addedCar?.licensePlate || ""}
              leadingIcon={<CreditCard className="h-4 w-4" />}
              required
              className="uppercase"
            />
          </FillDetailField>
        </GroupInputForm>

        <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
          <StepNavigation isSubmitForm={true} />
        </div>
      </main>
    </form>
  );
};

export default FillDetails;
