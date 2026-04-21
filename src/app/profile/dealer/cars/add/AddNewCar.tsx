"use client";

import { ProgressSteps } from "../../register/ProgressSteps";
import CarImageUpload from "./components/CarImageUpload";
import FillDetails from "./components/FillDetails";
import Review from "./Review";
import { AddNewCarSteps } from "./steps";

const AddNewCar = ({ step }: { step?: string }) => {
  return (
    <div
      id={"car-main-container"}
      className={
        "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-2 py-6 sm:px-6 lg:px-8"
      }
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Add New Vehicle
          </h1>
          <p className="text-gray-600">
            List your vehicle in just a few simple steps
          </p>
        </div>
        <div className="mb-10 flex justify-center">
          <ProgressSteps Steps={AddNewCarSteps} />
        </div>
        <div className={"rounded-2xl bg-white shadow-xl"}>
          {step === "1" && <FillDetails />}
          {step === "2" && <CarImageUpload />}
          {step === "3" && <Review />}
          {!step && <FillDetails />}
        </div>
      </div>
    </div>
  );
};

export default AddNewCar;
