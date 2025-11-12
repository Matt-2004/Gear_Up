import clsx from 'clsx';
import React from 'react';

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    isLoading?: boolean;
    isLastStep?: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
    currentStep,
    totalSteps,
    onNext,
    onBack,
    isLoading = false,
    isLastStep = false,
}) => {
    return (
        <div className="flex justify-between items-center gap-4 mt-8 w-full max-w-2xl">
            <button
                type="button"
                onClick={onBack}
                disabled={currentStep === 0 || isLoading}
                className={clsx(
                    'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                    currentStep === 0 || isLoading
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                )}
            >
                <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </span>
            </button>

            <button
                type="button"
                onClick={onNext}
                disabled={isLoading}
                className={clsx(
                    'px-8 py-3 rounded-lg font-medium transition-all duration-200',
                    isLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : isLastStep
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                )}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        {isLastStep ? 'Submit' : 'Next'}
                        {!isLastStep && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </span>
                )}
            </button>
        </div>
    );
};