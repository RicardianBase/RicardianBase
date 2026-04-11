import { Contract } from '../entities/contract.entity';
import {
  ContractParticipantRole,
} from '../entities/contract-participant.entity';
import { getContractParticipants } from '../utils/contract-participants';

export function toContractJsonLd(contract: Contract) {
  const participants = getContractParticipants(contract);
  const payoutParticipants = participants.filter((participant) =>
    [
      ContractParticipantRole.CONTRACTOR,
      ContractParticipantRole.COLLABORATOR,
    ].includes(participant.role),
  );

  return {
    '@context': {
      '@vocab': 'https://schema.org/',
      ric: 'https://ricardian.app/ns#',
      participants: 'ric:participants',
      payoutSplit: 'ric:payoutSplit',
      walletAddress: 'ric:walletAddress',
      username: 'ric:username',
      role: 'ric:role',
      milestones: 'ric:milestones',
    },
    '@type': 'DigitalDocument',
    '@id': `urn:ricardian:contract:${contract.id}`,
    identifier: contract.id,
    name: contract.title,
    description: contract.description,
    dateCreated: contract.created_at,
    dateModified: contract.updated_at,
    startDate: contract.start_date,
    endDate: contract.end_date,
    additionalType: 'https://ricardian.app/ns#RicardianContract',
    category: contract.status,
    totalPaymentDue: {
      '@type': 'MonetaryAmount',
      currency: contract.currency,
      value: contract.total_amount,
    },
    participants: participants.map((participant) => ({
      '@type': 'Person',
      identifier: participant.user_id ?? participant.wallet_address ?? participant.id,
      roleName: participant.role,
      name:
        participant.user?.display_name ??
        (participant.username ? `@${participant.username}` : null),
      username: participant.username,
      walletAddress: participant.wallet_address,
      payoutSplit: participant.payout_split,
    })),
    milestones: (contract.milestones ?? []).map((milestone) => ({
      '@type': 'Intangible',
      identifier: milestone.id,
      name: milestone.title,
      description: milestone.description,
      amount: {
        '@type': 'MonetaryAmount',
        currency: contract.currency,
        value: milestone.amount,
      },
      position: milestone.sequence,
      status: milestone.status,
    })),
    potentialAction:
      payoutParticipants.length > 1
        ? {
            '@type': 'Action',
            name: 'Manual payout split execution required',
            description:
              'This release stores multi-party payout splits for read surfaces while escrow execution remains manual beyond the primary contractor payout.',
          }
        : null,
  };
}
