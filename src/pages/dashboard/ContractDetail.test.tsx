import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContractDetail from "@/pages/dashboard/ContractDetail";

const downloadContractPdfMock = vi.fn();
const scrollIntoViewMock = vi.fn();

let contractMock: any;
let escrowsMock: any[];

vi.mock("@/hooks/useInViewAnimation", () => ({
  useInViewAnimation: () => ({ ref: { current: null }, isInView: true }),
}));

vi.mock("@/hooks/api/useContracts", () => ({
  useContract: () => ({ data: contractMock, isLoading: false }),
}));

vi.mock("@/hooks/api/useMilestones", () => ({
  useMilestoneAction: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/api/useEscrow", () => ({
  useContractEscrows: () => ({ data: escrowsMock }),
  useCreateEscrow: () => ({ mutateAsync: vi.fn() }),
  useConfirmFunding: () => ({ mutateAsync: vi.fn() }),
  useReleasePayment: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock("@/contexts/WalletContext", () => ({
  useWallet: () => ({
    address: "0x1234567890123456789012345678901234567890",
    getEthProvider: () => ({ request: vi.fn() }),
    user: { id: "client-1" },
  }),
}));

vi.mock("@/lib/contractPdf", () => ({
  downloadContractPdf: (...args: unknown[]) => downloadContractPdfMock(...args),
}));

describe("ContractDetail", () => {
  beforeEach(() => {
    downloadContractPdfMock.mockReset();
    escrowsMock = [];
    contractMock = {
      id: "contract-123",
      title: "Mutual NDA",
      description: "RICARDIAN NON-DISCLOSURE AGREEMENT\n\nConfidential terms live here.",
      template_id: null,
      client_id: "client-1",
      contractor_id: null,
      contractor_wallet: null,
      status: "draft",
      total_amount: "0.00",
      currency: "USDC",
      progress: 0,
      start_date: "2026-04-10",
      end_date: null,
      created_at: "2026-04-10T12:00:00.000Z",
      updated_at: "2026-04-10T12:00:00.000Z",
      client: { display_name: "Acme Inc.", username: null },
      contractor: null,
      milestones: [
        {
          id: "ms-1",
          contract_id: "contract-123",
          sequence: 1,
          title: "Agreement Execution",
          description: null,
          amount: "0.00",
          status: "pending",
          due_date: null,
          submitted_at: null,
          approved_at: null,
          paid_at: null,
          submission_note: null,
          submission_files: [],
          created_at: "2026-04-10T12:00:00.000Z",
          updated_at: "2026-04-10T12:00:00.000Z",
        },
      ],
    };
    Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
      writable: true,
      value: scrollIntoViewMock,
    });
    scrollIntoViewMock.mockReset();
  });

  it("renders persisted legal prose, downloads the pdf, and hides zero-value funding", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/contracts/contract-123"]}>
        <Routes>
          <Route path="/dashboard/contracts/:id" element={<ContractDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/generated legal agreement/i)).toBeInTheDocument();
    expect(screen.getByText(/Confidential terms live here\./i)).toBeInTheDocument();
    expect(screen.queryByText(/fund this contract/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /download pdf/i }));

    expect(downloadContractPdfMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Mutual NDA",
        bodyText: expect.stringContaining("Confidential terms live here."),
      }),
    );
  });

  it("scrolls to funding when focus=fund is present for paid contracts", async () => {
    contractMock = {
      ...contractMock,
      title: "Growth Retainer",
      description: "RICARDIAN CONSULTING RETAINER AGREEMENT\n\nPaid engagement terms.",
      total_amount: "2500.00",
      milestones: [
        {
          ...contractMock.milestones[0],
          title: "Initial Retainer Period",
          amount: "2500.00",
        },
      ],
    };

    render(
      <MemoryRouter initialEntries={["/dashboard/contracts/contract-123?focus=fund"]}>
        <Routes>
          <Route path="/dashboard/contracts/:id" element={<ContractDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/fund this contract/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });
});
