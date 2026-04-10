import type { Contract } from '../entities/contract.entity';
import type { Milestone } from '../../milestones/entities/milestone.entity';
import type { User } from '../../users/entities/user.entity';
import { RICARDIAN_JSONLD_CONTEXT } from './context';

const DEFAULT_BASE_URL = 'https://ricardianbase.com';

export interface ContractToJsonLdOptions {
  /**
   * Canonical base URL used for minting stable IRIs (@id values). Defaults to
   * https://ricardianbase.com so that identifiers are globally dereferenceable
   * across environments.
   */
  baseUrl?: string;
}

/**
 * Convert a Ricardian Contract entity (and its loaded relations) into a
 * JSON-LD document.
 *
 * The resulting document is a standalone, self-describing linked-data
 * representation of the contract. Consumers that understand JSON-LD +
 * schema.org + the Ricardian vocabulary can parse it without any custom
 * adapter — enabling cross-platform interop, compliance automation,
 * knowledge-graph ingestion, and agent-driven contract reasoning.
 *
 * This function is pure: it does not read from the database, does not mutate
 * the input, and does not throw. It assumes relations (milestones, client,
 * contractor) are already loaded by the caller — ContractsService.findOne()
 * loads them by default.
 */
export function contractToJsonLd(
  contract: Contract,
  options: ContractToJsonLdOptions = {},
): Record<string, unknown> {
  const base = options.baseUrl ?? DEFAULT_BASE_URL;

  const doc: Record<string, unknown> = {
    '@context': RICARDIAN_JSONLD_CONTEXT,
    '@id': `${base}/contracts/${contract.id}`,
    '@type': 'Contract',
    name: contract.title,
    status: contract.status,
    progress: contract.progress,
    chain: 'base',
    currency: contract.currency,
    totalAmount: {
      '@type': 'MonetaryAmount',
      value: Number(contract.total_amount),
      currency: contract.currency,
    },
    client: partyNode(contract.client, contract.client_id, base),
    milestones: (contract.milestones ?? [])
      .slice()
      .sort((a, b) => a.sequence - b.sequence)
      .map((m) => milestoneNode(m, base)),
    createdAt: toIsoString(contract.created_at),
    updatedAt: toIsoString(contract.updated_at),
  };

  if (contract.description) {
    doc.description = contract.description;
  }

  if (contract.start_date) {
    doc.startDate = contract.start_date;
  }

  if (contract.end_date) {
    doc.endDate = contract.end_date;
  }

  // Contractor may be a fully-joined User, a raw wallet address on a draft,
  // or absent. Emit whichever form we have.
  if (contract.contractor) {
    doc.contractor = partyNode(
      contract.contractor,
      contract.contractor_id!,
      base,
    );
  } else if (contract.contractor_wallet) {
    doc.contractor = {
      '@type': 'Party',
      walletAddress: contract.contractor_wallet,
    };
  }

  return doc;
}

function partyNode(
  user: User | null | undefined,
  userId: string,
  base: string,
): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@id': `${base}/users/${userId}`,
    '@type': 'Party',
  };
  if (user?.display_name) {
    node.name = user.display_name;
  }
  return node;
}

function milestoneNode(
  milestone: Milestone,
  base: string,
): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@id': `${base}/milestones/${milestone.id}`,
    '@type': 'Milestone',
    sequence: milestone.sequence,
    name: milestone.title,
    status: milestone.status,
    amount: {
      '@type': 'MonetaryAmount',
      value: Number(milestone.amount),
    },
  };

  if (milestone.description) {
    node.description = milestone.description;
  }
  if (milestone.due_date) {
    node.dueDate = milestone.due_date;
  }
  if (milestone.submitted_at) {
    node.submittedAt = toIsoString(milestone.submitted_at);
  }
  if (milestone.approved_at) {
    node.approvedAt = toIsoString(milestone.approved_at);
  }
  if (milestone.paid_at) {
    node.paidAt = toIsoString(milestone.paid_at);
  }

  return node;
}

function toIsoString(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}
