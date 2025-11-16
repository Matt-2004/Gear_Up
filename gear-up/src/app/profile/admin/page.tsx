"use client";

import {useState} from "react";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import AdminKycVerification from "@/components/Admin/AdminKycVerification";
import AdminDealershipVerification from "@/components/Admin/AdminDealershipVerification";
import AdminGenerateReport from "@/components/Admin/AdminGenerateReport";
import clsx from "clsx";

type Iselected = "dashboard" | "kyc-verification" | "dealership-verification" | "generate-report";

export default function Page() {

    const [selectedTab, setSelectedTab] = useState<Iselected>("dashboard");

    const handleSelectedTabChange = (selectedTab: Iselected) => {
        setSelectedTab(selectedTab);
    }

    return (
        <div className={"text-white w-full flex h-screen"}>
            <div className={"w-1/6 p-2 mx-auto border-r-gray-800 shadow-gray-700  shadow-sm"}>
                <Tabs selectedTab={selectedTab} handleSelectedTabChange={handleSelectedTabChange} />
            </div>
            <div className={"w-5/6"}>
                <PageSwitcher selectedTab={selectedTab}/>
            </div>
        </div>
    );
}

interface ITabs {
    selectedTab: Iselected;
    handleSelectedTabChange: (selectedTab: Iselected) => void;
}

const Tabs = ({selectedTab, handleSelectedTabChange}: ITabs) => {
    return (
        <ul className={" w-full flex flex-col gap-2 items-start [&>ol]:w-full [&>ol]:cursor-pointer [&>ol]:px-4 [&>ol]:py-2 [&>ol]:rounded-sm [&>ol]:hover:border-gray-600 [&>ol]:hover:bg-gray-700"}>
            <ol className={clsx(selectedTab === "dashboard" ? "bg-gray-700 border-gray-600" : "")}
                onClick={() => handleSelectedTabChange("dashboard")}>Dashboard
            </ol>
            <ol className={clsx(selectedTab === "kyc-verification" ? "bg-gray-700 border-gray-600" : "")}
                onClick={() => handleSelectedTabChange("kyc-verification")}>Kyc Verification
            </ol>
            <ol className={clsx(selectedTab === "dealership-verification" ? "bg-gray-700 border-gray-600" : "")}
                onClick={() => handleSelectedTabChange("dealership-verification")}>Dealership Verification
            </ol>
            <ol className={clsx(selectedTab === "generate-report" ? "bg-gray-700 border-gray-600" : "")}
                onClick={() => handleSelectedTabChange("generate-report")}>Generate report
            </ol>
        </ul>
    )
}

const PageSwitcher = ({selectedTab}: Partial<ITabs>) => {
    return (
        <>
            {selectedTab === "dashboard" && <AdminDashboard/>}
            {selectedTab === "kyc-verification" && <AdminKycVerification/>}
            {selectedTab === "dealership-verification" && <AdminDealershipVerification/>}
            {selectedTab === "generate-report" && <AdminGenerateReport/>}
        </>

    )
}
