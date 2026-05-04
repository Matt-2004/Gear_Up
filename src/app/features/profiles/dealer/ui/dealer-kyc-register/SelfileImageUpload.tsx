"use client";

import { Camera, TriangleAlert, UserCheck } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useKycSubmit } from "@/app/features/profiles/dealer/context/KycFormContext";
import StepNavigation from "../add-car-form/StepNavigation";
import { DefaultImageUpload } from "./KycUpload";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SelfieImageUpload = () => {
  const { updateKycData } = useKycSubmit();
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [useCameraMode, setUseCameraMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);

  const handleFileChange = (id: string, selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
    updateKycData({ SelfieImage: selectedFile });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setUseCameraMode(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please use file upload instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const capturedFile = new File([blob], "selfie.jpg", {
            type: "image/jpeg",
          });
          setFile(capturedFile);
          // onUpload(capturedFile)
          setPreview(URL.createObjectURL(capturedFile));
          stopCamera();
        }
      }, "image/jpeg");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setUseCameraMode(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`${pathname}?step=${currentStep + 1}`);
      }}
      className="w-full max-w-2xl rounded-xl bg-white shadow-sm border border-gray-200 p-8"
    >
      <h3 className="mb-3 text-2xl font-bold text-gray-900">Take a Selfie</h3>
      <p className="mb-6 text-gray-600">
        Take a clear photo of your face for identity verification
      </p>

      <div className="space-y-6">
        {!preview && !useCameraMode && (
          <div className="space-y-4">
            {/* Upload from File */}
            <DefaultImageUpload
              id="main_upload"
              label="Take a Selfile"
              description="Upload a clear selfie of yourself. Make sure your face is fully visible, well-lit, and not covered by hats, sunglasses, or filters."
              handleFileChange={handleFileChange}
            />

            {/* Or use Camera */}
            <div className="text-center">
              <span className="text-gray-500 font-medium">or</span>
            </div>

            <button
              type="button"
              onClick={startCamera}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 text-white py-4 font-medium transition-colors hover:bg-primary-700"
            >
              <Camera className="h-5 w-5" />
              Use Camera
            </button>
          </div>
        )}

        {/* Camera View */}
        {useCameraMode && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-96 w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-lg border-4 border-primary-500" />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 rounded-lg bg-primary-600 text-white py-3 font-medium transition-colors hover:bg-primary-700"
              >
                Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-lg bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 font-medium transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div>
            <div className="relative overflow-hidden rounded-lg border-2 border-primary-500 bg-primary-50 p-4">
              <Image
                src={preview}
                alt="Selfie preview"
                className="h-96 w-full rounded-lg object-contain"
                height={50}
                width={50}
              />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-100 border border-gray-200 p-3">
              <span className="flex-1 truncate text-sm text-gray-900">
                {file?.name || "selfie.jpg"}
              </span>
              <label className="ml-3 cursor-pointer rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-600">
                Retake
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) =>
                    handleFileChange(
                      "main_upload",
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null,
                    )
                  }
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <TriangleAlert className="h-4 w-4 text-amber-700" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Selfie Requirements
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-amber-700">
              <li>Face the camera directly</li>
              <li>Remove glasses and hats</li>
              <li>Ensure good lighting</li>
              <li>Keep a neutral expression</li>
            </ul>
          </div>
        </div>
      </div>
      <StepNavigation label="Submit" />
    </form>
  );
};

export default SelfieImageUpload;
