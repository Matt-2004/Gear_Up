"use client";

import { AdminCarData } from "@/app/types/Admin_Car_Approval";
import { IAdminUpdateStatus } from "@/app/types/kyc.types";
import StatusUI, { Status } from "@/components/Common/StatusUI";
import { updateCarByAdmin } from "@/utils/API/AdminAPI";
import { timeFormat } from "@/utils/timeFormat";
import {
    ArrowLeft,
    Calendar,
    Car as CarIcon,
    Check,
    Clock,
    FileCheck,
    Fuel,
    Gauge,
    Info,
    MapPin,
    Package,
    Settings,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

const CarDetailPage = ({ carData }: { carData: AdminCarData }) => {
    const [text, setText] = useState("");

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
            <div className="mx-auto max-w-7xl">
                <PageHeader />
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        <CarInfoComponent carData={carData} text={text} />
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        <RejectReasonComponent text={text} setText={setText} />
                        <HistoryComponent submittedAt={carData.createdAt ?? "12345"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const PageHeader = () => {
    const router = useRouter();
    return (
        <div className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    className="flex items-center justify-center rounded-xl bg-gray-100 p-2.5 transition-all hover:bg-gray-200 hover:scale-105"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Car Detail Review
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Review and approve car listing submission
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2">
                    <CarIcon className="h-4 w-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">
                        Car Listing
                    </span>
                </div>
            </div>
        </div>
    );
};

interface CarInfoComponentProps {
    carData: AdminCarData;
    text: string;
}

const CarInfoComponent = ({ carData, text }: CarInfoComponentProps) => {
    return (
        <div className="space-y-6">
            {/* Car Images Gallery */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="p-6">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                        <Package className="h-5 w-5 text-primary-600" />
                        Car Images
                    </h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {carData.carImages && carData.carImages.length > 0 ? (
                            carData.carImages.map((image: any, i: number) => (
                                <div
                                    key={i}
                                    className="group relative aspect-video overflow-hidden rounded-xl bg-gray-100"
                                >
                                    <Image
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        src={image.url}
                                        alt={`Car image ${i + 1}`}
                                        width={400}
                                        height={300}
                                    />
                                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10" />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-xl bg-gray-50 py-12">
                                <Package className="h-12 w-12 text-gray-300" />
                                <p className="mt-2 text-sm text-gray-500">
                                    No images available
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100 p-6">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <Info className="h-5 w-5 text-primary-600" />
                        Basic Information
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <InfoCard label="Status" icon={<Clock className="h-4 w-4" />}>
                            <StatusUI status={carData.carValidationStatus as Status} />
                        </InfoCard>
                        <InfoCard label="Car Title" icon={<CarIcon className="h-4 w-4" />}>
                            <p className="font-semibold text-gray-900">
                                {carData.title || "No Data"}
                            </p>
                        </InfoCard>
                        <InfoCard label="Make" icon={<CarIcon className="h-4 w-4" />}>
                            <p className="font-semibold text-gray-900">
                                {carData.make || "No Data"}
                            </p>
                        </InfoCard>
                        <InfoCard label="Model" icon={<CarIcon className="h-4 w-4" />}>
                            <p className="font-semibold text-gray-900">
                                {carData.model || "No Data"}
                            </p>
                        </InfoCard>
                        <InfoCard label="Year" icon={<Calendar className="h-4 w-4" />}>
                            <p className="font-semibold text-gray-900">
                                {carData.year || "No Data"}
                            </p>
                        </InfoCard>
                        <InfoCard label="Price" icon={<Package className="h-4 w-4" />}>
                            <p className="text-2xl font-bold text-primary-600">
                                ${carData.price?.toLocaleString() || "No Data"}
                            </p>
                        </InfoCard>
                        <InfoCard label="Dealer ID" icon={<Info className="h-4 w-4" />}>
                            <p className="font-mono text-sm text-gray-700">
                                {carData.dealerId || "No Data"}
                            </p>
                        </InfoCard>
                        <InfoCard label="Condition" icon={<FileCheck className="h-4 w-4" />}>
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${carData.carCondition === "New"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700"
                                    }`}
                            >
                                {carData.carCondition || "No Data"}
                            </span>
                        </InfoCard>
                    </div>
                </div>
            </div>

            {/* Specifications */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100 p-6">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <Settings className="h-5 w-5 text-primary-600" />
                        Specifications
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoCard label="Fuel Type" icon={<Fuel className="h-4 w-4" />}>
                            <p className="font-semibold text-gray-900">
                                {carData.fuelType || "No Data"}
                            </p>
                        </InfoCard>
                        <InfoCard label="Mileage" icon={<Gauge className="h-4 w-4" />}>
                            <p className="font-semibold text-gray-900">
                                {carData.mileage?.toLocaleString() || "No Data"} km
                            </p>
                        </InfoCard>
                        <InfoCard
                            label="Transmission"
                            icon={<Settings className="h-4 w-4" />}
                        >
                            <p className="font-semibold text-gray-900">
                                {carData.transmissionType || "No Data"}
                            </p>
                        </InfoCard>
                        <InfoCard
                            label="Seating Capacity"
                            icon={<Info className="h-4 w-4" />}
                        >
                            <p className="font-semibold text-gray-900">
                                {carData.seatingCapacity || "No Data"} seats
                            </p>
                        </InfoCard>
                        <InfoCard
                            label="Engine Capacity"
                            icon={<Gauge className="h-4 w-4" />}
                        >
                            <p className="font-semibold text-gray-900">
                                {carData.engineCapacity || "No Data"} cc
                            </p>
                        </InfoCard>
                        <InfoCard label="Color" icon={<Package className="h-4 w-4" />}>
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-6 w-6 rounded-full border-2 border-gray-200 shadow-sm"
                                    style={{
                                        backgroundColor: carData.color?.toLowerCase() || "#ccc",
                                    }}
                                />
                                <p className="font-semibold text-gray-900">
                                    {carData.color || "No Data"}
                                </p>
                            </div>
                        </InfoCard>
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100 p-6">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <FileCheck className="h-5 w-5 text-primary-600" />
                        Additional Details
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <InfoCard
                        label="VIN (Vehicle Identification Number)"
                        icon={<Info className="h-4 w-4" />}
                    >
                        <p className="font-mono text-sm text-gray-700">
                            {carData.vin || "No Data"}
                        </p>
                    </InfoCard>
                    <InfoCard label="License Plate" icon={<MapPin className="h-4 w-4" />}>
                        <p className="font-semibold text-gray-900">
                            {carData.licensePlate || "No Data"}
                        </p>
                    </InfoCard>
                    <InfoCard label="Description" icon={<FileCheck className="h-4 w-4" />}>
                        <p className="text-sm leading-relaxed text-gray-700">
                            {carData.description || "No Data"}
                        </p>
                    </InfoCard>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 rounded-2xl bg-white p-6 shadow-sm">
                <RejectButton
                    id={carData.id}
                    data={{ status: "Rejected", rejectionReason: text }}
                />
                <ApprovedButton
                    id={carData.id}
                    data={{ status: "Approved", rejectionReason: "" }}
                />
            </div>
        </div>
    );
};

const InfoCard = ({
    label,
    icon,
    children,
}: {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="text-primary-600">{icon}</span>
            {label}
        </div>
        <div>{children}</div>
    </div>
);

interface IDecision {
    id: string;
    data: IAdminUpdateStatus;
}

const RejectButton = ({ id, data }: IDecision) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        if (!data.rejectionReason && data.status === "Rejected") {
            alert("Please provide a rejection reason");
            return;
        }
        setIsLoading(true);
        try {
            const response = await updateCarByAdmin(data, id);

            if (response?.isSuccess) {
                router.replace("/profile/admin?tab=car-verification");
            } else {
                alert(response?.message || "Failed to reject car listing");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error rejecting car:", error);
            alert("An error occurred while rejecting the car listing");
            setIsLoading(false);
        }
    };

    return (
        <button
            className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-red-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSubmit}
            disabled={isLoading}
        >
            <X className="h-5 w-5" />
            {isLoading ? "Rejecting..." : "Reject"}
        </button>
    );
};

const ApprovedButton = ({ id, data }: IDecision) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await updateCarByAdmin(data, id);

            if (response?.isSuccess) {
                router.replace("/profile/admin?tab=car-verification");
            } else {

                setIsLoading(false);
            }
        } catch (error: any) {
            console.error("Error approving car:", error);
            setIsLoading(false);
        }
    };

    return (
        <button
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSubmit}
            disabled={isLoading}
        >
            <Check className="h-5 w-5" />
            {isLoading ? "Approving..." : "Approve"}
        </button>
    );
};

interface ITextArea {
    text: string;
    setText: Dispatch<SetStateAction<string>>;
}

const RejectReasonComponent = ({ text, setText }: ITextArea) => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const newWords = newValue.trim().split(/\s+/).filter(Boolean);

        if (newValue.length < text.length) {
            setText(newValue);
            return;
        }

        if (newWords.length <= 150) {
            setText(newValue);
            return;
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-linear-to-r from-red-50 to-orange-50 p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <X className="h-5 w-5 text-red-600" />
                    Rejection Reason
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Provide a detailed reason for rejection
                </p>
            </div>
            <div className="p-6">
                <textarea
                    value={text}
                    onChange={handleChange}
                    className="h-48 w-full rounded-xl border-2 border-gray-200 bg-gray-50 p-4 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
                    name="reject-textarea"
                    id="reject-textarea"
                    placeholder="Explain why this car listing is being rejected..."
                />
                <div className="mt-3 flex items-center justify-between text-sm">
                    <span
                        className={`font-medium ${wordCount > 140 ? "text-red-600" : "text-gray-500"}`}
                    >
                        {wordCount} / 150 words
                    </span>
                    {wordCount > 140 && (
                        <span className="text-xs text-red-600">Approaching limit</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const HistoryComponent = ({ submittedAt }: { submittedAt: string }) => {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50 p-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Timeline
                </h2>
            </div>
            <div className="p-6">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                            <Clock className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="mt-2 h-full w-0.5 bg-linear-to-b from-primary-200 to-transparent" />
                    </div>
                    <div className="flex-1 pb-8">
                        <h3 className="font-semibold text-gray-900">Initial Submission</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            {timeFormat(submittedAt, "Hour")}
                        </p>
                        <div className="mt-3 rounded-lg bg-primary-50 p-3">
                            <p className="text-sm text-primary-900">
                                Car listing submitted for review
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetailPage;
