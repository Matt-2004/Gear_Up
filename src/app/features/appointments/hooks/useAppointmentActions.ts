"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseAppointmentActionsProps {
  appointmentId: string;
  mode: "user" | "dealer";
  agentId: string;
  requesterId: string;
  onReject?: (appointmentId: string, rejectionReason: string) => void;
  onCancel?: (appointmentId: string) => void;
}

export const useAppointmentActions = ({
  appointmentId,
  mode,
  agentId,
  requesterId,
  onReject,
  onCancel,
}: UseAppointmentActionsProps) => {
  const router = useRouter();

  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleReject = () => {
    if (!onReject) return;

    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    onReject(appointmentId, rejectionReason);
    setShowRejectInput(false);
    setRejectionReason("");
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(appointmentId);
    }
    setShowCancelConfirm(false);
  };

  const handleCloseCancelModal = () => {
    setShowCancelConfirm(false);
  };

  const handleChatClick = () => {
    const userId = mode === "dealer" ? requesterId : agentId;
    router.push(`/messages?userId=${userId}`);
  };

  return {
    showRejectInput,
    setShowRejectInput,
    rejectionReason,
    setRejectionReason,
    showCancelConfirm,
    handleReject,
    handleCancelClick,
    handleConfirmCancel,
    handleCloseCancelModal,
    handleChatClick,
  };
};
