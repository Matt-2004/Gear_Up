import Button from "@/app/shared/ui/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AddNewCarSteps } from "../../utils/steps";

const StepNavigation = ({
  isSubmitForm = false,
  isSubmitting = false,
  label,
}: {
  isSubmitForm?: boolean;
  isSubmitting?: boolean;
  label: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);
  const currentPath = usePathname();
  const isFinalStep = currentStep === AddNewCarSteps.length;
  const submitLabel = isFinalStep ? "Publish Listing" : "Continue →";

  const onBack = () => {
    if (currentStep > 1) {
      router.push(`${currentPath}?step=${currentStep - 1}`);
    } else {
      router.push("/profile/dealer/cars");
    }
  };

  return (
    <div className="flex mt-4  flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <button
        type="button"
        onClick={onBack}
        className="rounded-lg min-w-[50%] border border-gray-300 cursor-pointer px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
      >
        {currentStep === 1 ? "Cancel" : "Back"}
      </button>
      {isSubmitForm ? (
        <Button width="half" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
      ) : (
        <Button width="half">Continue →</Button>
      )}
    </div>
  );
};

export default StepNavigation;
