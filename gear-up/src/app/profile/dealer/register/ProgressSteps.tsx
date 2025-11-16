import React from 'react';
import clsx from 'clsx';
import { IProgressStep } from "@/app/types/kycRegister.types";

interface ProgressStepsProps {
    steps: IProgressStep[];
    currentStep: number;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
    return (
        <div className="w-full max-w-4xl mb-12">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* Step Circle + Label */}
                        <div className="flex flex-col items-center">
                            <div
                                className={clsx(
                                    'flex items-center justify-center h-12 w-12 rounded-full border-2 font-semibold transition-all duration-300',
                                    step.isComplete
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : currentStep === index
                                            ? 'bg-blue-500 border-blue-500 text-white ring-4 ring-blue-200'
                                            : 'bg-gray-700 border-gray-600 text-gray-400'
                                )}
                            >
                                {step.isComplete ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </div>
                            <p
                                className={clsx(
                                    'mt-3 text-sm font-medium transition-colors',
                                    step.isComplete
                                        ? 'text-green-400'
                                        : currentStep === index
                                            ? 'text-blue-400'
                                            : 'text-gray-500'
                                )}
                            >
                                {step.label}
                            </p>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-1 mx-4 mb-8 rounded-full transition-all duration-300">
                                <div
                                    className={clsx(
                                        'h-full rounded-full transition-all duration-500',
                                        steps[index + 1].isComplete
                                            ? 'bg-green-500'
                                            : currentStep > index
                                                ? 'bg-blue-500'
                                                : 'bg-gray-700'
                                    )}
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
