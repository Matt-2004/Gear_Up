"use client";

import { UserCheck } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { StepNavigation } from "./StepNavigation";
import { useKycRegisterContext } from "@/app/features/dashboards/dealer/context/KycRegisterContext";

const SelfieImageUpload = () => {
  const { updateKycData } = useKycRegisterContext();
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [useCameraMode, setUseCameraMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // onUpload(selectedFile)
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
    <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg border-2 border-gray-200 p-8">
      <h3 className="mb-3 text-2xl font-bold text-gray-900">Take a Selfie</h3>
      <p className="mb-6 text-gray-600">
        Take a clear photo of your face for identity verification
      </p>

      <div className="space-y-6">
        {!preview && !useCameraMode && (
          <div className="space-y-4">
            {/* Upload from File */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 transition-all hover:border-primary-400">
              <label className="flex cursor-pointer flex-col items-center">
                <UserCheck className="h-10 w-10 text-primary-500 my-4" />
                <span className="mb-2 text-gray-700">
                  Click to upload selfie
                </span>
                <span className="text-sm text-gray-500">
                  PNG, JPG up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Or use Camera */}
            <div className="text-center">
              <span className="text-gray-500 font-medium">or</span>
            </div>

            <button
              type="button"
              onClick={startCamera}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 text-white py-4 font-medium transition-colors hover:bg-primary-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
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
              <span className="flex-1 truncate text-sm text-gray-700">
                {file?.name || "selfie.jpg"}
              </span>
              <label className="ml-3 cursor-pointer rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-700">
                Retake
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-primary-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-primary-900">
              Selfie Requirements
            </p>
            <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-primary-800">
              <li>Face the camera directly</li>
              <li>Remove glasses and hats</li>
              <li>Ensure good lighting</li>
              <li>Keep a neutral expression</li>
            </ul>
          </div>
        </div>
      </div>
      <StepNavigation />
    </div>
  );
};

export default SelfieImageUpload;
