import Image from "next/image";
import { ImageUp, Plus, Trash2 } from "lucide-react";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useVehicleContext } from "../../context/AddNewCarContext";
import StepNavigation from "./StepNavigation";

export interface IFileProps {
  id: number;
  progress: string;
  url: string;
  file: File;
}

export interface CarImageUploadSectionFile {
  id: number | string;
  file: File;
  progress?: string;
}

interface CarImageUploadSectionProps {
  files: CarImageUploadSectionFile[];
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (
    event: MouseEvent<HTMLButtonElement>,
    id: number | string,
  ) => void;
  title?: string;
  description?: string;
}

export const CarImageUploadSection = ({
  files,
  onFileChange,
  onRemoveFile,
  title = "Vehicle Images",
  description = "Upload high-quality photos from multiple angles",
}: CarImageUploadSectionProps) => {
  return (
    <div>
      <div className="border-primary-500 mb-6 border-l-4 pl-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <div className="mb-6 rounded-xl border border-primary-100 bg-primary-50/50 p-4 shadow-sm">
        <h6 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
            📸
          </span>
          Photo Tips
        </h6>
        <ul className="list-inside list-disc space-y-1 text-xs text-primary">
          <li>Front, back, both sides, and interior views</li>
          <li>Dashboard and odometer reading</li>
          <li>Engine bay and unique features</li>
          <li>Use bright lighting and clean background</li>
        </ul>
      </div>
      <div className="mb-6">
        <label className="group hover:border-primary hover:bg-primary-50/40 focus-within:ring-primary/30 flex w-full cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 bg-[#E8E9E0] p-10 text-center transition-all duration-200 hover:shadow-md focus-within:ring-4">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm ring-1 ring-gray-200 transition-all group-hover:scale-105 group-hover:ring-primary/30">
            <ImageUp className="text-primary h-10 w-10" />
          </div>
          <span className="mb-1 text-base font-semibold text-primary">
            Drag & drop images or click to upload
          </span>
          <span className="text-sm text-gray-600">
            PNG / JPG • up to 10MB per image
          </span>
          <span className="mt-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
            {files.length} selected
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={onFileChange}
          />
        </label>
        <p className="pt-3 text-center text-sm text-gray-600">
          ✨{" "}
          <span className="font-semibold text-primary">
            Minimum 3 images required
          </span>{" "}
          — More photos improve buyer confidence.
        </p>
      </div>
      {files.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Uploaded Images ({files.length})
            </h3>
            <span className="text-xs text-gray-500">
              Click image to preview
            </span>
          </div>
          <div className="max-h-96 space-y-3 overflow-y-auto max-w-full rounded-xl border border-gray-200 bg-gray-50 p-4">
            {files.map((file, index) => {
              const sizeInMb = (file.file.size / (1024 * 1024)).toFixed(2);
              const preview = URL.createObjectURL(file.file);
              return (
                <div
                  key={`${file.id}-${index}`}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md"
                >
                  <div className="relative shrink-0">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                    />
                    <span className="bg-primary-500 absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-gray-900">
                      {file.file.name}
                    </h3>
                    <p className="text-sm text-gray-500">{sizeInMb} MB</p>
                    {file.progress && (
                      <div className="mt-1 flex items-center gap-2">
                        {file.progress === "Uploading..." && (
                          <span className="flex items-center gap-1 text-xs text-blue-600">
                            <span className="animate-spin">⏳</span>{" "}
                            Uploading...
                          </span>
                        )}
                        {file.progress === "Uploaded" && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            ✓ Ready
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => onRemoveFile(event, file.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500 transition-colors hover:bg-red-600"
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
      {files.length > 0 && (
        <div className="mt-6 flex w-full justify-center">
          <label
            htmlFor="file-input"
            className="border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:border-primary-400 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-6 py-3 font-semibold transition-colors"
          >
            <input
              type="file"
              id="file-input"
              accept="image/*"
              className="hidden"
              multiple
              onChange={onFileChange}
            />
            <Plus className="h-5 w-5" />
            <span>Add More Images</span>
          </label>
        </div>
      )}
    </div>
  );
};

const CarImageUpload = () => {
  const [files, setFiles] = useState<IFileProps[]>([]);
  const nextId = useRef(1);
  const { updateAddedCar, addedCar, isDraftReady } = useVehicleContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);

  useEffect(() => {
    if (addedCar?.carImages && addedCar.carImages.length > 0) {
      const existingFiles: IFileProps[] = addedCar.carImages.map((file) => ({
        id: nextId.current++,
        file: file,
        progress: "Uploaded",
        url: URL.createObjectURL(file),
      }));
      setFiles(existingFiles);
    }
  }, [addedCar?.carImages]);

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files) return;
    const uploadedfiles = Array.from(e.currentTarget.files);

    setFiles((file) => [
      ...file,
      ...uploadedfiles.map((uploadedFile) => ({
        id: nextId.current++,
        file: uploadedFile,
        progress: "Uploading...",
        url: URL.createObjectURL(uploadedFile),
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
    <form onSubmit={submit} className="p-6 sm:p-8 lg:p-10">
      <div className="space-y-6">
        <CarImageUploadSection
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={(event, id) => removeFile(event, Number(id))}
        />
      </div>
      <div className="mt-8 flex justify-end border-t border-gray-200 pt-6">
        <StepNavigation isSubmitForm={true} label="Submit" />
      </div>
    </form>
  );
};

export default CarImageUpload;
