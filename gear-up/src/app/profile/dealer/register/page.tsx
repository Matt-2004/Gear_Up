"use client";

import { kycRegister } from "@/utils/FetchAPI";
import { useMutation } from "@tanstack/react-query";
import DocumentType from "./DocumentType";
import KycUpload from "./KycUpload";
import SelfieImageUpload from "./SelfileImageUpload";
import { useState, useCallback } from "react";
import { ProgressSteps } from "./ProgressSteps";
import { StepNavigation } from "./StepNavigation";
import { IProgressStep, IKycFormData } from "@/app/types/kyc.types";

const STEPS: IProgressStep[] = [
    { id: 1, name: "DocumentType", label: "Document Type", isComplete: false },
    { id: 2, name: "Kyc", label: "Upload Documents", isComplete: false },
    { id: 3, name: "SelfieImage", label: "Selfie Verification", isComplete: false },
    { id: 4, name: "Confirmation", label: "Review & Submit", isComplete: false },
];

const Page = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<IProgressStep[]>(STEPS);
    const [kycData, setKycData] = useState<IKycFormData>({
        DocumentType: '',
        Kyc: [], // Array of files
        SelfieImage: null,
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) => kycRegister(data),
        onSuccess: (success) => {
            console.log("KYC Registration success:", success);
            // Show success message or redirect
            // router.push('/kyc/success');
        },
        onError: (error) => {
            console.error("KYC Registration error:", error);
            // Show error message
        },
    });

    const handleNext = useCallback(() => {
        // Mark current step as complete
        const updatedSteps = [...steps];
        updatedSteps[currentStep].isComplete = true;
        setSteps(updatedSteps);


        // If last step, submit form
        if (currentStep === steps.length - 1) {
            // Build final FormData
            const finalFormData = new FormData();

            // Add document type
            finalFormData.append('DocumentType', kycData.DocumentType);

            // Add all document files as array
            kycData.Kyc.forEach((file) => {
                finalFormData.append(`Kyc`, file); // Backend will receive as array
                // OR if your backend expects indexed names:
                // finalFormData.append(`documentFiles[${index}]`, file);
            });

            // Add selfie (only append if selfie file is present)
            if (kycData.SelfieImage) {
                finalFormData.append('SelfieImage', kycData.SelfieImage);
            }
            console.log("Submitting formdata:: ", Object.fromEntries(finalFormData))

            mutation.mutate(finalFormData);
        } else {
            // Move to next step
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }

    }, [currentStep, steps, kycData, mutation]);

    const handleBack = useCallback(() => {
        // Mark next step as incomplete when going back
        if (currentStep < steps.length) {
            const updatedSteps = [...steps];
            updatedSteps[currentStep].isComplete = false;
            setSteps(updatedSteps);
        }
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, [currentStep, steps]);

    const updateDocumentType = useCallback((type: string) => {
        setKycData((prev) => ({ ...prev, DocumentType: type }));
    }, []);

    const updateDocumentFiles = useCallback((files: File[]) => {
        setKycData((prev) => ({ ...prev, Kyc: files }));
    }, []);

    const updateSelfieImage = useCallback((file: File) => {
        setKycData((prev) => ({ ...prev, SelfieImage: file }));
    }, []);

    const renderStepContent = () => {
        const currentStepData = steps[currentStep];

        switch (currentStepData.name) {
            case "DocumentType":
                return (
                    <DocumentType
                        selectedType={kycData.DocumentType}
                        onSelect={updateDocumentType}
                    />
                );

            case "Kyc":
                return (
                    <KycUpload
                        documentType={kycData.DocumentType}
                        onUploadFiles={updateDocumentFiles}
                    />
                );

            case "SelfieImage":
                return (
                    <SelfieImageUpload
                        onUpload={updateSelfieImage}
                    />
                );

            case "Confirmation":
                return (
                    <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full">
                        <h3 className="text-2xl font-bold mb-6 text-white">Review Your Information</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                <span className="text-gray-400">Document Type:</span>
                                <span className="font-medium text-white capitalize">
                                    {kycData.DocumentType.replace('_', ' ') || 'Not selected'}
                                </span>
                            </div>
                            <div className="py-3 border-b border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400">Document Files:</span>
                                    <span className="font-medium text-white">
                                        {kycData.Kyc.length > 0
                                            ? `${kycData.Kyc.length} file(s)`
                                            : '✗ Missing'}
                                    </span>
                                </div>
                                {kycData.Kyc.length > 0 && (
                                    <ul className="mt-2 space-y-1">
                                        {kycData.Kyc.map((file, index) => (
                                            <li key={index} className="text-sm text-green-400 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                <span className="text-gray-400">Selfie Photo:</span>
                                <span className="font-medium text-white">
                                    {kycData.SelfieImage ? (
                                        <span className="text-green-400">✓ {kycData.SelfieImage.name}</span>
                                    ) : (
                                        '✗ Missing'
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                            <p className="text-sm text-blue-300">
                                Please review all information carefully. Once submitted, you cannot edit your KYC application.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-3">KYC Verification</h1>
                    <p className="text-gray-400 text-lg">
                        Complete your identity verification to access all features
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <ProgressSteps steps={steps} currentStep={currentStep} />
                </div>

                {/* Step Content */}
                <div className="flex flex-col items-center">
                    <div className="w-full max-w-2xl mb-8">
                        {renderStepContent()}
                    </div>

                    {/* Navigation */}
                    <StepNavigation
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        onNext={handleNext}
                        onBack={handleBack}
                        isLoading={mutation.isPending}
                        isLastStep={currentStep === steps.length - 1}
                    />
                </div>

                {/* Help Text */}
                <div className="text-center mt-12">
                    <p className="text-gray-500 text-sm">
                        Need help? Contact our{' '}
                        <a href="/support" className="text-blue-400 hover:text-blue-300 underline">
                            support team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;