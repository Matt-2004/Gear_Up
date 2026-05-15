import Button from "@/app/shared/ui/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AddNewCarSteps } from "../../utils/steps";

const StepNavigation = ({
  isSubmitForm = false,
  isSubmitting = false,
  disableContinue = false,
  submitLabel,
}: {
  isSubmitForm?: boolean;
  isSubmitting?: boolean;
  disableContinue?: boolean;
  submitLabel?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("step") ?? 1);
  const currentPath = usePathname();
  const isFinalStep = currentStep === AddNewCarSteps.length;
  const defaultSubmitLabel = isFinalStep ? "Publish Listing" : "Continue →";
  const resolvedSubmitLabel = submitLabel ?? defaultSubmitLabel;

  const onBack = () => {
    if (currentStep > 1) {
      router.push(`${currentPath}?step=${currentStep - 1}`);
    } else {
      router.push("/profile/dealer/cars");
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 w-full sm:flex-row">
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.99] sm:min-w-[50%]"
      >
        {currentStep === 1 ? "Cancel" : "Back"}
      </button>
      {isSubmitForm ? (
        <Button
          width="half"
          type="submit"
          disabled={isSubmitting || disableContinue}
        >
          {isSubmitting ? "Submitting..." : resolvedSubmitLabel}
        </Button>
      ) : (
        <Button width="half" disabled={disableContinue}>
          Continue →
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
