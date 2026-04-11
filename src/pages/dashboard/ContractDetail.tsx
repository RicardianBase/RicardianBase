import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Copy, CheckCircle, Shield, Clock, FileText, Loader2, ExternalLink, DollarSign, Lock, Paperclip, X as XIcon, Image, Download } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useContract } from "@/hooks/api/useContracts";
import { useMilestoneAction } from "@/hooks/api/useMilestones";
import { useContractEscrows, useCreateEscrow, useConfirmFunding, useReleasePayment } from "@/hooks/api/useEscrow";
import { useWallet } from "@/contexts/WalletContext";
import { USDC_BASE, USDC_DECIMALS, encodeTransfer, toRawAmount } from "@/lib/onchain";
import { downloadContractPdf } from "@/lib/contractPdf";
import type { ContractParticipant, MilestoneStatus } from "@/types/api";
import { checkProfanity, censorText } from "@/lib/profanity";

const statusColorMap: Record<MilestoneStatus, string> = {
  approved: "bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)]",
  paid: "bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)]",
  submitted: "bg-[hsl(40,60%,92%)] text-[hsl(40,70%,35%)]",
  in_progress: "bg-[hsl(220,60%,92%)] text-[hsl(220,70%,35%)]",
  pending: "bg-[hsl(230,20%,94%)] text-muted-foreground",
  rejected: "bg-[hsl(340,40%,94%)] text-[hsl(340,60%,40%)]",
};

const statusLabels: Record<MilestoneStatus, string> = {
  pending: "Pending", in_progress: "In Progress", submitted: "Submitted",
  approved: "Approved", rejected: "Rejected", paid: "Paid",
};

const contractStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  active: "bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)]",
  in_review: "bg-[hsl(40,60%,92%)] text-[hsl(40,70%,35%)]",
  completed: "bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)]",
  disputed: "bg-[hsl(340,40%,94%)] text-[hsl(340,60%,40%)]",
  cancelled: "bg-gray-100 text-gray-500",
};

