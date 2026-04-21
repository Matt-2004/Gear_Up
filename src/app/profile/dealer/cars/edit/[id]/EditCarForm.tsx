"use client";

import { CarItems } from "@/types/car.types";
import Button from "@/components/Common/Button";
import { RadioInput, RadioInputContainer } from "@/components/Common/Input";
import { updateCar } from "@/utils/API/CarAPI";
import {
  ArrowLeft,
  ChevronDown,
  Cpu,
  CreditCard,
  FileText,
  Palette,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import {
  FillDetailField,
  FillDetailInput,
  FillDetailLabel,
  FillDetailTextarea,
  RadioGroupField,
  SuggestionDropdown,
} from "../../add/components/FillDetailFormComponents";
import {
  FillDetailsFormState,
  handleEnterFocus,
} from "../../add/components/FillDetails";
import {
  CarImageUploadSection,
  CarImageUploadSectionFile,
} from "../../add/components/CarImageUpload";
import { GroupInputForm } from "../../add/components/FillDetailSection";

interface CarSuggestion {
  make: string;
  model: string[];
}

interface EditCarFormProps {
  initialData: CarItems;
}

interface FileWithId extends CarImageUploadSectionFile {
  id: string;
  file: File;
  progress: string;
}

const EditCarForm = ({ initialData }: EditCarFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileWithId[]>([]);

  const MAX_TITLE_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 500;
  const makeInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const mileageInputRef = useRef<HTMLInputElement>(null);
  const visiblePriceInputRef = useRef<HTMLInputElement>(null);
  const visibleMileageInputRef = useRef<HTMLInputElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const engineCapacityInputRef = useRef<HTMLInputElement>(null);
  const vinInputRef = useRef<HTMLInputElement>(null);
  const licensePlateInputRef = useRef<HTMLInputElement>(null);

  const [changedFormState, setChangedFormState] = useState<Partial<CarItems>>(
    {},
  );

  const [formState, setFormState] = useState<FillDetailsFormState>({
    carSuggestions: [] as CarSuggestion[],
    makeInput: initialData?.make || "",
    modelInput: initialData?.model || "",
    showMakeSuggestions: false,
    showModelSuggestions: false,
    priceInput: initialData?.price ? initialData.price.toLocaleString() : "",
    mileageInput: initialData?.mileage
      ? initialData.mileage.toLocaleString()
      : "",
    yearInput: initialData?.year ? initialData.year.toString() : "",
    showYearDropdown: false,
    titleLength: initialData?.title?.length || 0,
    descriptionLength: initialData?.description?.length || 0,
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    const newFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: "Uploaded",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submittedFormData = new FormData(e.currentTarget);
      const changedData: Partial<CarItems> = {};

      const assignIfChanged = <K extends keyof CarItems>(
        key: K,
        nextValue: CarItems[K],
      ) => {
        if (nextValue !== initialData[key]) {
          changedData[key] = nextValue;
        }
      };

      assignIfChanged("title", String(submittedFormData.get("Title") || ""));
      assignIfChanged(
        "description",
        String(submittedFormData.get("Description") || ""),
      );
      assignIfChanged("make", String(submittedFormData.get("Make") || ""));
      assignIfChanged("model", String(submittedFormData.get("Model") || ""));
      assignIfChanged("year", Number(submittedFormData.get("Year") || 0));
      assignIfChanged(
        "price",
        Number(submittedFormData.get("PriceValue") || 0),
      );
      assignIfChanged("color", String(submittedFormData.get("Color") || ""));
      assignIfChanged(
        "mileage",
        Number(submittedFormData.get("MileageValue") || 0),
      );
      assignIfChanged(
        "seatingCapacity",
        Number(submittedFormData.get("SeatingCapacity") || 0),
      );
      assignIfChanged(
        "engineCapacity",
        Number(submittedFormData.get("EngineCapacity") || 0),
      );
      assignIfChanged(
        "fuelType",
        String(
          submittedFormData.get("FuelType") || "Default",
        ) as CarItems["fuelType"],
      );
      assignIfChanged(
        "carCondition",
        String(
          submittedFormData.get("CarCondition") || "Default",
        ) as CarItems["carCondition"],
      );
      assignIfChanged(
        "transmissionType",
        String(
          submittedFormData.get("TransmissionType") || "Default",
        ) as CarItems["transmissionType"],
      );
      assignIfChanged("vin", String(submittedFormData.get("VIN") || ""));
      assignIfChanged(
        "licensePlate",
        String(submittedFormData.get("LicensePlate") || ""),
      );

      setChangedFormState(changedData);

      if (Object.keys(changedData).length === 0 && files.length === 0) {
        alert("No changes detected.");
        return;
      }

      const fd = new FormData();
      if (changedData.title !== undefined)
        fd.append("Title", changedData.title);
      if (changedData.description !== undefined)
        fd.append("Description", changedData.description);
      if (changedData.make !== undefined) fd.append("Make", changedData.make);
      if (changedData.model !== undefined)
        fd.append("Model", changedData.model);
      if (changedData.year !== undefined)
        fd.append("Year", String(changedData.year));
      if (changedData.price !== undefined)
        fd.append("Price", String(changedData.price));
      if (changedData.color !== undefined)
        fd.append("Color", changedData.color);
      if (changedData.mileage !== undefined)
        fd.append("Mileage", String(changedData.mileage));
      if (changedData.seatingCapacity !== undefined)
        fd.append("SeatingCapacity", String(changedData.seatingCapacity));
      if (changedData.engineCapacity !== undefined)
        fd.append("EngineCapacity", String(changedData.engineCapacity));
      if (changedData.fuelType !== undefined)
        fd.append("FuelType", changedData.fuelType);
      if (changedData.carCondition !== undefined)
        fd.append("CarCondition", changedData.carCondition);
      if (changedData.transmissionType !== undefined)
        fd.append("TransmissionType", changedData.transmissionType);
      if (changedData.vin !== undefined) fd.append("Vin", changedData.vin);
      if (changedData.licensePlate !== undefined)
        fd.append("LicensePlate", changedData.licensePlate);

      files.forEach((fileObj) => {
        fd.append("images", fileObj.file);
      });

      await updateCar(initialData.id, fd);
      router.push("/profile/dealer?tab=car-management");
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      alert(error.message || "Failed to update vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Edit Vehicle
          </h1>
          <p className="text-gray-600">
            Update your vehicle information and images
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <main className="space-y-8 p-6 sm:p-8 lg:p-10">
              {/* Basic Information */}
              <GroupInputForm
                title="Basic Information"
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
                    defaultValue={initialData?.title || ""}
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
                    defaultValue={initialData?.description || ""}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    onChange={(e) => {
                      setFormState((prev) => ({
                        ...prev,
                        descriptionLength: e.target.value.length,
                      }));
                    }}
                    onKeyDown={(e) =>
                      handleEnterFocus(e, makeInputRef, {
                        allowShiftEnter: true,
                      })
                    }
                    required
                  />
                </FillDetailField>
              </GroupInputForm>

              {/* Vehicle Specification */}
              <GroupInputForm
                title="Vehicle Specification"
                description="Enter detailed vehicle specifications"
              >
                {/* Make Input with Suggestions */}
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
                      setFormState((prev) => ({
                        ...prev,
                        showMakeSuggestions: true,
                      }))
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

                {/* Model Input with Suggestions */}
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
                {/* Year Select with Grid */}
                <FillDetailField
                  className="relative"
                  containerRef={yearDropdownRef}
                >
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
                        setFormState((prev) => ({
                          ...prev,
                          showYearDropdown: true,
                        }))
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

                {/* Price Input with Digit Formatting */}
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
                    <span className="text-xs text-gray-500">
                      ฿ {priceInput}
                    </span>
                  )}
                </FillDetailField>

                {/* Color */}
                <FillDetailField>
                  <FillDetailLabel label="Color" required />
                  <FillDetailInput
                    inputRef={colorInputRef}
                    name="Color"
                    type="text"
                    placeholder="e.g., Black, White, Silver"
                    defaultValue={initialData?.color || ""}
                    leadingIcon={<Palette className="h-4 w-4" />}
                    onKeyDown={(e) =>
                      handleEnterFocus(e, visibleMileageInputRef)
                    }
                    required
                  />
                </FillDetailField>

                {/* Mileage Input with Digit Formatting */}
                <FillDetailField>
                  <FillDetailLabel label="Mileage (km)" required />
                  <FillDetailInput
                    inputRef={visibleMileageInputRef}
                    name="Mileage"
                    type="text"
                    placeholder="45,000"
                    value={mileageInput}
                    onChange={handleMileageChange}
                    onKeyDown={(e) =>
                      handleEnterFocus(e, engineCapacityInputRef)
                    }
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

                {/* Engine Capacity */}
                <FillDetailField>
                  <FillDetailLabel label="Engine Capacity (L)" required />
                  <FillDetailInput
                    inputRef={engineCapacityInputRef}
                    name="EngineCapacity"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.0"
                    min={0}
                    defaultValue={initialData?.engineCapacity || ""}
                    leadingIcon={<Cpu className="h-4 w-4" />}
                    onKeyDown={(e) => handleEnterFocus(e, vinInputRef)}
                    required
                  />
                </FillDetailField>

                <RadioGroupField
                  label="Seating Capacity"
                  className="md:col-span-2"
                >
                  <RadioInput
                    name="SeatingCapacity"
                    value={2}
                    defaultChecked={initialData.seatingCapacity === 2}
                  >
                    2 Seats
                  </RadioInput>
                  <RadioInput
                    name="SeatingCapacity"
                    value={4}
                    defaultChecked={initialData.seatingCapacity === 4}
                  >
                    4 Seats
                  </RadioInput>
                  <RadioInput
                    name="SeatingCapacity"
                    value={6}
                    defaultChecked={initialData.seatingCapacity === 6}
                  >
                    6 Seats
                  </RadioInput>
                  <RadioInput
                    name="SeatingCapacity"
                    value={8}
                    defaultChecked={initialData.seatingCapacity === 8}
                  >
                    8 Seats
                  </RadioInput>
                </RadioGroupField>

                <RadioGroupField label="Fuel Type">
                  <RadioInput
                    name="FuelType"
                    value={"Petrol"}
                    defaultChecked={initialData.fuelType === "Petrol"}
                  >
                    Petrol
                  </RadioInput>
                  <RadioInput
                    name="FuelType"
                    value={"Diesel"}
                    defaultChecked={initialData.fuelType === "Diesel"}
                  >
                    Diesel
                  </RadioInput>
                  <RadioInput
                    name="FuelType"
                    value={"Electric"}
                    defaultChecked={initialData.fuelType === "Electric"}
                  >
                    Electric
                  </RadioInput>
                  <RadioInput
                    name="FuelType"
                    value={"Hybrid"}
                    defaultChecked={initialData.fuelType === "Hybrid"}
                  >
                    Hybrid
                  </RadioInput>
                </RadioGroupField>

                <RadioGroupField label="Car Condition">
                  <RadioInput
                    name="CarCondition"
                    value={"New"}
                    defaultChecked={initialData.carCondition === "New"}
                  >
                    Brand New
                  </RadioInput>
                  <RadioInput
                    name="CarCondition"
                    value={"Used"}
                    defaultChecked={initialData.carCondition === "Used"}
                  >
                    Pre-Owned
                  </RadioInput>
                </RadioGroupField>

                <RadioGroupField label="Transmission Type">
                  <RadioInput
                    name="TransmissionType"
                    value={"Automatic"}
                    defaultChecked={
                      initialData.transmissionType === "Automatic"
                    }
                  >
                    Automatic
                  </RadioInput>
                  <RadioInput
                    name="TransmissionType"
                    value={"Manual"}
                    defaultChecked={initialData.transmissionType === "Manual"}
                  >
                    Manual
                  </RadioInput>
                  <RadioInput
                    name="TransmissionType"
                    value={"SemiAutomatic"}
                    defaultChecked={
                      initialData.transmissionType === "SemiAutomatic"
                    }
                  >
                    Semi-Automatic
                  </RadioInput>
                </RadioGroupField>
              </GroupInputForm>
              {/* Identification */}
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
                    defaultValue={initialData?.vin || ""}
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
                    defaultValue={initialData?.licensePlate || ""}
                    leadingIcon={<CreditCard className="h-4 w-4" />}
                    required
                    className="uppercase"
                  />
                </FillDetailField>
              </GroupInputForm>

              {/* Existing Images */}
              <div className="space-y-4">
                <div className="border-primary-500 border-l-4 pl-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Current Images
                  </h2>
                  <p className="text-sm text-gray-600">
                    These are the current images for this vehicle
                  </p>
                </div>
                {initialData.carImages && initialData.carImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {initialData.carImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="group relative overflow-hidden rounded-lg border border-gray-200"
                      >
                        <Image
                          src={image.url}
                          alt={`Car image ${index + 1}`}
                          width={200}
                          height={150}
                          className="h-40 w-full object-cover"
                        />
                        <span className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <CarImageUploadSection
                title="Add New Images"
                description="Upload additional images for this vehicle"
                files={files}
                onFileChange={handleFileChange}
                onRemoveFile={(event, id) => removeFile(event, String(id))}
              />
            </main>

            {/* Footer with buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full rounded-lg border border-gray-300 px-6 py-2 text-center font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:w-auto"
              >
                Cancel
              </button>
              <Button
                disabled={loading}
                width="full"
                className="w-full sm:w-auto sm:min-w-55"
              >
                {loading ? "Updating..." : "Update Vehicle"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCarForm;
