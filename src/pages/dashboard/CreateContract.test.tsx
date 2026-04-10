import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import CreateContract from "@/pages/dashboard/CreateContract";

const navigateMock = vi.fn();
const mutateAsyncMock = vi.fn();
const downloadContractPdfMock = vi.fn();

vi.mock("@/hooks/useInViewAnimation", () => ({
  useInViewAnimation: () => ({ ref: { current: null }, isInView: true }),
}));

vi.mock("@/hooks/api/useContracts", () => ({
  useCreateContract: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    isError: false,
  }),
}));

vi.mock("@/contexts/WalletContext", () => ({
  useWallet: () => ({
    user: {
      id: "client-1",
      username: "founder",
      display_name: "Founder",
      walletAddress: "0x1234567890123456789012345678901234567890",
    },
  }),
}));

vi.mock("@/api/users", () => ({
  resolveUser: vi.fn(),
}));

vi.mock("@/lib/contractPdf", () => ({
  downloadContractPdf: (...args: unknown[]) => downloadContractPdfMock(...args),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("CreateContract", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
    downloadContractPdfMock.mockReset();
    navigateMock.mockReset();
    mutateAsyncMock.mockResolvedValue({ id: "contract-123" });
  });

  it("submits rendered legal text and routes paid templates into funding", async () => {
    render(
      <MemoryRouter>
        <CreateContract />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /consulting retainer/i }));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    fireEvent.change(screen.getByLabelText(/contract title/i), {
      target: { value: "Growth Retainer" },
    });
    fireEvent.change(screen.getByLabelText(/services description/i), {
      target: { value: "Weekly product strategy and engineering leadership" },
    });
    fireEvent.change(screen.getByLabelText(/response expectation/i), {
      target: { value: "Same business day for urgent requests" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    fireEvent.change(screen.getByLabelText(/amount \(usdc\)/i), {
      target: { value: "2500" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /create contract \+ deploy/i }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    expect(mutateAsyncMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Growth Retainer",
        total_amount: 2500,
        description: expect.stringContaining("Weekly product strategy and engineering leadership"),
        milestones: [{ title: "Initial Retainer Period", amount: 2500 }],
      }),
    );
    expect(downloadContractPdfMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/contracts/contract-123?focus=fund");
  });

  it("keeps zero-value templates on the detail page without focus fund", async () => {
    render(
      <MemoryRouter>
        <CreateContract />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.change(screen.getByLabelText(/purpose of disclosure/i), {
      target: { value: "reviewing a proposed partnership" },
    });

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /create contract \+ download pdf/i }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1);
    });

    expect(mutateAsyncMock).toHaveBeenCalledWith(
      expect.objectContaining({
        total_amount: 0,
        description: expect.stringContaining("reviewing a proposed partnership"),
      }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/dashboard/contracts/contract-123");
  });
});
