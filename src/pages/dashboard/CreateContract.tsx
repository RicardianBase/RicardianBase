import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import {
  useAiContractReview,
  useCreateContract,
} from "@/hooks/api/useContracts";
import { useBackendFeatures } from "@/hooks/api/useBackendFeatures";
import { resolveUser, type ResolvedUser } from "@/api/users";
import { useWallet } from "@/contexts/WalletContext";
import { downloadContractPdf } from "@/lib/contractPdf";
import {
  getInitialTemplateValues,
  getTemplateBySlug,
  templateLibrary,
  type ContractTemplateDefinition,
  type TemplateFieldDefinition,
  type TemplateFormValues,
} from "@/lib/contractTemplates";
import { isResolvableUsername, normalizeUsername } from "@/lib/username";
import type { ContractParticipantRole } from "@/types/api";

const steps = ["Template", "Details", "Milestones", "Review"];

interface EditableMilestone {
  id: string;
  title: string;
  amount: string;
}

interface EditableParticipant {
  id: string;
  role: ContractParticipantRole;
  identifier: string;
  walletAddress: string;
  payoutSplit: string;
  resolvedUser: ResolvedUser | null;
  resolving: boolean;
  resolveError: string | null;
}

const splitEligibleRoles: ContractParticipantRole[] = ["contractor", "collaborator"];
const participantRoleOptions: Array<{ value: ContractParticipantRole; label: string }> = [
  { value: "contractor", label: "Contractor" },
  { value: "collaborator", label: "Collaborator" },
  { value: "reviewer", label: "Reviewer" },
  { value: "observer", label: "Observer" },
];

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function createMilestoneId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `milestone-${Math.random().toString(36).slice(2, 10)}`;
}

function createParticipantId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `participant-${Math.random().toString(36).slice(2, 10)}`;
}

function createEditableParticipant(
  role: ContractParticipantRole = "contractor",
  payoutSplit = role === "contractor" ? "100" : "0",
): EditableParticipant {
  return {
    id: createParticipantId(),
    role,
    identifier: "",
    walletAddress: "",
    payoutSplit,
    resolvedUser: null,
    resolving: false,
    resolveError: null,
  };
}

function getTemplateMilestones(template: ContractTemplateDefinition): EditableMilestone[] {
  return template.defaultMilestones.map((milestone) => ({
    id: createMilestoneId(),
    title: milestone.title,
    amount: milestone.amount.toString(),
  }));
}

function getCurrentUserLabel(user: ReturnType<typeof useWallet>["user"]): string {
  if (user?.display_name) return user.display_name;
  if (user?.username) return `@${user.username}`;
  if (user?.walletAddress) {
    return `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`;
  }
  return "Client";
}

function getContractorLabel(args: {
  resolvedUser?: ResolvedUser | null;
  contractorInput?: string;
  contractorWallet?: string;
}): string {
  if (args.resolvedUser?.display_name) return args.resolvedUser.display_name;
  if (args.resolvedUser?.username) return `@${args.resolvedUser.username}`;

  const raw = args.contractorInput?.trim() || args.contractorWallet?.trim() || "";
  if (!raw) return "Unassigned Contractor";
  if (raw.startsWith("0x") && raw.length > 10) {
    return `${raw.slice(0, 6)}...${raw.slice(-4)}`;
  }
  return raw.startsWith("@") ? raw : raw;
}

function isSplitEligible(role: ContractParticipantRole): boolean {
  return splitEligibleRoles.includes(role);
}

function getParticipantRoleLabel(role: ContractParticipantRole): string {
  return participantRoleOptions.find((option) => option.value === role)?.label ?? role;
}

function getParticipantLabel(participant: EditableParticipant): string {
  return getContractorLabel({
    resolvedUser: participant.resolvedUser,
    contractorInput: participant.identifier,
    contractorWallet: participant.walletAddress,
  });
}

