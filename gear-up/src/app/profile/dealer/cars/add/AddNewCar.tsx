"use client";

import Button from "@/components/Common/Button";
import Input, {
  RadioInput,
  RadioInputContainer,
} from "@/components/Common/Input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CarItems } from "@/app/types/car.types";
import { ImageUp, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { ISteps } from "../../register/KycRegister";
import { ProgressSteps } from "../../register/ProgressSteps";
import { useVehicleContext } from "./AddNewCarContext";
import Review from "./Review";

export const AddNewCarSteps: ISteps = [
  {
    id: "1",
    type: "fill-details",
    label: "Fill Details",
    path: "?step=1",
  },
  {
    id: "2",
    type: "car-image-upload",
    label: "Images Upload",
    path: "?step=2",
  },
  {
    id: "3",
    type: "review",
    label: "Review",
    path: "?step=3",
  },
];

const AddNewCar = ({ step }: { step: string }) => {
  return (
    <div
      id={"car-main-container"}
      className={
        "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8"
      }
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Vehicle
          </h1>
          <p className="text-gray-600">
            List your vehicle in just a few simple steps
          </p>
        </div>
        <div className="mb-10 flex justify-center">
          <ProgressSteps Steps={AddNewCarSteps} />
        </div>
        <div className={"rounded-2xl bg-white shadow-xl"}>
          {step === "1" && <FillDetails />}
          {step === "2" && <CarImageUpload />}
          {step === "3" && <Review />}
        </div>
      </div>
    </div>
  );
};

const FillDetails = () => {
  const { updateAddedCar, addedCar } = useVehicleContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);

  // Format year for month input (YYYY-MM format)
  const formattedYear = addedCar?.year ? `${addedCar.year}-01` : "";

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateAddedCar({
      title: formData.get("Title") as string,
      description: formData.get("Description") as string,

      model: formData.get("Model") as string,
      make: formData.get("Make") as string,
      year: parseInt((formData.get("Year") as string).split("-")[0]),

      carStatus: "Available",
      carValidationStatus: "Available",

      price: Number(formData.get("Price")),
      color: formData.get("Color") as string,
      mileage: Number(formData.get("Mileage")) as number,

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

    // Navigate to next step after updating context
    router.push(`${pathname}?step=${currentStep + 1}`);
  };

  return (
    <form onSubmit={submit} className="w-full">
      <main className="p-6 sm:p-8 lg:p-10 space-y-8">
        <GroupInputForm
          title={"Basic Information"}
          description="Provide a compelling title and description"
        >
          <Input
            name="Title"
            type="text"
            placeholder="e.g., 2024 Toyota Camry - Excellent Condition"
            defaultValue={addedCar?.title || ""}
            required
          >
            Title
          </Input>
          <div className="col-span-2">
            <label className="text-sm font-semibold text-gray-500 mb-1 block">
              Description
            </label>
            <textarea
              name="Description"
              rows={4}
              placeholder="Describe the vehicle's key features, condition, and any recent maintenance or upgrades..."
              defaultValue={addedCar?.description || ""}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-black placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none focus:ring-primary"
              required
            />
          </div>
        </GroupInputForm>
        <GroupInputForm
          title="Vehicle Specification"
          description="Enter detailed vehicle specifications"
        >
          <Input
            name="Make"
            type="text"
            placeholder="e.g., Toyota, Honda, Tesla"
            defaultValue={addedCar?.make || ""}
            required
          >
            Make
          </Input>
          <Input
            name="Model"
            type="text"
            placeholder="e.g., Camry, Civic, Model 3"
            defaultValue={addedCar?.model || ""}
            required
          >
            Model
          </Input>
          <Input
            name="Year"
            type="month"
            min={1990}
            max={2026}
            placeholder="Select year"
            defaultValue={formattedYear}
            required
          >
            Year
          </Input>
          <Input
            name="Price"
            type="number"
            placeholder="e.g., 850000"
            min={0}
            defaultValue={addedCar?.price || ""}
            required
          >
            Price (฿)
          </Input>
          <Input
            name="Color"
            type="text"
            placeholder="e.g., Black, White, Silver"
            defaultValue={addedCar?.color || ""}
            required
          >
            Color
          </Input>
          <Input
            name="Mileage"
            type="number"
            placeholder="e.g., 45000"
            min={0}
            defaultValue={addedCar?.mileage || ""}
            required
          >
            Mileage (km)
          </Input>
          <Input
            name="EngineCapacity"
            type="number"
            step="0.1"
            placeholder="e.g., 2.0"
            min={0}
            defaultValue={addedCar?.engineCapacity || ""}
            required
          >
            Engine Capacity (L)
          </Input>
          <div className="col-span-2">
            <RadioInputContainer title="Seating Capacity">
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
            </RadioInputContainer>
          </div>

          <RadioInputContainer title="Fuel Type">
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
          </RadioInputContainer>
          <RadioInputContainer title="Condition">
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
          </RadioInputContainer>
          <div className="col-span-2">
            <RadioInputContainer title="Transmission Type">
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
            </RadioInputContainer>
          </div>
        </GroupInputForm>

        <GroupInputForm
          title="Identification"
          description="Vehicle identification numbers"
        >
          <Input
            name="VIN"
            type="text"
            placeholder="e.g., 1HGBH41JXMN109186"
            maxLength={17}
            defaultValue={addedCar?.vin || ""}
            required
          >
            VIN Number
          </Input>
          <Input
            name="LicensePlate"
            type="text"
            placeholder="e.g., ABC-1234"
            defaultValue={addedCar?.licensePlate || ""}
            required
          >
            License Plate
          </Input>
        </GroupInputForm>
        <div className="flex justify-end border-t border-gray-200 pt-6 mt-8">
          <StepNavigation isSubmitForm={true} />
        </div>
      </main>
    </form>
  );
};

const StepNavigation = ({
  isSubmitForm = false,
}: {
  isSubmitForm?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);
  const currentPath = usePathname();

  const onNext = () => {
    if (currentStep < AddNewCarSteps.length) {
      router.push(`${currentPath}?step=${currentStep + 1}`);
    }
  };

  const onBack = () => {
    if (currentStep > 1) {
      router.push(`${currentPath}?step=${currentStep - 1}`);
    } else {
      router.push("/profile/dealer/cars");
    }
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onBack}
        className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
      >
        {currentStep === 1 ? "Cancel" : "Back"}
      </button>
      {isSubmitForm ? (
        <Button width="half" type="submit">
          Continue →
        </Button>
      ) : (
        <Button width="half" onClick={onNext}>
          Continue →
        </Button>
      )}
    </div>
  );
};

