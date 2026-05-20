"use client";

import { IAdminUpdateStatus } from "@/app/features/profiles/dealer/types/kyc.types";
import StatusUI from "@/app/shared/ui/StatusUI";
import { updateKycByAdmin } from "@/app/shared/utils/API/AdminAPI";
import { timeFormat } from "@/app/shared/utils/timeFormat";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  FileCheck,
  Loader2,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type Dispatch, type SetStateAction, useState } from "react";
import { KycModel } from "../../../dealer/types/kyc.model";

const AdminKycDetail = ({ kycById }: { kycById: KycModel }) => {
  const [text, setText] = useState("");

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader kycData={kycById} />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <PersonalInfoCard kycData={kycById} />
            <DocumentsCard kycData={kycById} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ActionCard kycData={kycById} text={text} setText={setText} />
            <HistoryCard submittedAt={kycById.submittedAt} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Page Header ─────────────────────────────────────────────────── */

const PageHeader = ({ kycData }: { kycData: KycModel }) => {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          KYC Verification
        </h1>
        <p className="text-sm text-gray-500">
          Reviewing{" "}
          <span className="font-semibold text-gray-700">{kycData.name}</span>
        </p>
      </div>

      <div className="ml-auto">
        <StatusUI status={kycData.status} />
      </div>
    </div>
  );
};

/* ─── Personal Info Card ──────────────────────────────────────────── */

interface FieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const InfoField = ({ label, value, icon }: FieldProps) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

const PersonalInfoCard = ({ kycData }: { kycData: KycModel }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
        <User className="h-4 w-4 text-primary-600" />
      </div>
      Personal Information
    </h2>

    <div className="grid gap-6 sm:grid-cols-2">
      <InfoField
        label="Full Name"
        value={kycData.name}
        icon={<User className="h-4 w-4" />}
      />
      <InfoField
        label="Email"
        value={kycData.email}
        icon={<Mail className="h-4 w-4" />}
      />
      <InfoField
        label="Phone Number"
        value={kycData.phone}
        icon={<Phone className="h-4 w-4" />}
      />
      <InfoField
        label="Date of Birth"
        value={kycData.dateOfBirth}
        icon={<Calendar className="h-4 w-4" />}
      />
    </div>
  </div>
);

/* ─── Documents Card ───────────────────────────────────────────────── */

const DocumentsCard = ({ kycData }: { kycData: KycModel }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50">
        <FileCheck className="h-4 w-4 text-primary-600" />
      </div>
      Documents Review
    </h2>

    {/* KYC Documents */}
    <div className="mb-8">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        Identification Documents
      </h3>
      {kycData.documentUrls.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {kycData.documentUrls.map((url, i) =>
            url ? (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
              >
                <Image
                  src={url}
                  alt={`Document ${i + 1}`}
                  width={400}
                  height={300}
                  className="h-64 w-full object-cover"
                />
              </div>
            ) : null,
          )}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-gray-400">
          No documents uploaded
        </p>
      )}
    </div>

    {/* Selfie */}
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        Selfie Verification
      </h3>
      {kycData.selfieUrl ? (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          <Image
            src={kycData.selfieUrl}
            alt="Selfie"
            width={300}
            height={300}
            className="h-64 w-full object-contain sm:w-80"
          />
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-gray-400">
          No selfie uploaded
        </p>
      )}
    </div>
  </div>
);

/* ─── Action Card (Sidebar) ────────────────────────────────────────── */

const ActionCard = ({
  kycData,
  text,
  setText,
}: {
  kycData: KycModel;
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}) => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length < text.length) {
      setText(newValue);
      return;
    }
    const newWords = newValue.trim().split(/\s+/).filter(Boolean);
    if (newWords.length <= 150) {
      setText(newValue);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50">
          <X className="h-4 w-4 text-rose-600" />
        </div>
        Decision
      </h2>

      {/* Rejection reason */}
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Rejection Reason
        </label>
        <textarea
          value={text}
          onChange={handleChange}
          className="h-36 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
          placeholder="Explain why this KYC submission is being rejected..."
        />
        <p className="mt-1.5 text-right text-xs text-gray-400">
          {wordCount} / 150 words
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <RejectButton
          id={kycData.kycId}
          data={{ status: "Rejected", rejectionReason: text }}
        />
        <ApprovedButton
          id={kycData.kycId}
          data={{ status: "Approved", rejectionReason: "" }}
        />
      </div>
    </div>
  );
};

/* ─── Decision Buttons ─────────────────────────────────────────────── */

interface IDecision {
  id: string;
  data: IAdminUpdateStatus;
}

const RejectButton = ({ id, data }: IDecision) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!data.rejectionReason) return;
    setIsLoading(true);
    try {
      const response = await updateKycByAdmin(data, id);
      if (response?.isSuccess) {
        router.replace("/profile/admin?tab=kyc-verification");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={isLoading || !data.rejectionReason}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <X className="h-4 w-4" />
      )}
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
      const response = await updateKycByAdmin(data, id);
      if (response?.isSuccess) {
        router.replace("/profile/admin?tab=kyc-verification");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error approving KYC:", error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Check className="h-4 w-4" />
      )}
      {isLoading ? "Approving..." : "Approve"}
    </button>
  );
};

/* ─── History Card ─────────────────────────────────────────────────── */

const HistoryCard = ({ submittedAt }: { submittedAt: string }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
      </div>
      Timeline
    </h2>

    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50">
          <Clock className="h-4 w-4 text-primary-600" />
        </div>
        <div className="mt-2 h-full w-0.5 bg-gradient-to-b from-primary-100 to-transparent" />
      </div>
      <div className="pb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Initial Submission
        </h3>
        <p className="mt-0.5 text-sm text-gray-500">
          {timeFormat(new Date(submittedAt), "Hour")}
        </p>
        <div className="mt-3 rounded-lg bg-primary-50/50 px-3 py-2">
          <p className="text-xs text-primary-800">
            KYC documents submitted for verification
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminKycDetail;