function buildParticipantsAppendix(args: {
  clientLabel: string;
  participants: EditableParticipant[];
  totalAmount: number;
}): string {
  const activeParticipants = args.participants.filter(
    (participant) =>
      participant.identifier.trim() ||
      participant.walletAddress.trim() ||
      participant.resolvedUser,
  );

  if (activeParticipants.length === 0) {
    return "";
  }

  const lines = [
    "",
    "Additional Participants & Split Schedule",
    `- Client: ${args.clientLabel}`,
    ...activeParticipants.map((participant) => {
      const splitLabel = isSplitEligible(participant.role)
        ? `${parseFloat(participant.payoutSplit || "0").toFixed(2)}%`
        : "Non-payout role";
      return `- ${getParticipantRoleLabel(participant.role)}: ${getParticipantLabel(participant)} (${splitLabel})`;
    }),
  ];

  if (args.totalAmount > 0 && activeParticipants.filter((participant) => isSplitEligible(participant.role)).length > 1) {
    lines.push(
      "- Split execution note: milestone escrow still settles through the legacy primary contractor path in this release; additional participant splits are tracked for manual settlement.",
    );
  }

  return lines.join("\n");
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function fieldInputType(field: TemplateFieldDefinition): string {
  if (field.type === "number") return "number";
  if (field.type === "date") return "date";
  return "text";
}

const CreateContract = () => {
  const [step, setStep] = useState(0);
  const [selectedTemplateSlug, setSelectedTemplateSlug] = useState(templateLibrary[0].slug);
  const [title, setTitle] = useState("NDA Contract");
  const [effectiveDate, setEffectiveDate] = useState(todayIsoDate());
  const [endDate, setEndDate] = useState("");
  const [businessContext, setBusinessContext] = useState("");
  const [templateValues, setTemplateValues] = useState<TemplateFormValues>(
    getInitialTemplateValues(templateLibrary[0].fields),
  );
  const [contractorInput, setContractorInput] = useState("");
  const [contractorWallet, setContractorWallet] = useState("");
  const [resolvedUser, setResolvedUser] = useState<ResolvedUser | null>(null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<EditableParticipant[]>([
    createEditableParticipant(),
  ]);
  const [milestones, setMilestones] = useState<EditableMilestone[]>(
    getTemplateMilestones(templateLibrary[0]),
  );

  const currentTemplate = getTemplateBySlug(selectedTemplateSlug);
  const { ref, isInView } = useInViewAnimation();
  const navigate = useNavigate();
  const createMutation = useCreateContract();
  const aiReviewMutation = useAiContractReview();
  const { user } = useWallet();
  const {
    supportsMultiPartyContracts,
    supportsUserResolution,
    supportsAiContractReview,
  } = useBackendFeatures();

  useEffect(() => {
    setTemplateValues(getInitialTemplateValues(currentTemplate.fields));
    setMilestones(getTemplateMilestones(currentTemplate));
    setBusinessContext("");
    setEndDate("");
    setEffectiveDate(todayIsoDate());
    setResolveError(null);
    if (!title.trim()) {
      setTitle(`${currentTemplate.title} Contract`);
    }
  }, [currentTemplate.slug]);

  const handleContractorBlur = useCallback(async () => {
    const input = contractorInput.trim();
    if (!input) {
      setContractorWallet("");
      setResolvedUser(null);
      setResolveError(null);
      return;
    }

    const normalized = input.startsWith("@") ? normalizeUsername(input) : input;
    const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(normalized);
    const isUsername = supportsUserResolution && isResolvableUsername(normalized);

    if (!isEthAddress && !isUsername) {
      setResolveError(
        supportsUserResolution
          ? "Enter a valid wallet address (0x...) or username"
          : "Enter a valid wallet address (0x...)",
      );
      setResolvedUser(null);
      setContractorWallet("");
      return;
    }

    setResolving(true);
    setResolveError(null);
    setResolvedUser(null);

    try {
      const userResult = await resolveUser(normalized);
      if (!userResult.walletAddress) {
        setResolveError("User found but has no wallet connected");
        setContractorWallet("");
      } else {
        setResolvedUser(userResult);
        setContractorWallet(userResult.walletAddress);
      }
    } catch {
      if (isEthAddress) {
        setContractorWallet(normalized);
        setResolvedUser(null);
        setResolveError(null);
      } else if (supportsUserResolution) {
        setResolveError("Username not found on Ricardian");
        setContractorWallet("");
      }
    } finally {
      setResolving(false);
    }
  }, [contractorInput, supportsUserResolution]);

  const updateParticipant = useCallback(
    (participantId: string, updater: (current: EditableParticipant) => EditableParticipant) => {
      setParticipants((current) =>
        current.map((participant) =>
          participant.id === participantId ? updater(participant) : participant,
        ),
      );
    },
    [],
  );

  const handleParticipantBlur = useCallback(
    async (participantId: string) => {
      const participant = participants.find((current) => current.id === participantId);
      if (!participant) return;

      const input = participant.identifier.trim();
      if (!input) {
        updateParticipant(participantId, (current) => ({
          ...current,
          walletAddress: "",
          resolvedUser: null,
          resolveError: null,
          resolving: false,
        }));
        return;
      }

      const normalized = input.startsWith("@") ? normalizeUsername(input) : input;
      const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(normalized);
      const isUsername = supportsUserResolution && isResolvableUsername(normalized);

      if (!isEthAddress && !isUsername) {
        updateParticipant(participantId, (current) => ({
          ...current,
          resolvedUser: null,
          walletAddress: "",
          resolveError: supportsUserResolution
            ? "Enter a valid wallet address (0x...) or username"
            : "Enter a valid wallet address (0x...)",
          resolving: false,
        }));
        return;
      }

      updateParticipant(participantId, (current) => ({
        ...current,
        resolving: true,
        resolveError: null,
        resolvedUser: null,
      }));

      try {
        const userResult = await resolveUser(normalized);
        updateParticipant(participantId, (current) => ({
          ...current,
          resolvedUser: userResult,
          walletAddress: userResult.walletAddress ?? "",
          resolveError: null,
          resolving: false,
        }));
      } catch {
        if (isEthAddress) {
          updateParticipant(participantId, (current) => ({
            ...current,
            walletAddress: normalized,
            resolvedUser: null,
            resolveError: null,
            resolving: false,
          }));
        } else {
          updateParticipant(participantId, (current) => ({
            ...current,
            walletAddress: "",
            resolveError: "Username not found on Ricardian",
            resolving: false,
          }));
        }
      }
    },
    [participants, supportsUserResolution, updateParticipant],
  );

  const updateTemplateValue = (name: string, value: string) => {
    setTemplateValues((current) => ({ ...current, [name]: value }));
  };

  const addParticipant = () =>
    setParticipants((current) => [...current, createEditableParticipant("collaborator", "0")]);

  const removeParticipant = (participantId: string) => {
    setParticipants((current) => current.filter((participant) => participant.id !== participantId));
  };

  const addMilestone = () =>
    setMilestones((current) => [
      ...current,
      { id: createMilestoneId(), title: "", amount: "0" },
    ]);

  const updateMilestone = (
    milestoneId: string,
    key: keyof EditableMilestone,
    value: string,
  ) => {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === milestoneId ? { ...milestone, [key]: value } : milestone,
      ),
    );
  };

  const removeMilestone = (milestoneId: string) => {
    setMilestones((current) => current.filter((milestone) => milestone.id !== milestoneId));
  };

  const validMilestones = milestones
    .filter((milestone) => milestone.title.trim() && milestone.amount.trim() !== "")
    .map((milestone) => ({
      title: milestone.title.trim(),
      amount: parseFloat(milestone.amount) || 0,
    }));

  const totalAmount = validMilestones.reduce(
    (sum, milestone) => sum + milestone.amount,
    0,
  );

  const clientLabel = getCurrentUserLabel(user);
  const activeParticipants = participants.filter(
    (participant) =>
      participant.identifier.trim() ||
      participant.walletAddress.trim() ||
      participant.resolvedUser,
  );
  const payoutParticipants = activeParticipants.filter((participant) =>
    isSplitEligible(participant.role),
  );
  const payoutSplitTotal = payoutParticipants.reduce(
    (sum, participant) => sum + (parseFloat(participant.payoutSplit) || 0),
    0,
  );
  const hasValidParticipantEntries = activeParticipants.every(
    (participant) =>
      !participant.resolving &&
      !participant.resolveError &&
      (!!participant.walletAddress || !!participant.resolvedUser),
  );
  const hasValidSplitConfiguration =
    totalAmount <= 0 ||
    payoutParticipants.length === 0 ||
    (payoutParticipants.every(
      (participant) =>
        participant.payoutSplit.trim() !== "" &&
        !Number.isNaN(parseFloat(participant.payoutSplit)),
    ) &&
      Math.abs(payoutSplitTotal - 100) < 0.001);
  const primaryParticipant = activeParticipants.find((participant) =>
    isSplitEligible(participant.role),
  );
  const contractorLabel = getContractorLabel({
    resolvedUser: supportsMultiPartyContracts
      ? primaryParticipant?.resolvedUser ?? null
      : resolvedUser,
    contractorInput: supportsMultiPartyContracts
      ? primaryParticipant?.identifier ?? ""
      : contractorInput,
    contractorWallet: supportsMultiPartyContracts
      ? primaryParticipant?.walletAddress ?? ""
      : contractorWallet,
  });

  const renderedLegalTextBase = currentTemplate.renderLegalText(
    templateValues,
    {
      contractTitle: title.trim() || currentTemplate.title,
      effectiveDate,
      endDate: endDate || undefined,
      clientLabel,
      contractorLabel,
      currency: "USDC",
      totalAmount,
      additionalContext: businessContext,
    },
    validMilestones,
  );
  const renderedLegalText = `${renderedLegalTextBase}${supportsMultiPartyContracts ? buildParticipantsAppendix({
    clientLabel,
    participants,
    totalAmount,
  }) : ""}`;

  const missingRequiredFields = currentTemplate.fields.some(
    (field) => field.required && !templateValues[field.name]?.trim(),
  );
  const hasValidMilestones =
    milestones.length > 0 &&
    milestones.every(
      (milestone) =>
        milestone.title.trim() &&
        milestone.amount.trim() !== "" &&
        !Number.isNaN(parseFloat(milestone.amount)),
    );
  const canContinueFromDetails =
    title.trim() &&
    effectiveDate &&
    !missingRequiredFields &&
    (supportsMultiPartyContracts
      ? hasValidParticipantEntries && hasValidSplitConfiguration
      : (!contractorInput.trim() || (!!contractorWallet && !resolveError && !resolving)));
  const canSubmit =
    !!title.trim() &&
    !!effectiveDate &&
    !missingRequiredFields &&
    hasValidMilestones &&
    (supportsMultiPartyContracts
      ? hasValidParticipantEntries && hasValidSplitConfiguration
      : (!contractorInput.trim() || (!!contractorWallet && !resolveError && !resolving)));

  const handleCreate = async () => {
    if (!canSubmit) return;

    try {
      const participantPayload = supportsMultiPartyContracts
        ? activeParticipants.map((participant) => ({
            role: participant.role,
            wallet_address: participant.walletAddress || undefined,
            username: participant.resolvedUser?.username
              ?? (participant.identifier.trim().startsWith("@")
                ? normalizeUsername(participant.identifier)
                : undefined),
            payout_split: isSplitEligible(participant.role)
              ? parseFloat(participant.payoutSplit) || 0
              : undefined,
          }))
        : undefined;

      const contract = await createMutation.mutateAsync({
        title: title.trim(),
        description: renderedLegalText,
        contractor_wallet: supportsMultiPartyContracts
          ? primaryParticipant?.walletAddress || undefined
          : contractorWallet || undefined,
        participants: participantPayload,
        total_amount: totalAmount,
        currency: "USDC",
        start_date: effectiveDate || undefined,
        end_date: endDate || undefined,
        milestones: validMilestones.map((milestone) => ({
          title: milestone.title,
          amount: milestone.amount,
        })),
      });

      downloadContractPdf({
        title: title.trim(),
        effectiveDate,
        clientLabel,
        contractorLabel,
        bodyText: renderedLegalText,
        milestones: validMilestones,
        totalAmount,
        currency: "USDC",
      });

      navigate(
        totalAmount > 0
          ? `/dashboard/contracts/${contract.id}?focus=fund`
          : `/dashboard/contracts/${contract.id}`,
      );
    } catch {
      // Mutation error state is rendered below the CTA.
    }
  };

  const finalCtaLabel =
    totalAmount > 0 ? "Create Contract + Deploy" : "Create Contract + Download PDF";

  return (
    <div ref={ref} className="space-y-6 max-w-5xl mx-auto">
      <Link
        to="/dashboard/contracts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-[hsl(230,20%,90%)] rounded-full px-4 py-2 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="space-y-2">
        <h1
          className={`text-2xl font-medium text-foreground ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          Contract Templates Library
        </h1>
        <p
          className={`text-sm text-muted-foreground ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.12s" }}
        >
          Pick a starter agreement, fill the variables, and launch directly into Ricardian&apos;s live contract flow.
        </p>
      </div>

      <div
        className={`bg-white dark:bg-[hsl(220,18%,10%)] rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "0.15s" }}
      >
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {steps.map((stepLabel, index) => (
            <div key={stepLabel} className="flex items-center min-w-fit">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    index <= step
                      ? "bg-emerald-500 text-white"
                      : "bg-[hsl(230,25%,94%)] text-muted-foreground"
                  }`}
                >
                  {index < step ? <Check size={14} /> : index + 1}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1.5">{stepLabel}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 sm:w-16 h-px bg-[hsl(230,20%,90%)] mx-2" />
              )}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose the agreement that best matches the relationship you want to launch.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templateLibrary.map((template) => (
                <button
                  key={template.slug}
                  type="button"
                  onClick={() => setSelectedTemplateSlug(template.slug)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    selectedTemplateSlug === template.slug
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-[hsl(230,20%,92%)] dark:border-[hsl(220,15%,20%)] hover:border-[hsl(230,20%,85%)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-700">
                      {template.category}
                    </span>
                    {selectedTemplateSlug === template.slug && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                        <CheckCircle size={12} /> Selected
                      </span>
                    )}
                  </div>
                  <p className="text-base font-medium text-foreground">{template.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.shortDescription}
                  </p>
                  <p className="text-xs text-muted-foreground/80 mt-3 leading-relaxed">
                    {template.longDescription}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="contract-title" className="text-xs text-muted-foreground mb-1.5 block">
                    Contract Title
                  </label>
                  <input
                    id="contract-title"
                    type="text"
                    placeholder={`e.g. ${currentTemplate.title} for Product Launch`}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-4 py-2.5 text-sm text-foreground bg-white dark:bg-[hsl(220,18%,13%)] outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
                  />
                </div>

                <div>
                  <label htmlFor="effective-date" className="text-xs text-muted-foreground mb-1.5 block">
                    Effective Date
                  </label>
                  <input
                    id="effective-date"
                    type="date"
                    value={effectiveDate}
                    onChange={(event) => setEffectiveDate(event.target.value)}
                    className="w-full border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-4 py-2.5 text-sm text-foreground bg-white dark:bg-[hsl(220,18%,13%)] outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
                  />
                </div>

                <div>
                  <label htmlFor="end-date" className="text-xs text-muted-foreground mb-1.5 block">
                    End Date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="w-full border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-4 py-2.5 text-sm text-foreground bg-white dark:bg-[hsl(220,18%,13%)] outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
                  />
                </div>
              </div>

              {supportsMultiPartyContracts ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Participants</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep yourself locked as the client, then add payout participants, reviewers, or observers. Splits are stored now and anything beyond the primary contractor settles manually for this release.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[hsl(230,20%,92%)] bg-[hsl(230,25%,97%)] px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)_140px] gap-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">Role</p>
                        <p className="text-sm font-medium text-foreground mt-2">Client</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">Participant</p>
                        <p className="text-sm font-medium text-foreground mt-2">{clientLabel}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.12em]">Payout Split</p>
                        <p className="text-sm font-medium text-muted-foreground mt-2">Not applicable</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {participants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="rounded-2xl border border-[hsl(230,20%,92%)] bg-[hsl(230,25%,97%)] px-4 py-4"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-[140px_minmax(0,1fr)_140px_auto] gap-3">
                          <div>
                            <label
                              htmlFor={`participant-role-${participant.id}`}
                              className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] mb-1.5 block"
                            >
                              Participant {index + 1} Role
                            </label>
                            <select
                              id={`participant-role-${participant.id}`}
                              value={participant.role}
                              onChange={(event) => {
                                const nextRole = event.target.value as ContractParticipantRole;
                                updateParticipant(participant.id, (current) => ({
                                  ...current,
                                  role: nextRole,
                                  payoutSplit: isSplitEligible(nextRole)
                                    ? current.payoutSplit || "0"
                                    : "0",
                                }));
                              }}
                              className="w-full border border-[hsl(230,20%,90%)] rounded-xl px-3 py-2.5 text-sm text-foreground bg-white outline-none focus:ring-2 focus:ring-emerald-500/30"
                            >
                              {participantRoleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor={`participant-input-${participant.id}`}
                              className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] mb-1.5 block"
                            >
                              Participant {index + 1} {supportsUserResolution ? "(wallet address or @username)" : "wallet address"}
                            </label>
                            <div className="relative">
                              <input
                                id={`participant-input-${participant.id}`}
                                type="text"
                                placeholder={supportsUserResolution ? "0x... or @username" : "0x..."}
                                value={participant.identifier}
                                onChange={(event) =>
                                  updateParticipant(participant.id, (current) => ({
                                    ...current,
                                    identifier: event.target.value,
                                    walletAddress: "",
                                    resolvedUser: null,
                                    resolveError: null,
                                  }))
                                }
                                onBlur={() => void handleParticipantBlur(participant.id)}
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white outline-none focus:ring-2 transition-shadow pr-10 ${
                                  participant.resolveError
                                    ? "border-red-300 focus:ring-red-500/30"
                                    : participant.resolvedUser
                                    ? "border-emerald-300 focus:ring-emerald-500/30"
                                    : "border-[hsl(230,20%,90%)] focus:ring-emerald-500/30"
                                }`}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {participant.resolving && (
                                  <Loader2 size={16} className="text-muted-foreground animate-spin" />
                                )}
                                {!participant.resolving && participant.resolvedUser && (
                                  <CheckCircle size={16} className="text-emerald-500" />
                                )}
                                {!participant.resolving && participant.resolveError && (
                                  <XCircle size={16} className="text-red-400" />
                                )}
                              </div>
                            </div>
                            {participant.resolvedUser && (
                              <p className="text-[10px] text-emerald-600 mt-1">
                                Resolved to {participant.resolvedUser.username ? `@${participant.resolvedUser.username}` : "user"}
                                {participant.resolvedUser.walletAddress
                                  ? ` — ${participant.resolvedUser.walletAddress.slice(0, 6)}...${participant.resolvedUser.walletAddress.slice(-4)}`
                                  : " — wallet optional for this participant"}
                              </p>
                            )}
                            {participant.resolveError && (
                              <p className="text-[10px] text-red-500 mt-1">{participant.resolveError}</p>
                            )}
                            {!participant.resolvedUser && !participant.resolveError && !participant.resolving && (
                              <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {supportsUserResolution
                                  ? "Use a Ricardian username or 0x wallet address. Leave blank to remove this row from the contract."
                                  : "Use a 0x wallet address. Leave blank to remove this row from the contract."}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor={`participant-split-${participant.id}`}
                              className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] mb-1.5 block"
                            >
                              Payout Split (%)
                            </label>
                            <input
                              id={`participant-split-${participant.id}`}
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              disabled={!isSplitEligible(participant.role)}
                              value={participant.payoutSplit}
                              onChange={(event) =>
                                updateParticipant(participant.id, (current) => ({
                                  ...current,
                                  payoutSplit: event.target.value,
                                }))
                              }
                              className="w-full border border-[hsl(230,20%,90%)] rounded-xl px-4 py-2.5 text-sm text-foreground bg-white outline-none focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-50"
                            />
                          </div>

                          <div className="flex items-end justify-end">
                            <button
                              type="button"
                              onClick={() => removeParticipant(participant.id)}
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-[hsl(230,20%,88%)] rounded-xl px-3 py-2.5 hover:bg-white transition-colors"
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addParticipant}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground border border-dashed border-[hsl(230,20%,85%)] rounded-xl py-3 hover:bg-[hsl(230,25%,96%)] transition-colors"
                  >
                    <Plus size={14} /> Add Participant
                  </button>

                  {totalAmount > 0 && payoutParticipants.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[hsl(230,20%,92%)] bg-[hsl(230,25%,98%)] px-4 py-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                          Split Total
                        </p>
                        <p className="text-sm font-medium text-foreground mt-1">
                          {payoutSplitTotal.toFixed(2)}%
                        </p>
                      </div>
                      {!hasValidSplitConfiguration && (
                        <p className="text-xs text-red-500">
                          Payout participants must add up to 100%.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label htmlFor="contractor-input" className="text-xs text-muted-foreground mb-1.5 block">
                    {supportsUserResolution
                      ? "Contractor (wallet address or @username)"
                      : "Contractor wallet address"}
                  </label>
                  <div className="relative">
                    <input
                      id="contractor-input"
                      type="text"
                      placeholder={supportsUserResolution ? "0x... or @username" : "0x..."}
                      value={contractorInput}
                      onChange={(event) => {
                        setContractorInput(event.target.value);
                        setResolvedUser(null);
                        setResolveError(null);
                      }}
                      onBlur={handleContractorBlur}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white dark:bg-[hsl(220,18%,13%)] outline-none focus:ring-2 transition-shadow pr-10 ${
                        resolveError
                          ? "border-red-300 focus:ring-red-500/30"
                          : resolvedUser
                          ? "border-emerald-300 focus:ring-emerald-500/30"
                          : "border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] focus:ring-emerald-500/30"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {resolving && <Loader2 size={16} className="text-muted-foreground animate-spin" />}
                      {!resolving && resolvedUser && <CheckCircle size={16} className="text-emerald-500" />}
                      {!resolving && resolveError && <XCircle size={16} className="text-red-400" />}
                    </div>
                  </div>
                  {resolvedUser && (
                    <p className="text-[10px] text-emerald-600 mt-1">
                      Resolved to {resolvedUser.username ? `@${resolvedUser.username}` : "user"} —{" "}
                      {resolvedUser.walletAddress?.slice(0, 6)}...{resolvedUser.walletAddress?.slice(-4)}
                    </p>
                  )}
                  {resolveError && <p className="text-[10px] text-red-500 mt-1">{resolveError}</p>}
                  {!resolvedUser && !resolveError && !resolving && (
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {supportsUserResolution
                        ? "Enter a Ricardian username or 0x wallet address. Leave empty to assign later."
                        : "Enter a 0x wallet address. Leave empty to assign later."}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="business-context" className="text-xs text-muted-foreground mb-1.5 block">
                  Additional Context
                </label>
                <textarea
                  id="business-context"
                  rows={4}
                  placeholder="Add deal context, scope notes, or launch-specific commercial terms."
                  value={businessContext}
                  onChange={(event) => setBusinessContext(event.target.value)}
                  className="w-full border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-4 py-2.5 text-sm text-foreground bg-white dark:bg-[hsl(220,18%,13%)] outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow resize-none"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{currentTemplate.title} Variables</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    These fields drive the legal language, the review preview, and the generated PDF.
                  </p>
                </div>

                {currentTemplate.fields.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={`template-field-${field.name}`} className="text-xs text-muted-foreground mb-1.5 block">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={`template-field-${field.name}`}
                        rows={4}
                        value={templateValues[field.name] ?? ""}
                        placeholder={field.placeholder}
                        onChange={(event) => updateTemplateValue(field.name, event.target.value)}
                        className="w-full border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-4 py-2.5 text-sm text-foreground bg-white dark:bg-[hsl(220,18%,13%)] outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow resize-none"
                      />
                    ) : (
                      <input
                        id={`template-field-${field.name}`}
                        type={fieldInputType(field)}
                        value={templateValues[field.name] ?? ""}
                        placeholder={field.placeholder}
                        onChange={(event) => updateTemplateValue(field.name, event.target.value)}
                        className="w-full border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-4 py-2.5 text-sm text-foreground bg-white dark:bg-[hsl(220,18%,13%)] outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
                      />
                    )}
                    {field.helpText && (
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{field.helpText}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[hsl(230,25%,97%)] dark:bg-[hsl(220,18%,12%)] rounded-2xl p-5 border border-[hsl(230,20%,92%)] dark:border-[hsl(220,15%,20%)] h-fit">
              <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-700 font-medium">
                Live Preview
              </p>
              <p className="text-base font-medium text-foreground mt-2">{currentTemplate.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{currentTemplate.shortDescription}</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Client</span>
                  <span className="text-foreground font-medium text-right">{clientLabel}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    {supportsMultiPartyContracts ? "Primary payee" : "Contractor"}
                  </span>
                  <span className="text-foreground font-medium text-right">{contractorLabel}</span>
                </div>
                {supportsMultiPartyContracts && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Participants</span>
                    <span className="text-foreground font-medium">
                      {activeParticipants.length + 1}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Effective date</span>
                  <span className="text-foreground font-medium">{effectiveDate || "—"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Template fields</span>
                  <span className="text-foreground font-medium">
                    {currentTemplate.fields.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">Milestone Schedule</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Edit the default schedule or add more payout checkpoints before launch.
                </p>
              </div>
              <div className="text-sm font-medium text-foreground">
                Total: {formatCurrency(totalAmount)}
              </div>
            </div>

            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_140px_auto] gap-3 bg-[hsl(230,25%,96%)] dark:bg-[hsl(220,18%,13%)] rounded-xl p-4"
                >
                  <div>
                    <label htmlFor={`milestone-title-${index}`} className="text-[10px] text-muted-foreground mb-1.5 block uppercase tracking-[0.12em]">
                      Milestone Title
                    </label>
                    <input
                      id={`milestone-title-${index}`}
                      type="text"
                      value={milestone.title}
                      onChange={(event) => updateMilestone(milestone.id, "title", event.target.value)}
                      placeholder="Milestone title"
                      className="w-full bg-white dark:bg-[hsl(220,18%,11%)] border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label htmlFor={`milestone-amount-${index}`} className="text-[10px] text-muted-foreground mb-1.5 block uppercase tracking-[0.12em]">
                      Amount (USDC)
                    </label>
                    <input
                      id={`milestone-amount-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={milestone.amount}
                      onChange={(event) => updateMilestone(milestone.id, "amount", event.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white dark:bg-[hsl(220,18%,11%)] border border-[hsl(230,20%,90%)] dark:border-[hsl(220,15%,25%)] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      disabled={milestones.length === 1}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border border-[hsl(230,20%,88%)] rounded-xl px-3 py-2.5 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMilestone}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground border border-dashed border-[hsl(230,20%,85%)] dark:border-[hsl(220,15%,25%)] rounded-xl py-3 hover:bg-[hsl(230,25%,96%)] dark:hover:bg-[hsl(220,18%,13%)] transition-colors"
            >
              <Plus size={14} /> Add Milestone
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
            <div className="bg-[hsl(230,25%,97%)] dark:bg-[hsl(220,18%,12%)] rounded-2xl p-5 border border-[hsl(230,20%,92%)] dark:border-[hsl(220,15%,20%)] h-fit">
              <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-700 font-medium">
                Launch Summary
              </p>
              <div className="space-y-3 text-sm mt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Template</span>
                  <span className="text-foreground font-medium text-right">{currentTemplate.title}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Contract title</span>
                  <span className="text-foreground font-medium text-right">{title || "—"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    {supportsMultiPartyContracts ? "Primary payee" : "Counterparty"}
                  </span>
                  <span className="text-foreground font-medium text-right">{contractorLabel}</span>
                </div>
                {supportsMultiPartyContracts && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Participants</span>
                    <span className="text-foreground font-medium">
                      {activeParticipants.length + 1}
                    </span>
                  </div>
                )}
                {supportsMultiPartyContracts && totalAmount > 0 && payoutParticipants.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Payout Split</span>
                    <span className="text-foreground font-medium">
                      {payoutSplitTotal.toFixed(2)}%
                    </span>
                  </div>
                )}
                {supportsMultiPartyContracts && payoutParticipants.length > 1 && (
                  <div className="rounded-xl bg-[hsl(40,80%,96%)] px-3 py-3 text-xs text-[hsl(35,70%,32%)]">
                    Additional split participants are recorded now and settle manually beyond the primary contractor escrow path.
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Milestones</span>
                  <span className="text-foreground font-medium">{validMilestones.length}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Contract value</span>
                  <span className="text-foreground font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Next step</span>
                  <span className="text-foreground font-medium text-right">
                    {totalAmount > 0 ? "Create + fund escrow" : "Create + download PDF"}
                  </span>
                </div>
              </div>
              {supportsMultiPartyContracts && activeParticipants.length > 0 && (
                <div className="mt-4 space-y-2 rounded-xl border border-[hsl(230,20%,92%)] bg-white/80 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Participant Roster
                  </p>
                  {activeParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-start justify-between gap-3 text-xs">
                      <div>
                        <p className="font-medium text-foreground">{getParticipantLabel(participant)}</p>
                        <p className="text-muted-foreground">{getParticipantRoleLabel(participant.role)}</p>
                      </div>
                      <span className="text-foreground">
                        {isSplitEligible(participant.role)
                          ? `${(parseFloat(participant.payoutSplit) || 0).toFixed(2)}%`
                          : "No split"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {createMutation.isError && (
                <p className="text-sm text-red-500 mt-4">
                  Failed to create contract. Please try again.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Legal Document Preview</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This exact text will be saved to the contract and used for the generated PDF.
                  </p>
                </div>
                {supportsAiContractReview && (
                  <button
                    type="button"
                    onClick={() =>
                      aiReviewMutation.mutate({
                        text: renderedLegalText,
                        title: title.trim() || undefined,
                      })
                    }
                    disabled={aiReviewMutation.isPending || !renderedLegalText.trim()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-[hsl(265,80%,55%)] text-white px-4 py-2 rounded-full hover:bg-[hsl(265,80%,48%)] hover:shadow-lg hover:shadow-[hsl(265,80%,55%)]/20 transition-all shadow-sm disabled:opacity-50 flex-shrink-0"
                  >
                    {aiReviewMutation.isPending ? (
                      <>
                        <Loader2 size={12} className="animate-spin" /> Reviewing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} /> Review with AI
                      </>
                    )}
                  </button>
                )}
              </div>

              {aiReviewMutation.isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                  AI review failed. Please try again in a moment.
                </div>
              )}

              {aiReviewMutation.data && (
                <div className="rounded-2xl border border-[hsl(265,60%,90%)] bg-[hsl(265,80%,98%)] dark:bg-[hsl(265,30%,12%)] p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[hsl(265,80%,55%)]" />
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(265,70%,40%)]">
                        AI Contract Review
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                        aiReviewMutation.data.overall_risk === "high"
                          ? "bg-red-100 text-red-700"
                          : aiReviewMutation.data.overall_risk === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {aiReviewMutation.data.overall_risk} risk
                    </span>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed">
                    {aiReviewMutation.data.summary}
                  </p>

                  {aiReviewMutation.data.flags.length === 0 ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-700">
                      <CheckCircle size={14} /> No issues flagged. This contract looks solid.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {aiReviewMutation.data.flags.map((flag, idx) => (
                        <div
                          key={idx}
                          className={`rounded-xl border px-4 py-3 ${
                            flag.severity === "critical"
                              ? "border-red-200 bg-red-50"
                              : flag.severity === "warning"
                              ? "border-amber-200 bg-amber-50"
                              : "border-[hsl(230,20%,90%)] bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle
                              size={14}
                              className={`mt-0.5 flex-shrink-0 ${
                                flag.severity === "critical"
                                  ? "text-red-600"
                                  : flag.severity === "warning"
                                  ? "text-amber-600"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <div className="space-y-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground">
                                {flag.clause}
                              </p>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {flag.issue}
                              </p>
                              <p className="text-xs text-foreground leading-relaxed">
                                <span className="font-medium">Suggestion: </span>
                                {flag.suggestion}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground">
                    Generated by {aiReviewMutation.data.model}. AI review is advisory — always have legal counsel review high-value contracts.
                  </p>
                </div>
              )}

              <div className="border border-[hsl(230,20%,92%)] rounded-2xl p-6 max-h-[560px] overflow-y-auto bg-[hsl(230,25%,98%)] dark:bg-[hsl(220,18%,12%)]">
                <pre className="whitespace-pre-wrap text-sm text-foreground leading-7 font-sans">
                  {renderedLegalText}
                </pre>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-[hsl(230,20%,94%)] dark:border-[hsl(220,15%,20%)]">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`inline-flex items-center gap-1.5 text-sm font-medium border border-[hsl(230,20%,90%)] text-muted-foreground px-5 py-2.5 rounded-full hover:bg-[hsl(230,25%,96%)] transition-colors ${
              step === 0 ? "invisible" : ""
            }`}
          >
            <ArrowLeft size={14} /> Back
          </button>

          {step === steps.length - 1 ? (
            <button
              type="button"
              onClick={handleCreate}
              disabled={createMutation.isPending || !canSubmit}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-emerald-500 text-white px-5 py-2.5 rounded-full hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all shadow-sm disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : finalCtaLabel} <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={(step === 1 && !canContinueFromDetails) || (step === 2 && !hasValidMilestones)}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-emerald-500 text-white px-5 py-2.5 rounded-full hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all shadow-sm disabled:opacity-50"
            >
              Next <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateContract;
