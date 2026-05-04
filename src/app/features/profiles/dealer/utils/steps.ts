import { ISteps } from "@/app/features/profiles/dealer/ui/dealer-kyc-register/KycRegister";

export const AddNewCarSteps: ISteps = [
  {
    id: "1",
    type: "fill-details",
    label: "Fill Details",
    path: "?step=1",
  },
  {
    id: "2",
    type: "car-image-upload",
    label: "Images Upload",
    path: "?step=2",
  },
  {
    id: "3",
    type: "review",
    label: "Review",
    path: "?step=3",
  },
];
