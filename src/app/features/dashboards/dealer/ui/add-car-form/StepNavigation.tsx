import Button from "@/components/Common/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AddNewCarSteps } from "../../../../../profile/dealer/cars/add/steps";

const StepNavigation = ({
  isSubmitForm = false,
  isSubmitting = false,
}: {
  isSubmitForm?: boolean;
  isSubmitting?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);
  const currentPath = usePathname();
  const isFinalStep = currentStep === AddNewCarSteps.length;
  const submitLabel = isFinalStep ? "Publish Listing" : "Continue →";

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
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <button
        type="button"
        onClick={onBack}
        className="rounded-lg border border-gray-300 cursor-pointer px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
      >
        {currentStep === 1 ? "Cancel" : "Back"}
      </button>
      {isSubmitForm ? (
        <Button width="half" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publishing..." : submitLabel}
        </Button>
      ) : (
        <Button width="half" onClick={onNext}>
          Continue →
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
