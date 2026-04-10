import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Loader2,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useCreateContract } from "@/hooks/api/useContracts";
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

const steps = ["Template", "Details", "Milestones", "Review"];

interface EditableMilestone {
  id: string;
  title: string;
  amount: string;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function createMilestoneId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `milestone-${Math.random().toString(36).slice(2, 10)}`;
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
  resolvedUser: ResolvedUser | null;
  contractorInput: string;
  contractorWallet: string;
}): string {
  if (args.resolvedUser?.display_name) return args.resolvedUser.display_name;
  if (args.resolvedUser?.username) return `@${args.resolvedUser.username}`;

  const raw = args.contractorInput.trim() || args.contractorWallet.trim();
  if (!raw) return "Unassigned Contractor";
  if (raw.startsWith("0x") && raw.length > 10) {
    return `${raw.slice(0, 6)}...${raw.slice(-4)}`;
  }
  return raw.startsWith("@") ? raw : raw;
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
  const [milestones, setMilestones] = useState<EditableMilestone[]>(
    getTemplateMilestones(templateLibrary[0]),
  );

  const currentTemplate = getTemplateBySlug(selectedTemplateSlug);
  const { ref, isInView } = useInViewAnimation();
  const navigate = useNavigate();
  const createMutation = useCreateContract();
  const { user } = useWallet();

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

    const normalized = input.startsWith("@") ? input.slice(1) : input;
    const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(normalized);
    const isUsername = /^[a-zA-Z0-9_-]{3,30}$/.test(normalized);

    if (!isEthAddress && !isUsername) {
      setResolveError("Enter a valid wallet address (0x...) or username");
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
        setContractorWallet(
          isEthAddress
            ? normalized
            : `@${userResult.username || normalized}`,
        );
      }
    } catch {
      if (isEthAddress) {
        setContractorWallet(normalized);
        setResolvedUser(null);
        setResolveError(null);
      } else {
        setResolveError("Username not found on Ricardian");
        setContractorWallet("");
      }
    } finally {
      setResolving(false);
    }
  }, [contractorInput]);

  const updateTemplateValue = (name: string, value: string) => {
    setTemplateValues((current) => ({ ...current, [name]: value }));
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
  const contractorLabel = getContractorLabel({
    resolvedUser,
    contractorInput,
    contractorWallet,
  });

  const renderedLegalText = currentTemplate.renderLegalText(
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
    title.trim() && effectiveDate && !missingRequiredFields;
  const canSubmit = !!title.trim() && !!effectiveDate && !missingRequiredFields && hasValidMilestones;

  const handleCreate = async () => {
    if (!canSubmit) return;

    try {
      const contract = await createMutation.mutateAsync({
        title: title.trim(),
        description: renderedLegalText,
        contractor_wallet: contractorWallet || undefined,
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

              <div>
                <label htmlFor="contractor-input" className="text-xs text-muted-foreground mb-1.5 block">
                  Contractor (wallet address or @username)
                </label>
                <div className="relative">
                  <input
                    id="contractor-input"
                    type="text"
                    placeholder="0x... or @username"
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
                    Enter a Ricardian username or 0x wallet address. Leave empty to assign later.
                  </p>
                )}
              </div>

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
                  <span className="text-muted-foreground">Contractor</span>
                  <span className="text-foreground font-medium text-right">{contractorLabel}</span>
                </div>
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
                  <span className="text-muted-foreground">Counterparty</span>
                  <span className="text-foreground font-medium text-right">{contractorLabel}</span>
                </div>
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
              {createMutation.isError && (
                <p className="text-sm text-red-500 mt-4">
                  Failed to create contract. Please try again.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">Legal Document Preview</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This exact text will be saved to the contract and used for the generated PDF.
                </p>
              </div>
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
