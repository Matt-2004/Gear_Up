"use client";

import { CarItems } from "@/app/types/car.types";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import { updateCar } from "@/utils/FetchAPI";
import { ArrowLeft, ImageUp, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";

interface EditCarFormProps {
  initialData: CarItems;
}

interface FileWithId {
  id: string;
  file: File;
  progress: string;
}

const EditCarForm = ({ initialData }: EditCarFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileWithId[]>([]);

  // Initialize form data with existing car data
  const [formData, setFormData] = useState({
    title: initialData.title,
    description: initialData.description,
    make: initialData.make,
    model: initialData.model,
    year: initialData.year,
    price: initialData.price,
    color: initialData.color,
    mileage: initialData.mileage,
    engineCapacity: initialData.engineCapacity,
    seatingCapacity: initialData.seatingCapacity,
    fuelType: initialData.fuelType,
    transmissionType: initialData.transmissionType,
    carCondition: initialData.carCondition,
    vin: initialData.vin,
    licensePlate: initialData.licensePlate,
  });

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
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Append new images if any
      files.forEach((fileObj) => {
        formDataToSend.append("images", fileObj.file);
      });

      await updateCar(initialData.id, formDataToSend);

      // Success - redirect to dashboard
      router.push("/profile/dealer/cars");
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
      alert(error.message || "Failed to update vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Vehicle
          </h1>
          <p className="text-gray-600">
            Update your vehicle information and images
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <main className="p-6 sm:p-8 lg:p-10 space-y-8">
              {/* Basic Information */}
              <GroupInputForm
                title="Basic Information"
                description="Update title and description"
              >
                <Input
                  name="title"
                  type="text"
                  placeholder="e.g., 2024 Toyota Camry - Excellent Condition"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                >
                  Title
                </Input>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-500 mb-1 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe the vehicle's key features..."
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-black placeholder:text-sm placeholder:text-gray-400 focus:bg-[#BAFFAF] focus:ring-1 focus:outline-none focus:ring-primary"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </GroupInputForm>

              {/* Vehicle Specification */}
              <GroupInputForm
                title="Vehicle Specification"
                description="Update vehicle specifications"
              >
                <Input
                  name="make"
                  type="text"
                  placeholder="e.g., Toyota, Honda, Tesla"
                  required
                  value={formData.make}
                  onChange={handleInputChange}
                >
                  Make
                </Input>
                <Input
                  name="model"
                  type="text"
                  placeholder="e.g., Camry, Civic, Model 3"
                  required
                  value={formData.model}
                  onChange={handleInputChange}
                >
                  Model
                </Input>
                <Input
                  name="year"
                  type="number"
                  min={1990}
                  max={2026}
                  placeholder="Select year"
                  required
                  value={formData.year}
                  onChange={handleInputChange}
                >
                  Year
                </Input>
                <Input
                  name="price"
                  type="number"
                  placeholder="e.g., 850000"
                  min={0}
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                >
                  Price (฿)
                </Input>
                <Input
                  name="color"
                  type="text"
                  placeholder="e.g., Black, White, Silver"
                  required
                  value={formData.color}
                  onChange={handleInputChange}
                >
                  Color
                </Input>
                <Input
                  name="mileage"
                  type="number"
                  placeholder="e.g., 45000"
                  min={0}
                  required
                  value={formData.mileage}
                  onChange={handleInputChange}
                >
                  Mileage (km)
                </Input>
                <Input
                  name="engineCapacity"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.0"
                  min={0}
                  required
                  value={formData.engineCapacity}
                  onChange={handleInputChange}
                >
                  Engine Capacity (L)
                </Input>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-500 mb-2 block">
                    Seating Capacity
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[2, 4, 5, 7].map((seats) => (
                      <label
                        key={seats}
                        className={`flex-1 min-w-[100px] cursor-pointer rounded-lg border px-4 py-2 text-center transition-all ${
                          formData.seatingCapacity === seats
                            ? "border-primary-500 bg-green-200 text-primary-700 font-semibold"
                            : "border-gray-300 text-gray-400 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="seatingCapacity"
                          value={seats}
                          checked={formData.seatingCapacity === seats}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              seatingCapacity: parseInt(e.target.value),
                            }))
                          }
                          className="sr-only"
                        />
                        {seats === 7 ? "7+ Seats" : `${seats} Seats`}
                      </label>
                    ))}
                  </div>
                </div>
              </GroupInputForm>

              {/* Fuel Type */}
              <GroupInputForm
                title="Fuel Type"
                description="Select the fuel type"
              >
                <div className="col-span-2">
                  <div className="flex gap-2 flex-wrap">
                    {["Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => (
                      <label
                        key={fuel}
                        className={`flex-1 min-w-[100px] cursor-pointer rounded-lg border px-4 py-2 text-center transition-all ${
                          formData.fuelType === fuel
                            ? "border-primary-500 bg-green-200 text-primary-700 font-semibold"
                            : "border-gray-300 text-gray-400 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="fuelType"
                          value={fuel}
                          checked={formData.fuelType === fuel}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              fuelType: e.target.value,
                            }))
                          }
                          className="sr-only"
                        />
                        {fuel}
                      </label>
                    ))}
                  </div>
                </div>
              </GroupInputForm>

              {/* Transmission Type */}
              <GroupInputForm
                title="Transmission Type"
                description="Select the transmission type"
              >
                <div className="col-span-2">
                  <div className="flex gap-2 flex-wrap">
                    {["Manual", "Automatic"].map((transmission) => (
                      <label
                        key={transmission}
                        className={`flex-1 min-w-[120px] cursor-pointer rounded-lg border px-4 py-2 text-center transition-all ${
                          formData.transmissionType === transmission
                            ? "border-primary-500 bg-green-200 text-primary-700 font-semibold"
                            : "border-gray-300 text-gray-400 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="transmissionType"
                          value={transmission}
                          checked={formData.transmissionType === transmission}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              transmissionType: e.target.value,
                            }))
                          }
                          className="sr-only"
                        />
                        {transmission}
                      </label>
                    ))}
                  </div>
                </div>
              </GroupInputForm>

              {/* Car Condition */}
              <GroupInputForm
                title="Car Condition"
                description="Select the condition of the vehicle"
              >
                <div className="col-span-2">
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: "New", label: "New" },
                      { value: "Used", label: "Used" },
                      { value: "Certified", label: "Certified Pre-Owned" },
                    ].map((condition) => (
                      <label
                        key={condition.value}
                        className={`flex-1 min-w-[140px] cursor-pointer rounded-lg border px-4 py-2 text-center transition-all ${
                          formData.carCondition === condition.value
                            ? "border-primary-500 bg-green-200 text-primary-700 font-semibold"
                            : "border-gray-300 text-gray-400 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="carCondition"
                          value={condition.value}
                          checked={formData.carCondition === condition.value}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              carCondition: e.target.value,
                            }))
                          }
                          className="sr-only"
                        />
                        {condition.label}
                      </label>
                    ))}
                  </div>
                </div>
              </GroupInputForm>

              {/* Vehicle Identification */}
              <GroupInputForm
                title="Vehicle Identification"
                description="Update VIN and license plate"
              >
                <Input
                  name="vin"
                  type="text"
                  placeholder="Vehicle Identification Number"
                  required
                  value={formData.vin}
                  onChange={handleInputChange}
                >
                  VIN
                </Input>
                <Input
                  name="licensePlate"
                  type="text"
                  placeholder="License Plate Number"
                  required
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                >
                  License Plate
                </Input>
              </GroupInputForm>

              {/* Existing Images */}
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Current Images
                  </h2>
                  <p className="text-sm text-gray-600">
                    These are the current images for this vehicle
                  </p>
                </div>
                {initialData.carImages && initialData.carImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {initialData.carImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative group rounded-lg overflow-hidden border border-gray-200"
                      >
                        <Image
                          src={image.url}
                          alt={`Car image ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-40 object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Images */}
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Add New Images
                  </h2>
                  <p className="text-sm text-gray-600">
                    Upload additional images for this vehicle
                  </p>
                </div>
                {files.length === 0 ? (
                  <label
                    htmlFor="file-input"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center transition-all hover:border-primary-400 hover:bg-primary-50"
                  >
                    <input
                      type="file"
                      id="file-input"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                      <ImageUp className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        Click to upload new images
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        PNG, JPG, WEBP up to 10MB each
                      </p>
                    </div>
                  </label>
                ) : (
                  <div>
                    <div className="bg-gray-50 max-h-96 space-y-3 overflow-y-auto rounded-xl border border-gray-200 p-4">
                      {files.map((file, index) => {
                        const sizeInMb = (
                          file.file.size /
                          (1024 * 1024)
                        ).toFixed(2);
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
                              <p className="text-sm text-gray-500">
                                {sizeInMb} MB
                              </p>
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
                    <div className="mt-4 flex justify-center">
                      <label
                        htmlFor="file-input-more"
                        className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-primary-300 bg-primary-50 px-6 py-3 text-primary-700 font-semibold hover:bg-primary-100 hover:border-primary-400 transition-colors"
                      >
                        <input
                          type="file"
                          id="file-input-more"
                          accept="image/*"
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />
                        <Plus className="h-5 w-5" />
                        <span>Add More Images</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Footer with buttons */}
            <div className="flex justify-between items-center border-t border-gray-200 bg-gray-50 px-6 py-4 sm:px-8 lg:px-10">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <Button disabled={loading}>
                {loading ? "Updating..." : "Update Vehicle"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const GroupInputForm = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-primary-500 pl-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
};

export default EditCarForm;
