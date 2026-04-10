export type TemplateFieldType = "text" | "textarea" | "date" | "number";

export interface TemplateFieldDefinition {
  name: string;
  label: string;
  type: TemplateFieldType;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface TemplateMilestoneDefinition {
  title: string;
  amount: number;
}

export interface RenderMilestoneInput {
  title: string;
  amount: number;
}

export interface RenderContractMeta {
  contractTitle: string;
  effectiveDate?: string;
  endDate?: string;
  clientLabel: string;
  contractorLabel: string;
  currency: string;
  totalAmount: number;
  additionalContext?: string;
}

export type TemplateFormValues = Record<string, string>;

export interface ContractTemplateDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  fields: TemplateFieldDefinition[];
  defaultMilestones: TemplateMilestoneDefinition[];
  renderLegalText: (
    values: TemplateFormValues,
    contractMeta: RenderContractMeta,
    milestones: RenderMilestoneInput[],
  ) => string;
}

function formatDate(value?: string): string {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function readValue(
  values: TemplateFormValues,
  key: string,
  fallback = "",
): string {
  return values[key]?.trim() || fallback;
}

function milestoneSchedule(
  milestones: RenderMilestoneInput[],
  currency: string,
): string {
  if (milestones.length === 0) {
    return "No milestone schedule provided.";
  }

  return milestones
    .map(
      (milestone, index) =>
        `${index + 1}. ${milestone.title} — ${formatMoney(milestone.amount, currency)}`,
    )
    .join("\n");
}

function paymentTerms(meta: RenderContractMeta): string {
  if (meta.totalAmount <= 0) {
    return "This agreement does not require an escrow funding event. The parties acknowledge that the primary obligation under this contract is execution of the document and performance of the non-monetary commitments set out below.";
  }

  return `The Client will fund ${formatMoney(meta.totalAmount, meta.currency)} through Ricardian's contract creation flow. Funds are intended to be held in escrow and released against the milestone schedule below.`;
}

function additionalContext(meta: RenderContractMeta): string {
  if (!meta.additionalContext?.trim()) {
    return "No additional commercial context was provided beyond the template terms below.";
  }

  return meta.additionalContext.trim();
}

function standardHeader(title: string, meta: RenderContractMeta): string {
  return `${title}

Effective Date: ${formatDate(meta.effectiveDate)}
Contract Title: ${meta.contractTitle}
Client: ${meta.clientLabel}
Contractor: ${meta.contractorLabel}
Term End Date: ${formatDate(meta.endDate)}
`;
}

function renderNda(
  values: TemplateFormValues,
  meta: RenderContractMeta,
  milestones: RenderMilestoneInput[],
): string {
  const exclusions = readValue(values, "exclusions")
    ? readValue(values, "exclusions")
    : "information that is public, independently developed, or rightfully received from a third party without confidentiality obligations";

  return `${standardHeader("RICARDIAN NON-DISCLOSURE AGREEMENT", meta)}
1. Purpose
The parties wish to evaluate and discuss ${readValue(values, "confidentialPurpose", "[purpose pending]")} and may disclose confidential information for that limited purpose.

2. Disclosing Party
For launch operations, the parties agree that ${readValue(values, "disclosingParty", "Mutual")} is the primary disclosing party, although either party may disclose confidential information under this agreement.

3. Confidential Information
Confidential information includes non-public business, commercial, technical, financial, product, customer, security, and operational information disclosed in any form and reasonably understood to be confidential.

4. Exclusions
Confidential information does not include ${exclusions}.

5. Use And Protection
The receiving party will use confidential information solely for the purpose stated above, restrict access to personnel with a need to know, and protect the information using at least reasonable care.

6. Confidentiality Period
The receiving party's confidentiality and non-use obligations continue for ${readValue(values, "termMonths", "24")} months from the effective date unless a longer period is required by law.

7. Return Or Destruction
Upon request, the receiving party will promptly return or securely destroy confidential information, subject to ordinary archival backups and legal retention requirements.

8. Governing Law
This agreement is governed by the laws of ${readValue(values, "governingLaw", "the governing jurisdiction selected by the parties")}, without regard to conflict-of-law principles.

9. Additional Context
${additionalContext(meta)}

10. Payment And Execution
${paymentTerms(meta)}

Milestone Schedule
${milestoneSchedule(milestones, meta.currency)}
`;
}

function renderSaas(
  values: TemplateFormValues,
  meta: RenderContractMeta,
  milestones: RenderMilestoneInput[],
): string {
  return `${standardHeader("RICARDIAN SOFTWARE-AS-A-SERVICE AGREEMENT", meta)}
1. Services
The Contractor will provide the following hosted software services to the Client: ${readValue(values, "servicesDescription", "[services description pending]")}.

2. Provider Role
For commercial clarity, the service provider named in this agreement is ${readValue(values, "providerName", "the Contractor")}.

3. Subscription Term
The initial subscription term is ${readValue(values, "subscriptionTerm", "12 months")}, beginning on the effective date unless otherwise stated in writing by the parties.

4. Service Levels And Support
The Contractor will provide the following support commitment: ${readValue(values, "supportWindow", "[support commitment pending]")}.

5. Customer Data
The parties agree that customer and usage data will be stored and processed primarily in ${readValue(values, "dataRegion", "the agreed operating region")}, subject to lawful operational requirements and security practices.

6. Fees And Payment
${paymentTerms(meta)}

7. Acceptable Use And Security
The Client will use the service only for lawful business purposes. The Contractor will maintain commercially reasonable safeguards designed to protect service availability and customer data.

8. Suspension And Termination
Either party may suspend or terminate for material breach if the breach remains uncured after reasonable written notice.

9. Governing Law
This agreement is governed by the laws of ${readValue(values, "governingLaw", "the governing jurisdiction selected by the parties")}.

10. Additional Context
${additionalContext(meta)}

Milestone Schedule
${milestoneSchedule(milestones, meta.currency)}
`;
}

function renderIpAssignment(
  values: TemplateFormValues,
  meta: RenderContractMeta,
  milestones: RenderMilestoneInput[],
): string {
  return `${standardHeader("RICARDIAN INTELLECTUAL PROPERTY ASSIGNMENT", meta)}
1. Assigned Work
The Contractor assigns to the Client all right, title, and interest in and to the following work product, inventions, materials, and related intellectual property: ${readValue(values, "assignedWork", "[assigned work pending]")}.

2. Assignor Capacity
The Contractor is acting in the following capacity with respect to the assigned work: ${readValue(values, "assignorCapacity", "Independent contractor")}.

3. Consideration
The parties acknowledge the following consideration for the assignment: ${readValue(values, "consideration", "[consideration pending]")}.

4. Further Assurances
The Contractor will execute reasonable further documents and provide reasonable cooperation needed to confirm, perfect, or enforce the Client's ownership rights.

5. Moral Rights And Waivers
To the extent permitted by law, the Contractor waives moral rights and similar claims that would interfere with the Client's full enjoyment of the assigned rights.

6. Payment And Completion
${paymentTerms(meta)}

7. Governing Law
This assignment is governed by the laws of ${readValue(values, "governingLaw", "the governing jurisdiction selected by the parties")}.

8. Additional Context
${additionalContext(meta)}

Milestone Schedule
${milestoneSchedule(milestones, meta.currency)}
`;
}

function renderConsultingRetainer(
  values: TemplateFormValues,
  meta: RenderContractMeta,
  milestones: RenderMilestoneInput[],
): string {
  return `${standardHeader("RICARDIAN CONSULTING RETAINER AGREEMENT", meta)}
1. Services
The Contractor will provide the following consulting services on an ongoing retainer basis: ${readValue(values, "servicesDescription", "[services description pending]")}.

2. Billing Cadence
Retainer billing and milestone cadence will follow ${readValue(values, "billingCadence", "the agreed recurring cadence")} unless adjusted in a mutually signed amendment.

3. Response Expectations
The Contractor will target the following response or turnaround expectation: ${readValue(values, "responseTime", "[response expectation pending]")}.

4. Relationship Of The Parties
The Contractor remains an independent contractor and is solely responsible for taxes, staffing, tools, and methods used to perform the services.

5. Payment
${paymentTerms(meta)}

6. Deliverables And Reviews
The Client will review deliverables in good faith and approve or request changes through the Ricardian workflow.

7. Governing Law
This agreement is governed by the laws of ${readValue(values, "governingLaw", "the governing jurisdiction selected by the parties")}.

8. Additional Context
${additionalContext(meta)}

Milestone Schedule
${milestoneSchedule(milestones, meta.currency)}
`;
}

function renderSubcontractor(
  values: TemplateFormValues,
  meta: RenderContractMeta,
  milestones: RenderMilestoneInput[],
): string {
  return `${standardHeader("RICARDIAN SUBCONTRACTOR AGREEMENT", meta)}
1. Prime Engagement
The Client is engaging the Contractor as a subcontractor in connection with work being delivered to ${readValue(values, "primeClientName", "[prime client pending]")}.

2. Scope Of Services
The subcontracted services are: ${readValue(values, "servicesDescription", "[services description pending]")}.

3. Delivery Standard
The Contractor will perform the services in accordance with the following delivery standard: ${readValue(values, "deliveryStandard", "[delivery standard pending]")}.

4. Compliance With Upstream Obligations
The Contractor will perform the services in a manner consistent with any flow-down obligations that the Client communicates in writing and that are reasonably applicable to the subcontracted work.

5. Payment
${paymentTerms(meta)}

6. Ownership And Confidentiality
Work product created under this agreement will belong to the Client or the Client's upstream customer as required by the prime engagement, and confidentiality obligations apply to all non-public project information.

7. Governing Law
This agreement is governed by the laws of ${readValue(values, "governingLaw", "the governing jurisdiction selected by the parties")}.

8. Additional Context
${additionalContext(meta)}

Milestone Schedule
${milestoneSchedule(milestones, meta.currency)}
`;
}

export function getInitialTemplateValues(
  fields: TemplateFieldDefinition[],
): TemplateFormValues {
  return fields.reduce<TemplateFormValues>((acc, field) => {
    acc[field.name] = field.defaultValue ?? "";
    return acc;
  }, {});
}

export function getTemplateBySlug(slug: string): ContractTemplateDefinition {
  return (
    templateLibrary.find((template) => template.slug === slug) ??
    templateLibrary[0]
  );
}

export const templateLibrary: ContractTemplateDefinition[] = [
  {
    slug: "nda",
    title: "NDA",
    shortDescription: "Protect confidential discussions before work begins.",
    longDescription:
      "A mutual confidentiality agreement for diligence, product sharing, and pre-project discussions.",
    category: "Pre-engagement",
    fields: [
      {
        name: "disclosingParty",
        label: "Primary disclosing party",
        type: "text",
        placeholder: "Client, Contractor, or Mutual",
        required: true,
        defaultValue: "Mutual",
      },
      {
        name: "confidentialPurpose",
        label: "Purpose of disclosure",
        type: "textarea",
        placeholder: "Evaluating a software integration and commercial relationship",
        required: true,
      },
      {
        name: "termMonths",
        label: "Confidentiality term (months)",
        type: "number",
        placeholder: "24",
        required: true,
        defaultValue: "24",
      },
      {
        name: "exclusions",
        label: "Exclusions",
        type: "textarea",
        placeholder: "Public information, independently developed materials, third-party disclosures",
      },
      {
        name: "governingLaw",
        label: "Governing law",
        type: "text",
        placeholder: "Ontario, Canada",
        required: true,
        defaultValue: "Ontario, Canada",
      },
    ],
    defaultMilestones: [{ title: "Agreement Execution", amount: 0 }],
    renderLegalText: renderNda,
  },
  {
    slug: "saas-agreement",
    title: "SaaS Agreement",
    shortDescription: "Launch software subscriptions with clear service terms.",
    longDescription:
      "A starter hosted software agreement covering services, support, customer data, and subscription obligations.",
    category: "Revenue",
    fields: [
      {
        name: "providerName",
        label: "Service provider name",
        type: "text",
        placeholder: "Ricardian Labs Inc.",
        required: true,
      },
      {
        name: "servicesDescription",
        label: "Services description",
        type: "textarea",
        placeholder: "Hosted contract management platform with escrow and milestone approvals",
        required: true,
      },
      {
        name: "subscriptionTerm",
        label: "Initial subscription term",
        type: "text",
        placeholder: "12 months",
        required: true,
        defaultValue: "12 months",
      },
      {
        name: "supportWindow",
        label: "Support commitment",
        type: "text",
        placeholder: "Business-day email support with 1 business day initial response",
        required: true,
      },
      {
        name: "dataRegion",
        label: "Primary data region",
        type: "text",
        placeholder: "North America",
        required: true,
        defaultValue: "North America",
      },
      {
        name: "governingLaw",
        label: "Governing law",
        type: "text",
        placeholder: "Delaware, USA",
        required: true,
        defaultValue: "Delaware, USA",
      },
    ],
    defaultMilestones: [{ title: "Service Commencement", amount: 0 }],
    renderLegalText: renderSaas,
  },
  {
    slug: "ip-assignment",
    title: "IP Assignment",
    shortDescription: "Assign ownership of inventions, code, and deliverables.",
    longDescription:
      "A direct assignment document for transferring ownership of specified intellectual property to the client.",
    category: "Ownership",
    fields: [
      {
        name: "assignedWork",
        label: "Assigned work",
        type: "textarea",
        placeholder: "All source code, product designs, documentation, and related inventions created for the project",
        required: true,
      },
      {
        name: "assignorCapacity",
        label: "Assignor capacity",
        type: "text",
        placeholder: "Independent contractor",
        required: true,
        defaultValue: "Independent contractor",
      },
      {
        name: "consideration",
        label: "Consideration",
        type: "text",
        placeholder: "Payment under the consulting agreement and other good and valuable consideration",
        required: true,
      },
      {
        name: "governingLaw",
        label: "Governing law",
        type: "text",
        placeholder: "California, USA",
        required: true,
        defaultValue: "California, USA",
      },
    ],
    defaultMilestones: [{ title: "Assignment Delivery", amount: 0 }],
    renderLegalText: renderIpAssignment,
  },
  {
    slug: "consulting-retainer",
    title: "Consulting Retainer",
    shortDescription: "Set ongoing advisory or execution work on a recurring basis.",
    longDescription:
      "A retainer-style consulting agreement for recurring work, review cycles, and staged payments.",
    category: "Services",
    fields: [
      {
        name: "servicesDescription",
        label: "Services description",
        type: "textarea",
        placeholder: "Product strategy, technical planning, and weekly implementation support",
        required: true,
      },
      {
        name: "billingCadence",
        label: "Billing cadence",
        type: "text",
        placeholder: "Monthly in advance",
        required: true,
        defaultValue: "Monthly in advance",
      },
      {
        name: "responseTime",
        label: "Response expectation",
        type: "text",
        placeholder: "Within 1 business day for standard requests",
        required: true,
      },
      {
        name: "governingLaw",
        label: "Governing law",
        type: "text",
        placeholder: "New York, USA",
        required: true,
        defaultValue: "New York, USA",
      },
    ],
    defaultMilestones: [{ title: "Initial Retainer Period", amount: 0 }],
    renderLegalText: renderConsultingRetainer,
  },
  {
    slug: "subcontractor-agreement",
    title: "Subcontractor Agreement",
    shortDescription: "Pass through project work to a subcontracted operator.",
    longDescription:
      "A services agreement for subcontracted delivery under a broader client engagement, with flow-down expectations.",
    category: "Delivery",
    fields: [
      {
        name: "primeClientName",
        label: "Prime client name",
        type: "text",
        placeholder: "Acme Corp.",
        required: true,
      },
      {
        name: "servicesDescription",
        label: "Subcontracted services",
        type: "textarea",
        placeholder: "Frontend implementation, QA support, and release readiness work",
        required: true,
      },
      {
        name: "deliveryStandard",
        label: "Delivery standard",
        type: "text",
        placeholder: "Commercially reasonable professional standards and project specifications",
        required: true,
      },
      {
        name: "governingLaw",
        label: "Governing law",
        type: "text",
        placeholder: "Texas, USA",
        required: true,
        defaultValue: "Texas, USA",
      },
    ],
    defaultMilestones: [{ title: "Initial Scope Delivery", amount: 0 }],
    renderLegalText: renderSubcontractor,
  },
];
