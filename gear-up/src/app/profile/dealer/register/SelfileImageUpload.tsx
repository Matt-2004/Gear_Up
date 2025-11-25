"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface SelfieImageUploadProps {
  onUpload: (file: File) => void;
}

const SelfieImageUpload: React.FC<SelfieImageUploadProps> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [useCameraMode, setUseCameraMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onUpload(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
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
          onUpload(capturedFile);
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
    <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
      <h3 className="text-2xl font-bold mb-3 text-white">Take a Selfie</h3>
      <p className="text-gray-400 mb-6">
        Take a clear photo of your face for identity verification
      </p>

      <div className="space-y-6">
        {!preview && !useCameraMode && (
          <div className="space-y-4">
            {/* Upload from File */}
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 hover:border-gray-500 bg-gray-750 transition-all">
              <label className="flex flex-col items-center cursor-pointer">
                <svg
                  className="w-16 h-16 text-gray-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-400 mb-2">
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
              <span className="text-gray-500">or</span>
            </div>

            <button
              type="button"
              onClick={startCamera}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-6 h-6"
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
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none" />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
              >
                Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div>
            <div className="relative border-2 border-green-500 rounded-lg overflow-hidden bg-green-900/20 p-4">
              <Image
                src={preview}
                alt="Selfie preview"
                className="w-full h-96 object-contain rounded-lg"
                height={50}
                width={50}
              />
            </div>
            <div className="mt-4 flex items-center justify-between bg-gray-900 p-3 rounded-lg">
              <span className="text-sm text-gray-300 truncate flex-1">
                {file?.name || "selfie.jpg"}
              </span>
              <label className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer text-sm font-medium transition-colors">
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

      <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
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
            <p className="text-sm text-blue-200 font-medium">
              Selfie Requirements
            </p>
            <ul className="text-sm text-blue-300 mt-1 space-y-1 list-disc list-inside">
              <li>Face the camera directly</li>
              <li>Remove glasses and hats</li>
              <li>Ensure good lighting</li>
              <li>Keep a neutral expression</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfieImageUpload;
