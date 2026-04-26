import { render, screen } from "@testing-library/react";
import AdminKycVerification from "../ui/kyc/AdminKycVerification";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { IKycSubmissions } from "@/app/features/dashboards/dealer/types/kyc.types";

jest.mock("../context/AdminFilterContext", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="admin-filter-provider">{children}</div>
  ),
}));

jest.mock("../dashboard/FilterUI", () => ({
  __esModule: true,
  FilterUI: ({ category }: { category: string }) => (
    <div data-testid="filter-ui" data-category={category}>
      Filter UI - {category}
    </div>
  ),
}));

jest.mock("@/app/features/dashboards/admin/ui/dashboard/DataTable", () => ({
  __esModule: true,
  default: ({ data }: { data: { type: string; data: unknown[] } }) => (
    <div
      data-testid="data-table"
      data-type={data.type}
      data-count={data.data.length}
    >
      DataTable - {data.type}
    </div>
  ),
}));

jest.mock("../../../dealer/ui/dealer-management/StatsCard", () => ({
  __esModule: true,
  default: ({
    label,
    value,
    variant,
    category,
  }: {
    label: string;
    value: number;
    variant: string;
    category?: string;
  }) => (
    <div
      data-testid="stats-card"
      data-label={label}
      data-value={value}
      data-variant={variant}
      data-category={category ?? ""}
    >
      {label}: {value}
    </div>
  ),
}));

const createKyc = (): CursorResponse<IKycSubmissions[]> =>
  ({
    items: [
      {
        id: "kyc-1",
        fullName: "Mg Mg",
        email: "mgmg@example.com",
        documentType: "Passport",
        status: "Pending",
      },
      {
        id: "kyc-2",
        fullName: "Aung Aung",
        email: "aung@example.com",
        documentType: "NationalID",
        status: "Approved",
      },
      {
        id: "kyc-3",
        fullName: "Hla Hla",
        email: "hla@example.com",
        documentType: "DriverLicense",
        status: "Rejected",
      },
      {
        id: "kyc-4",
        fullName: "Su Su",
        email: "susu@example.com",
        documentType: "UtilityBill",
        status: "Pending",
      },
    ],
  }) as unknown as CursorResponse<IKycSubmissions[]>;

describe("AdminKycVerification", () => {
  it("renders fallback message when kyc data is missing", () => {
    render(
      <AdminKycVerification
        kyc={null as unknown as CursorResponse<IKycSubmissions[]>}
      />,
    );

    expect(screen.getByText("Kyc data missing")).toBeInTheDocument();
  });

  it("renders the page heading and description", () => {
    render(<AdminKycVerification kyc={createKyc()} />);

    expect(
      screen.getByRole("heading", { name: "Document Verification" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Review and verify user-submitted documents"),
    ).toBeInTheDocument();
  });

  it("renders correct kyc stats counts", () => {
    render(<AdminKycVerification kyc={createKyc()} />);

    expect(screen.getByText("All KYC: 4")).toBeInTheDocument();
    expect(screen.getByText("Pending KYC: 2")).toBeInTheDocument();
    expect(screen.getByText("Approved KYC: 1")).toBeInTheDocument();
    expect(screen.getByText("Rejected KYC: 1")).toBeInTheDocument();
  });

  it("renders FilterUI with Kyc category", () => {
    render(<AdminKycVerification kyc={createKyc()} />);

    const filterUI = screen.getByTestId("filter-ui");

    expect(filterUI).toBeInTheDocument();
    expect(filterUI).toHaveAttribute("data-category", "Kyc");
  });

  it("passes kyc data to DataTable", () => {
    render(<AdminKycVerification kyc={createKyc()} />);

    const dataTable = screen.getByTestId("data-table");

    expect(dataTable).toBeInTheDocument();
    expect(dataTable).toHaveAttribute("data-type", "kyc");
    expect(dataTable).toHaveAttribute("data-count", "4");
  });

  it("wraps content with AdminFilterProvider", () => {
    render(<AdminKycVerification kyc={createKyc()} />);

    expect(screen.getByTestId("admin-filter-provider")).toBeInTheDocument();
  });
});
