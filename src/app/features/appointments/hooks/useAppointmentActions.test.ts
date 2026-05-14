import { renderHook, act } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAppointmentActions } from "./useAppointmentActions";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;

const mockPush = jest.fn();

function setup(mode: "user" | "dealer" = "dealer") {
  mockedUseRouter.mockReturnValue({ push: mockPush });
  const onReject = jest.fn();
  const onCancel = jest.fn();
  const { result } = renderHook(() =>
    useAppointmentActions({
      appointmentId: "apt-1",
      mode,
      agentId: "agent-1",
      requesterId: "requester-1",
      onReject,
      onCancel,
    }),
  );
  return { result, onReject, onCancel };
}

describe("useAppointmentActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts with reject input and cancel confirm hidden", () => {
    const { result } = setup();
    expect(result.current.showRejectInput).toBe(false);
    expect(result.current.showCancelConfirm).toBe(false);
    expect(result.current.rejectionReason).toBe("");
  });

  it("shows reject input on first handleReject call", () => {
    const { result } = setup();
    act(() => {
      result.current.handleReject();
    });
    expect(result.current.showRejectInput).toBe(true);
  });

  it("calls onReject on second handleReject call with reason filled", () => {
    const { result, onReject } = setup();
    act(() => {
      result.current.handleReject(); // first call → show input
    });
    // Set reason first, then trigger submit in separate acts so state propagates
    act(() => {
      result.current.setRejectionReason("Not interested");
    });
    act(() => {
      result.current.handleReject(); // second call → submit
    });
    expect(onReject).toHaveBeenCalledWith("apt-1", "Not interested");
    expect(result.current.showRejectInput).toBe(false);
    expect(result.current.rejectionReason).toBe("");
  });

  it("alerts when rejecting without a reason", () => {
    window.alert = jest.fn();
    const { result, onReject } = setup();
    act(() => {
      result.current.handleReject(); // show input
    });
    act(() => {
      result.current.handleReject(); // submit without reason
    });
    expect(window.alert).toHaveBeenCalledWith(
      "Please provide a rejection reason",
    );
    expect(onReject).not.toHaveBeenCalled();
  });

  it("handleCancelClick opens cancel confirm modal", () => {
    const { result } = setup();
    act(() => {
      result.current.handleCancelClick();
    });
    expect(result.current.showCancelConfirm).toBe(true);
  });

  it("handleConfirmCancel calls onCancel and closes modal", () => {
    const { result, onCancel } = setup();
    act(() => {
      result.current.handleCancelClick();
    });
    act(() => {
      result.current.handleConfirmCancel();
    });
    expect(onCancel).toHaveBeenCalledWith("apt-1");
    expect(result.current.showCancelConfirm).toBe(false);
  });

  it("handleCloseCancelModal closes the modal without calling onCancel", () => {
    const { result, onCancel } = setup();
    act(() => {
      result.current.handleCancelClick();
    });
    act(() => {
      result.current.handleCloseCancelModal();
    });
    expect(onCancel).not.toHaveBeenCalled();
    expect(result.current.showCancelConfirm).toBe(false);
  });

  it("navigates to chat with requesterId in dealer mode", () => {
    const { result } = setup("dealer");
    act(() => {
      result.current.handleChatClick();
    });
    expect(mockPush).toHaveBeenCalledWith("/messages?userId=requester-1");
  });

  it("navigates to chat with agentId in user mode", () => {
    const { result } = setup("user");
    act(() => {
      result.current.handleChatClick();
    });
    expect(mockPush).toHaveBeenCalledWith("/messages?userId=agent-1");
  });
});
