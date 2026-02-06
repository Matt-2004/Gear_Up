"use client";

import { useToast } from "@/app/hooks/useToast";
import { CarItems } from "@/app/types/car.types";
import { CreatePostData } from "@/app/types/post.types";
import { CarCard } from "@/components/Car/CarCard";
import { createPost } from "@/components/Navbar";
import {
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreatePostContext } from "./CreatePostContext";

interface CreatePostFormProps {
  dealerCars: CarItems[];
}

const CreatePostForm = ({ dealerCars }: CreatePostFormProps) => {
  const router = useRouter();
  const { postData, updatePostData, resetPostData } = useCreatePostContext();
  const [currentStep, setCurrentStep] = useState(1);
  const { ToastComponent, addToastMessage } = useToast({
    toastType: null,
    message: null,
  });

  const steps = [
    { number: 1, name: "Select Car", icon: Car },
    { number: 2, name: "Post Details", icon: FileText },
    { number: 3, name: "Review", icon: Eye },
  ];

  const selectedCar = dealerCars.find((car) => car.id === postData.carId);

  const handleNext = () => {
    if (currentStep === 1 && !postData.carId) {
      alert("Please select a car");
      return;
    }
    if (
      currentStep === 2 &&
      (!postData.caption.trim() || !postData.content.trim())
    ) {
      alert("Please fill in caption and content");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async (data: CreatePostData) => {
    console.log("Publishing post:", postData);
    try {
      const response = await createPost(data);

      if (response?.isSuccess) {
        addToastMessage("success", "Post published successfully!");
        setTimeout(() => {
          router.push("/post/discover");
        }, 2500);
      }
    } catch (error) {
      addToastMessage("error", "Failed to publish post. Please try again.");
    }
  };

  return (
    <>
      <ToastComponent />
      <div className="min-h-screen  from-gray-50 via-gray-100 to-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Post
            </h1>
            <p className="text-gray-600">
              Share your vehicle with potential buyers
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-0">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <>
                    {/* Step */}
                    <div
                      key={step.number}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200 ${isCompleted
                            ? "bg-primary-500 border-primary-500"
                            : isCurrent
                              ? "bg-white border-primary-500"
                              : "bg-white border-gray-300"
                          }`}
                      >
                        {isCompleted ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <StepIcon
                            className={`h-6 w-6 ${isCurrent ? "text-primary-600" : "text-gray-400"
                              }`}
                          />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium whitespace-nowrap ${isCurrent ? "text-primary-600" : "text-gray-600"
                          }`}
                      >
                        {step.name}
                      </span>
                    </div>

                    {/* Bar between steps */}
                    {index < steps.length - 1 && (
                      <div
                        key={`bar-${step.number}`}
                        className={`h-0.5 w-40 mx-4 transition-all duration-200 ${currentStep > step.number
                            ? "bg-primary-500"
                            : "bg-gray-300"
                          }`}
                        style={{ marginTop: "-20px" }}
                      />
                    )}
                  </>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mb-6">
            <div className="p-8">
              {/* Step 1: Select Car */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Select a Vehicle
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {dealerCars.map((car) => (
                      <div
                        key={car.id}
                        onClick={() => updatePostData({ carId: car.id })}
                        className={`relative rounded-xl border-2 transition-all duration-200 cursor-pointer ${postData.carId === car.id
                            ? "border-primary-500 shadow-lg ring-2 ring-primary-200"
                            : "border-transparent hover:border-gray-300"
                          }`}
                      >
                        {postData.carId === car.id && (
                          <div className="absolute top-2 right-2 z-10 bg-primary-500 rounded-full p-1.5 shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="pointer-events-none">
                          <CarCard carItem={car} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Post Details */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Post Details
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Caption *
                      </label>
                      <input
                        type="text"
                        value={postData.caption}
                        onChange={(e) =>
                          updatePostData({ caption: e.target.value })
                        }
                        placeholder="e.g., Check out this amazing Toyota Camry!"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        maxLength={100}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {postData.caption.length}/100 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Content *
                      </label>
                      <textarea
                        value={postData.content}
                        onChange={(e) =>
                          updatePostData({ content: e.target.value })
                        }
                        placeholder="Describe your vehicle in detail. Include key features, condition, history, and why it's a great choice..."
                        rows={8}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {postData.content.length}/500 characters
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && selectedCar && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Review Your Post
                  </h2>
                  <div className="space-y-6">
                    {/* Selected Car Preview */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Selected Vehicle
                      </h3>
                      <div className="max-w-sm">
                        <CarCard carItem={selectedCar} />
                      </div>
                    </div>

                    {/* Post Content Preview */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Post Content
                      </h3>
                      <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                          {postData.caption}
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {postData.content}
                        </p>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            Ready to publish?
                          </p>
                          <p className="text-sm text-blue-800">
                            Once published, your post will be visible to all
                            users. Make sure all information is accurate.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/post/discover")}
                className="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-500 from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => handlePublish(postData)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Check className="h-5 w-5" />
                  Publish Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePostForm;
