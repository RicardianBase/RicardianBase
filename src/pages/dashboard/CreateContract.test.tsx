import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { resolveUser } from "@/api/users";
import CreateContract from "@/pages/dashboard/CreateContract";

const navigateMock = vi.fn();
const mutateAsyncMock = vi.fn();
const downloadContractPdfMock = vi.fn();
let supportsUserResolution = true;
let supportsMultiPartyContracts = true;

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

vi.mock("@/hooks/api/useBackendFeatures", () => ({
  useBackendFeatures: () => ({
    supportsUsernames: supportsUserResolution,
    supportsUserResolution,
    supportsMultiPartyContracts,
    isLoading: false,
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
  const resolveUserMock = vi.mocked(resolveUser);

  beforeEach(() => {
    mutateAsyncMock.mockReset();
    downloadContractPdfMock.mockReset();
    navigateMock.mockReset();
    resolveUserMock.mockReset();
    supportsUserResolution = true;
    supportsMultiPartyContracts = true;
    mutateAsyncMock.mockResolvedValue({ id: "contract-123" });
  });

  it("submits rendered legal text with multi-party splits and routes paid templates into funding", async () => {
    resolveUserMock.mockRejectedValue(new Error("not found"));

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

    const primaryParticipantInput = screen.getByLabelText(/participant 1 \(wallet address or @username\)/i);
    fireEvent.change(primaryParticipantInput, {
      target: { value: "0x9999999999999999999999999999999999999999" },
    });
    fireEvent.blur(primaryParticipantInput);

    await waitFor(() => {
      expect(resolveUserMock).toHaveBeenCalledWith("0x9999999999999999999999999999999999999999");
    });

    fireEvent.click(screen.getByRole("button", { name: /add participant/i }));

    const secondParticipantInput = screen.getByLabelText(/participant 2 \(wallet address or @username\)/i);
    fireEvent.change(secondParticipantInput, {
      target: { value: "0x7777777777777777777777777777777777777777" },
    });
    fireEvent.blur(secondParticipantInput);

    await waitFor(() => {
      expect(resolveUserMock).toHaveBeenCalledWith("0x7777777777777777777777777777777777777777");
    });

    fireEvent.change(screen.getAllByLabelText(/payout split \(%\)/i)[0], {
      target: { value: "60" },
    });
    fireEvent.change(screen.getAllByLabelText(/payout split \(%\)/i)[1], {
      target: { value: "40" },
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
        contractor_wallet: "0x9999999999999999999999999999999999999999",
        total_amount: 2500,
        description: expect.stringContaining("Weekly product strategy and engineering leadership"),
        participants: [
          expect.objectContaining({
            role: "contractor",
            wallet_address: "0x9999999999999999999999999999999999999999",
            payout_split: 60,
          }),
          expect.objectContaining({
            role: "collaborator",
            wallet_address: "0x7777777777777777777777777777777777777777",
            payout_split: 40,
          }),
        ],
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

  it("resolves @username input to a wallet before creating the contract", async () => {
    resolveUserMock.mockResolvedValue({
      id: "user-2",
      username: "builder",
      display_name: "Builder",
      walletAddress: "0x9999999999999999999999999999999999999999",
    });

    render(
      <MemoryRouter>
        <CreateContract />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    const contractorInput = screen.getByLabelText(/participant 1 \(wallet address or @username\)/i);
    fireEvent.change(contractorInput, { target: { value: "@builder" } });
    fireEvent.blur(contractorInput);

    await waitFor(() => {
      expect(resolveUserMock).toHaveBeenCalledWith("builder");
    });

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
        contractor_wallet: "0x9999999999999999999999999999999999999999",
        participants: [
          expect.objectContaining({
            role: "contractor",
            wallet_address: "0x9999999999999999999999999999999999999999",
            username: "builder",
          }),
        ],
      }),
    );
  });

  it("keeps raw wallet flow working when the wallet is not tied to a profile", async () => {
    resolveUserMock.mockRejectedValue(new Error("not found"));

    render(
      <MemoryRouter>
        <CreateContract />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    const contractorInput = screen.getByLabelText(/participant 1 \(wallet address or @username\)/i);
    fireEvent.change(contractorInput, {
      target: { value: "0x8888888888888888888888888888888888888888" },
    });
    fireEvent.blur(contractorInput);

    await waitFor(() => {
      expect(resolveUserMock).toHaveBeenCalledWith("0x8888888888888888888888888888888888888888");
    });

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
        contractor_wallet: "0x8888888888888888888888888888888888888888",
        participants: [
          expect.objectContaining({
            role: "contractor",
            wallet_address: "0x8888888888888888888888888888888888888888",
          }),
        ],
      }),
    );
  });

  it("falls back to wallet-only copy when username resolution is unsupported", () => {
    supportsMultiPartyContracts = false;
    supportsUserResolution = false;

    render(
      <MemoryRouter>
        <CreateContract />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(
      screen.getByLabelText(/contractor wallet address/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/enter a 0x wallet address\. leave empty to assign later\./i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/ricardian username/i)).not.toBeInTheDocument();
  });
});