function formatAmount(amount: string): string {
  return `$${parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function getPartyName(
  userName: { username?: string | null; display_name?: string | null } | null | undefined,
  fallback: string,
): string {
  if (userName?.display_name) return userName.display_name;
  if (userName?.username) return `@${userName.username}`;
  return fallback;
}

function getParticipantRoleLabel(role: ContractParticipant["role"]): string {
  switch (role) {
    case "client":
      return "Client";
    case "contractor":
      return "Contractor";
    case "collaborator":
      return "Collaborator";
    case "reviewer":
      return "Reviewer";
    case "observer":
      return "Observer";
    default:
      return role;
  }
}

function getParticipantDisplayName(participant: ContractParticipant): string {
  if (participant.user?.display_name) return participant.user.display_name;
  if (participant.username) return `@${participant.username}`;
  if (participant.wallet_address) {
    return `${participant.wallet_address.slice(0, 6)}...${participant.wallet_address.slice(-4)}`;
  }
  return "Unassigned";
}

function getDisplayParticipants(contract: any): ContractParticipant[] {
  if (contract.participants?.length) {
    return [...contract.participants].sort((left, right) => left.position - right.position);
  }

  const fallback: ContractParticipant[] = [
    {
      id: `legacy-client-${contract.id}`,
      user_id: contract.client_id,
      role: "client",
      wallet_address: null,
      username: contract.client?.username ?? null,
      payout_split: null,
      position: 0,
      user: contract.client ?? null,
    },
  ];

  if (contract.contractor_id || contract.contractor_wallet) {
    fallback.push({
      id: `legacy-contractor-${contract.id}`,
      user_id: contract.contractor_id,
      role: "contractor",
      wallet_address: contract.contractor_wallet,
      username: contract.contractor?.username ?? null,
      payout_split: "100.00",
      position: 1,
      user: contract.contractor ?? null,
    });
  }

  return fallback;
}

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [tab, setTab] = useState<"legal" | "smart">("legal");
  const { ref, isInView } = useInViewAnimation();
  const { address, getEthProvider, user } = useWallet();
  const fundingCardRef = useRef<HTMLDivElement>(null);

  const { data: contract, isLoading } = useContract(id!);
  const { data: escrows } = useContractEscrows(id!);
  const milestoneAction = useMilestoneAction(id!);
  const createEscrowMutation = useCreateEscrow();
  const confirmFundingMutation = useConfirmFunding(id!);
  const releasePaymentMutation = useReleasePayment(id!);

  const [fundingState, setFundingState] = useState<"idle" | "creating" | "signing" | "confirming" | "done" | "error">("idle");
  const [fundError, setFundError] = useState<string | null>(null);
  const [fundTxHash, setFundTxHash] = useState<string | null>(null);
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [submitNote, setSubmitNote] = useState<Record<string, string>>({});
  const [submitFiles, setSubmitFiles] = useState<Record<string, { name: string; type: string; size: number; url: string }[]>>({});
  const [fileError, setFileError] = useState<string | null>(null);

  const ALLOWED_TYPES = [
    "image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml",
    "application/pdf",
    "text/plain", "text/csv", "text/markdown",
    "application/json",
    "application/zip", "application/x-zip-compressed",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  const BLOCKED_EXTENSIONS = [
    ".exe", ".bat", ".cmd", ".com", ".msi", ".scr", ".pif", ".vbs", ".vbe",
    ".js", ".jse", ".ws", ".wsf", ".wsc", ".wsh", ".ps1", ".ps1xml", ".ps2",
    ".psc1", ".psc2", ".msh", ".msh1", ".msh2", ".inf", ".reg", ".rgs",
    ".sct", ".shb", ".shs", ".lnk", ".dll", ".sys", ".drv", ".cpl",
    ".hta", ".html", ".htm", ".jar", ".app", ".action", ".command", ".sh",
  ];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILES = 5;

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileAdd = async (milestoneId: string, fileList: FileList | null) => {
    if (!fileList) return;
    setFileError(null);
    const existing = submitFiles[milestoneId] ?? [];
    const newFiles: typeof existing = [];

    for (const file of Array.from(fileList)) {
      if (existing.length + newFiles.length >= MAX_FILES) {
        setFileError(`Maximum ${MAX_FILES} files allowed`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`${file.name} exceeds 10MB limit`);
        continue;
      }
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (BLOCKED_EXTENSIONS.includes(ext)) {
        setFileError(`${file.name} — file type not allowed (security risk)`);
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type) && file.type !== "") {
        setFileError(`${file.name} — unsupported file type`);
        continue;
      }
      // Convert to base64 data URI so it persists in the database and is viewable by both parties
      const dataUrl = await fileToBase64(file);
      newFiles.push({ name: file.name, type: file.type, size: file.size, url: dataUrl });
    }

    setSubmitFiles({ ...submitFiles, [milestoneId]: [...existing, ...newFiles] });
  };

  const removeFile = (milestoneId: string, index: number) => {
    const existing = submitFiles[milestoneId] ?? [];
    setSubmitFiles({ ...submitFiles, [milestoneId]: existing.filter((_, i) => i !== index) });
  };

  const milestones = contract?.milestones ?? [];
  const participants = contract ? getDisplayParticipants(contract) : [];
  const primaryParticipant =
    participants.find((participant) => participant.role === "contractor")
    ?? participants.find((participant) => participant.role === "collaborator")
    ?? null;
  const contractorName = primaryParticipant
    ? getParticipantDisplayName(primaryParticipant)
    : "Unassigned";
  const contractorInitials = primaryParticipant?.username
    ? primaryParticipant.username.slice(0, 2).toUpperCase()
    : getInitials(primaryParticipant?.user?.display_name);
  const hasContractor = !!primaryParticipant;
  const payoutParticipants = participants.filter(
    (participant) => participant.role === "contractor" || participant.role === "collaborator",
  );
  const hasManualSplitFallback = payoutParticipants.length > 1 && parseFloat(contract?.total_amount ?? "0") > 0;

  const fundedEscrow = escrows?.find((e) => e.status === "funded");
  const totalFunded = escrows?.filter((e) => e.status === "funded" || e.status === "released")
    .reduce((sum, e) => sum + parseFloat(e.total_locked), 0) ?? 0;
  const isFunded = !!fundedEscrow;
  const isDraft = contract?.status === "draft";
  const isClient = contract
    ? participants.some(
        (participant) => participant.user_id === user?.id && participant.role === "client",
      ) || user?.id === contract.client_id
    : false;
  const isContractor = contract
    ? participants.some(
        (participant) =>
          participant.user_id === user?.id &&
          (participant.role === "contractor" || participant.role === "collaborator"),
      ) || user?.id === contract.contractor_id
    : false;
  const hasMonetaryValue = parseFloat(contract?.total_amount ?? "0") > 0;
  const shouldShowFundingCard = !!contract && isDraft && !isFunded && isClient && hasMonetaryValue;
  const clientName = getPartyName(contract?.client, "Client");
  const legalText = contract?.description?.trim()
    ? contract.description
    : `Contract Title: ${contract?.title ?? ""}

Client: ${clientName}
Primary Contractor: ${contractorName}

This contract does not yet include generated legal prose.`;

  useEffect(() => {
    const focusTarget = new URLSearchParams(location.search).get("focus");
    if (focusTarget !== "fund" || !shouldShowFundingCard) {
      return;
    }

    const timer = window.setTimeout(() => {
      fundingCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);

    return () => window.clearTimeout(timer);
  }, [location.search, shouldShowFundingCard]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl animate-pulse">
        <div className="h-8 w-32 bg-muted rounded-full" />
        <div className="bg-white rounded-2xl p-6 shadow-sm"><div className="h-6 bg-muted rounded w-1/2 mb-2" /><div className="h-4 bg-muted rounded w-1/4" /></div>
        <div className="bg-white rounded-2xl p-6 shadow-sm h-48" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Contract not found</p>
        <Link to="/dashboard/contracts" className="text-emerald-600 text-sm mt-2 inline-block">Back to contracts</Link>
      </div>
    );
  }

  const handleFundContract = async () => {
    if (!address || !getEthProvider()) {
      setFundError("Wallet not connected");
      return;
    }

    setFundingState("creating");
    setFundError(null);
    setFundTxHash(null);

    try {
      // Step 1: Create escrow record, get platform wallet + amount
      const escrow = await createEscrowMutation.mutateAsync({ contractId: id! });

      setFundingState("signing");

      // Step 2: Ensure wallet is on Base chain, then send USDC
      const provider = getEthProvider();
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }], // Base mainnet = 8453
        });
      } catch (switchErr: any) {
        if (switchErr.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x2105",
              chainName: "Base",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
            }],
          });
        }
      }
      const raw = toRawAmount(escrow.total_locked, USDC_DECIMALS);
      const data = encodeTransfer(escrow.escrow_account, raw);

      const txHash = (await provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: address,
          to: USDC_BASE,
          data,
        }],
      })) as string;

      setFundTxHash(txHash);
      setFundingState("confirming");

      // Step 3: Confirm with backend (verifies on-chain)
      await confirmFundingMutation.mutateAsync({ escrowId: escrow.id, txHash });

      setFundingState("done");
    } catch (err: any) {
      setFundError(err?.message ?? "Funding failed");
      setFundingState("error");
    }
  };

  const handleReleaseMilestone = async (milestoneId: string) => {
    if (!fundedEscrow) return;
    setReleasingId(milestoneId);
    try {
      await releasePaymentMutation.mutateAsync({
        escrowId: fundedEscrow.id,
        milestoneId,
      });
    } catch (err: any) {
      alert(err?.message ?? "Release failed");
    } finally {
      setReleasingId(null);
    }
  };

  const handleDownloadPdf = () => {
    downloadContractPdf({
      title: contract.title,
      effectiveDate: contract.start_date ?? contract.created_at,
      clientLabel: clientName,
      contractorLabel: contractorName,
      bodyText: legalText,
      milestones: milestones.map((milestone) => ({
        title: milestone.title,
        amount: parseFloat(milestone.amount),
      })),
      totalAmount: parseFloat(contract.total_amount),
      currency: contract.currency,
    });
  };

  return (
    <div ref={ref} className="space-y-6 max-w-5xl">
      <Link
        to="/dashboard/contracts"
        className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-[hsl(230,20%,90%)] rounded-full px-4 py-2 transition-colors ${isInView ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "0.05s" }}
      >
        <ArrowLeft size={14} /> Back to contracts
      </Link>

      {/* Header */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-medium text-foreground">{contract.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Created {new Date(contract.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full w-fit ${contractStatusColors[contract.status]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            {contract.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </div>

        <div className="flex bg-[hsl(230,25%,94%)] rounded-full p-0.5 mt-6 w-fit">
          <button onClick={() => setTab("legal")} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${tab === "legal" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>
            Legal Document
          </button>
          <button onClick={() => setTab("smart")} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${tab === "smart" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>
            Smart Contract
          </button>
        </div>
      </div>

      {/* Document viewer */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {tab === "legal" ? "Generated Legal Agreement" : "Smart Contract Preview"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {tab === "legal"
                ? "This view reflects the legal prose persisted on the contract."
                : "Illustrative smart contract preview for the milestone payout flow."}
            </p>
          </div>
          {tab === "legal" && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 text-xs font-medium border border-[hsl(230,20%,90%)] text-foreground px-4 py-2 rounded-full hover:bg-[hsl(230,25%,96%)] transition-colors"
            >
              <Download size={12} /> Download PDF
            </button>
          )}
        </div>

        <div className="border border-[hsl(230,20%,92%)] rounded-xl p-6 max-h-[360px] overflow-y-auto text-sm text-muted-foreground leading-relaxed">
          {tab === "legal" ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground text-base">{contract.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Effective {new Date(contract.start_date ?? contract.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="whitespace-pre-wrap text-foreground leading-7">{legalText}</p>
            </div>
          ) : (
            <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
{`// SPDX-License-Identifier: MIT
contract ${contract.title.replace(/\s+/g, "")} {
  address public client;
  address public contractor;
  uint256 public totalValue = ${parseFloat(contract.total_amount)}e6; // ${contract.currency}

  struct Participant {
    string role;
    address wallet;
    uint16 splitBps;
  }

  enum Status { Pending, InProgress, Submitted, Approved }

  struct Milestone {
    string title;
    uint256 amount;
    Status status;
  }

  Milestone[] public milestones;
  Participant[] public participants;

  function approveMilestone(uint256 id) external {
    require(msg.sender == client);
    milestones[id].status = Status.Approved;
    // Release funds...
  }
}`}
            </pre>
          )}
        </div>

        {tab === "legal" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
            <div className="rounded-xl bg-[hsl(230,25%,97%)] p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Client</p>
              <p className="text-sm font-medium text-foreground mt-2">{clientName}</p>
            </div>
            <div className="rounded-xl bg-[hsl(230,25%,97%)] p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Contractor</p>
              <p className="text-sm font-medium text-foreground mt-2">{contractorName}</p>
            </div>
            <div className="rounded-xl bg-[hsl(230,25%,97%)] p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Milestones</p>
              <p className="text-sm font-medium text-foreground mt-2">{milestones.length}</p>
            </div>
            <div className="rounded-xl bg-[hsl(230,25%,97%)] p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Total Value</p>
              <p className="text-sm font-medium text-foreground mt-2">{formatAmount(contract.total_amount)} {contract.currency}</p>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-[hsl(230,20%,92%)] bg-[hsl(230,25%,98%)] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <p className="text-sm font-medium text-foreground">Participants</p>
              <p className="text-xs text-muted-foreground mt-1">
                Stored participant roles and payout splits for this contract.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {participants.length} total participant{participants.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-white px-4 py-3 border border-[hsl(230,20%,92%)]"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {getParticipantDisplayName(participant)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getParticipantRoleLabel(participant.role)}
                    {participant.wallet_address ? ` · ${participant.wallet_address.slice(0, 6)}...${participant.wallet_address.slice(-4)}` : ""}
                  </p>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {participant.payout_split ? `${parseFloat(participant.payout_split).toFixed(2)}%` : "No payout split"}
                </div>
              </div>
            ))}
          </div>

          {hasManualSplitFallback && (
            <div className="mt-4 rounded-xl bg-[hsl(40,80%,96%)] px-4 py-3 text-xs text-[hsl(35,70%,32%)]">
              Multi-party payout splits are stored for REST, MCP, and JSON-LD reads in this release. Escrow release still follows the primary contractor compatibility path, so additional split execution remains manual.
            </div>
          )}
        </div>
      </div>

      {/* Escrow funding card — shown for draft/unfunded contracts */}
      {shouldShowFundingCard && (
        <div ref={fundingCardRef} className={`bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-sm text-white ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.18s" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Lock size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Fund This Contract</h2>
              <p className="text-xs text-white/60">USDC will be held in escrow until milestones are approved</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Contract Amount</span>
              <span className="font-semibold">{formatAmount(contract.total_amount)} USDC</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Platform Fee (1%)</span>
              <span className="font-semibold">${(parseFloat(contract.total_amount) * 0.01).toFixed(2)} USDC</span>
            </div>
            <div className="border-t border-white/20 my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-white/70 font-medium">Total</span>
              <span className="font-bold text-lg">${(parseFloat(contract.total_amount) * 1.01).toFixed(2)} USDC</span>
            </div>
          </div>

          {fundingState === "done" ? (
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm font-medium text-white flex items-center gap-2"><CheckCircle size={16} /> Contract funded!</p>
              {fundTxHash && (
                <a href={`https://basescan.org/tx/${fundTxHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-white/70 mt-1 inline-flex items-center gap-1 hover:text-white">
                  View on Basescan <ExternalLink size={10} />
                </a>
              )}
            </div>
          ) : fundingState === "error" ? (
            <div>
              <p className="text-xs text-red-200 mb-3">{fundError}</p>
              <button onClick={handleFundContract} className="inline-flex items-center gap-2 text-sm font-medium bg-white text-emerald-700 px-6 py-3 rounded-full hover:bg-white/90 transition-colors">
                <DollarSign size={16} /> Try Again
              </button>
            </div>
          ) : (
            <button
              onClick={handleFundContract}
              disabled={fundingState !== "idle"}
              className="inline-flex items-center gap-2 text-sm font-medium bg-white text-emerald-700 px-6 py-3 rounded-full hover:bg-white/90 transition-colors disabled:opacity-70"
            >
              {fundingState === "idle" && <><DollarSign size={16} /> Fund Contract</>}
              {fundingState === "creating" && <><Loader2 size={16} className="animate-spin" /> Creating escrow...</>}
              {fundingState === "signing" && <><Loader2 size={16} className="animate-spin" /> Approve in wallet...</>}
              {fundingState === "confirming" && <><Loader2 size={16} className="animate-spin" /> Verifying on-chain...</>}
            </button>
          )}
        </div>
      )}

      {/* Info grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Escrow Balance</p>
          <p className="text-3xl font-semibold text-foreground">${totalFunded.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">{isFunded ? "Locked in escrow" : "Not yet funded"}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">
              {contractorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{contractorName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hasContractor ? "Assigned Contractor" : "No contractor assigned"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-[hsl(160,50%,45%)]" />
            <p className="text-xs text-muted-foreground">Contract ID</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground font-mono">{contract.id.slice(0, 8)}...{contract.id.slice(-4)}</span>
            <CheckCircle size={12} className="text-[hsl(160,50%,45%)]" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Currency</p>
          </div>
          <p className="text-sm font-medium text-foreground">{contract.currency}</p>
        </div>
      </div>

      {/* Milestones */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.25s" }}>
        <h2 className="text-base font-medium text-foreground mb-6">Milestones</h2>
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No milestones</p>
        ) : (
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    m.status === "approved" || m.status === "paid"
                      ? "bg-[hsl(160,50%,45%)] text-white"
                      : m.status === "submitted"
                      ? "bg-[hsl(40,60%,90%)] text-[hsl(40,70%,35%)] ring-2 ring-[hsl(40,60%,80%)]"
                      : "bg-[hsl(230,25%,94%)] text-muted-foreground"
                  }`}>
                    {m.sequence}
                  </div>
                  {i < milestones.length - 1 && <div className="w-px h-full min-h-[40px] bg-[hsl(230,20%,92%)] my-1" />}
                </div>

                <div className={`flex-1 pb-6 ${i < milestones.length - 1 ? "border-b border-[hsl(230,20%,94%)]" : ""} mb-2`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground">{m.title}</h3>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full w-fit ${statusColorMap[m.status]}`}>
                      {statusLabels[m.status]}
                    </span>
                  </div>
                  {m.description && <p className="text-xs text-muted-foreground mb-1">{m.description}</p>}
                  <p className="text-sm font-semibold text-foreground">{formatAmount(m.amount)}</p>

                  {/* Contractor actions — each milestone independently actionable */}
                  {(() => {
                    if (!isContractor) return null;

                    if (m.status === "pending" && contract.status === "active") {
                      return (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => milestoneAction.mutate({ milestoneId: m.id, status: "in_progress" })}
                            disabled={milestoneAction.isPending}
                            className="text-xs font-medium bg-[hsl(220,60%,92%)] text-[hsl(220,70%,35%)] px-4 py-2 rounded-full hover:bg-[hsl(220,60%,87%)] transition-colors disabled:opacity-50"
                          >
                            Start Working
                          </button>
                        </div>
                      );
                    }

                    if (m.status === "in_progress" || m.status === "rejected") {
                      const note = submitNote[m.id] ?? "";
                      const files = submitFiles[m.id] ?? [];
                      return (
                        <div className="mt-3 space-y-3 bg-[hsl(230,25%,97%)] dark:bg-[hsl(220,18%,12%)] rounded-xl p-4">
                          {m.status === "rejected" && (
                            <p className="text-[10px] text-[hsl(340,60%,50%)]">Changes requested by client — update and resubmit</p>
                          )}
                          <div>
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1 block">Work Description</label>
                            <textarea
                              value={note}
                              onChange={(e) => setSubmitNote({ ...submitNote, [m.id]: e.target.value })}
                              placeholder="Describe the work completed, include links to deliverables, repos, designs..."
                              rows={3}
                              className="w-full border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none bg-white dark:bg-[hsl(220,18%,13%)] text-foreground"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-1 block">Attachments ({files.length}/{MAX_FILES})</label>

                            {/* File list */}
                            {files.length > 0 && (
                              <div className="space-y-1.5 mb-2">
                                {files.map((f, fi) => (
                                  <div key={fi} className="flex items-center gap-2 bg-white dark:bg-[hsl(220,18%,13%)] rounded-lg px-3 py-2 border border-[hsl(230,20%,92%)] dark:border-[hsl(220,15%,20%)]">
                                    {f.type.startsWith("image/") ? (
                                      <Image size={14} className="text-emerald-500 flex-shrink-0" />
                                    ) : (
                                      <Paperclip size={14} className="text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span className="text-xs text-foreground truncate flex-1">{f.name}</span>
                                    <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">{(f.size / 1024).toFixed(0)}KB</span>
                                    <button
                                      onClick={() => removeFile(m.id, fi)}
                                      className="w-5 h-5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center flex-shrink-0"
                                    >
                                      <XIcon size={12} className="text-muted-foreground hover:text-red-500" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Upload button */}
                            {files.length < MAX_FILES && (
                              <label className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-dashed border-[hsl(230,20%,85%)] dark:border-[hsl(220,15%,25%)] rounded-lg px-3 py-2 cursor-pointer hover:bg-white dark:hover:bg-[hsl(220,18%,13%)] transition-colors">
                                <Paperclip size={12} />
                                Attach Files
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) => handleFileAdd(m.id, e.target.files)}
                                  className="hidden"
                                  accept={ALLOWED_TYPES.join(",")}
                                />
                              </label>
                            )}
                            <p className="text-[10px] text-muted-foreground/50 mt-1">Images, PDFs, docs, spreadsheets, ZIPs — max 10MB each, {MAX_FILES} files max</p>
                            {fileError && <p className="text-[10px] text-red-500 mt-1">{fileError}</p>}
                          </div>

                          <button
                            onClick={() => {
                              if (!note.trim() || files.length === 0) return;
                              const profanityResult = checkProfanity(note.trim());
                              if (profanityResult.isProfane) {
                                setFileError("Submission contains inappropriate language. Please revise.");
                                return;
                              }
                              setFileError(null);
                              milestoneAction.mutate({
                                milestoneId: m.id,
                                status: "submitted",
                                submissionNote: note.trim(),
                                submissionFiles: files.map((f) => ({ name: f.name, type: f.type, size: f.size, url: f.url })),
                              });
                            }}
                            disabled={milestoneAction.isPending || !note.trim() || files.length === 0}
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50"
                          >
                            {milestoneAction.isPending ? <><Loader2 size={12} className="animate-spin" /> Submitting...</> : m.status === "rejected" ? "Resubmit Work" : "Submit Work"}
                          </button>
                          {(!note.trim() || files.length === 0) && (
                            <p className="text-[10px] text-muted-foreground/60">
                              {!note.trim() && files.length === 0 ? "Add a description and attach at least one file" :
                               !note.trim() ? "Add a work description" : "Attach at least one file"}
                            </p>
                          )}
                        </div>
                      );
                    }

                    return null;
                  })()}

                  {/* Submission preview — visible to both parties */}
                  {m.submission_note && (m.status === "submitted" || m.status === "approved" || m.status === "paid") && (
                    <div className="mt-3 bg-[hsl(230,25%,97%)] dark:bg-[hsl(220,18%,12%)] rounded-xl p-4 space-y-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Submitted Work</p>
                      <p className="text-xs text-foreground whitespace-pre-wrap">{censorText(m.submission_note)}</p>
                      {m.submission_files?.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Attachments</p>
                          {m.submission_files.map((f, fi) => {
                            const isAccessible = f.url?.startsWith("data:") || f.url?.startsWith("http");
                            const isBroken = f.url?.startsWith("blob:");
                            return isBroken ? (
                              <div
                                key={fi}
                                className="flex items-center gap-2 bg-white dark:bg-[hsl(220,18%,13%)] rounded-lg px-3 py-2 border border-[hsl(230,20%,92%)] dark:border-[hsl(220,15%,20%)] opacity-50"
                              >
                                {f.type?.startsWith("image/") ? (
                                  <Image size={14} className="text-muted-foreground flex-shrink-0" />
                                ) : (
                                  <Paperclip size={14} className="text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="text-xs text-muted-foreground truncate flex-1">{f.name}</span>
                                <span className="text-[10px] text-red-400 flex-shrink-0">File unavailable</span>
                              </div>
                            ) : (
                            <a
                              key={fi}
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={f.name}
                              className="flex items-center gap-2 bg-white dark:bg-[hsl(220,18%,13%)] rounded-lg px-3 py-2 border border-[hsl(230,20%,92%)] dark:border-[hsl(220,15%,20%)] hover:border-emerald-300 transition-colors"
                            >
                              {f.type?.startsWith("image/") ? (
                                <Image size={14} className="text-emerald-500 flex-shrink-0" />
                              ) : (
                                <Paperclip size={14} className="text-muted-foreground flex-shrink-0" />
                              )}
                              <span className="text-xs text-foreground truncate flex-1">{f.name}</span>
                              <span className="text-[10px] text-muted-foreground/60 flex-shrink-0">{(f.size / 1024).toFixed(0)}KB</span>
                              <ExternalLink size={10} className="text-muted-foreground/40 flex-shrink-0" />
                            </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Client actions */}
                  {isClient && m.status === "submitted" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => milestoneAction.mutate({ milestoneId: m.id, status: "approved" })}
                        disabled={milestoneAction.isPending}
                        className="text-xs font-medium bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)] px-4 py-2 rounded-full hover:bg-[hsl(160,40%,87%)] transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => milestoneAction.mutate({ milestoneId: m.id, status: "rejected" })}
                        disabled={milestoneAction.isPending}
                        className="text-xs font-medium border border-[hsl(230,20%,90%)] text-muted-foreground px-4 py-2 rounded-full hover:bg-[hsl(230,25%,96%)] transition-colors disabled:opacity-50"
                      >
                        Request Changes
                      </button>
                    </div>
                  )}

                  {/* Release payment button for approved milestones — client only */}
                  {isClient && m.status === "approved" && isFunded && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleReleaseMilestone(m.id)}
                        disabled={releasingId === m.id || releasePaymentMutation.isPending}
                        className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50"
                      >
                        {releasingId === m.id ? <><Loader2 size={12} className="animate-spin" /> Releasing...</> : <><DollarSign size={12} /> Release Payment</>}
                      </button>
                    </div>
                  )}

                  {m.status === "paid" && m.paid_at && (
                    <p className="text-[10px] text-emerald-600 mt-2 flex items-center gap-1">
                      <CheckCircle size={10} /> Paid on {new Date(m.paid_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetail;