const GroupInputForm = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  return (
    <div id="basic-information" className="space-y-4">
      <div className="border-l-4 border-primary-500 pl-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};

export interface IFileProps {
  id: number;
  progress: string;
  url: string;
  file: File;
}

const CarImageUpload = () => {
  const [files, setFiles] = useState<IFileProps[]>([]);
  const nextId = useRef(1);
  const { updateAddedCar, addedCar } = useVehicleContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);

  // Load existing images from context on mount
  useEffect(() => {
    if (addedCar?.carImages && addedCar.carImages.length > 0) {
      const existingFiles: IFileProps[] = addedCar.carImages.map(
        (file, index) => ({
          id: nextId.current++,
          file: file,
          progress: "Uploaded",
          url: URL.createObjectURL(file),
        }),
      );
      setFiles(existingFiles);
    }
  }, []);

  /* TODO: implement progress bar using FileReader */
  // const reader = new FileReader();
  //   reader.onprogress = (event) => {
  //     if (event.lengthComputable) {
  //       const percent = Math.round((event.loaded / event.total) * 100);
  //       setProgress(percent);
  //     }
  //   };

  useEffect(() => {
    files.forEach((mainfile) => {
      if (mainfile.progress === "Uploading...") {
        const reader = new FileReader();
        reader.onload = () => {
          setTimeout(() => {
            setFiles((file) =>
              file.map((prev) =>
                prev.id === mainfile.id
                  ? { ...prev, progress: "Uploaded" }
                  : prev,
              ),
            );
          }, 1000);
        };

        reader.readAsArrayBuffer(mainfile.file);
      }
    });
  }, [files]);

  const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    const uploadedfiles = Array.from(e.currentTarget.files);
    // When Image upload, need to convert the file into preview and display

    setFiles((file) => [
      ...file,
      ...uploadedfiles.map((file) => ({
        id: nextId.current++,
        file: file,
        progress: "Uploading...",
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const carImages: File[] = files.map((file) => file.file);

    updateAddedCar({ carImages });

    // Navigate to next step after updating context
    router.push(`${pathname}?step=${currentStep + 1}`);
  };

  return (
    <form onSubmit={submit} className="p-6 sm:p-8 lg:p-10">
      <div className="space-y-6">
        <div>
          <div className="border-l-4 border-primary-500 pl-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Vehicle Images</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload high-quality photos from multiple angles
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h6 className="text-sm font-semibold text-blue-900 mb-2">
              📸 Photo Tips:
            </h6>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Front, back, both sides, and interior views</li>
              <li>Dashboard and odometer reading</li>
              <li>Engine bay and any unique features</li>
              <li>Good lighting, clean background</li>
            </ul>
          </div>
          <div className="mb-6">
            <label className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 transition-all flex w-full cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 p-12">
              <div className="bg-primary-100 rounded-full p-4 mb-4">
                <ImageUp className="h-10 w-10 text-primary-600" />
              </div>
              <span className="mb-2 text-base font-semibold text-gray-700">
                Click to upload images
              </span>
              <span className="text-sm text-gray-500">
                PNG or JPG up to 10MB each
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <p className="pt-3 text-sm text-gray-500 text-center">
              ✨ <span className="font-medium">Minimum 3 images required</span>{" "}
              - More photos increase buyer interest!
            </p>
          </div>
          {files.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Uploaded Images ({files.length})
                </h3>
                <span className="text-xs text-gray-500">
                  Click image to preview
                </span>
              </div>
              <div className="bg-gray-50 max-h-96 space-y-3 overflow-y-auto rounded-xl border border-gray-200 p-4">
                {files.map((file, index) => {
                  const sizeInMb = (file.file.size / (1024 * 1024)).toFixed(2);
                  const preview = URL.createObjectURL(file.file);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="relative shrink-0">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                        />
                        <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {file.file.name}
                        </h3>
                        <p className="text-sm text-gray-500">{sizeInMb} MB</p>
                        <div className="flex items-center gap-2 mt-1">
                          {file.progress === "Uploading..." && (
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                              <span className="animate-spin">⏳</span>{" "}
                              Uploading...
                            </span>
                          )}
                          {file.progress === "Uploaded" && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              ✓ Ready
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeFile(e, file.id)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-6 flex w-full justify-center">
          <label
            htmlFor="file-input"
            className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-primary-300 bg-primary-50 px-6 py-3 text-primary-700 font-semibold hover:bg-primary-100 hover:border-primary-400 transition-colors"
          >
            <input
              type="file"
              id="file-input"
              accept="image/*"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
            <Plus className="h-5 w-5" />
            <span>Add More Images</span>
          </label>
        </div>
      )}
      <div className="flex justify-end border-t border-gray-200 pt-6 mt-8">
        <StepNavigation isSubmitForm={true} />
      </div>
    </form>
  );
};

export default AddNewCar;
