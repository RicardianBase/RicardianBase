import { Contract } from '../entities/contract.entity';
import {
  ContractParticipantRole,
} from '../entities/contract-participant.entity';
import {
  getContractParticipants,
  getPrimaryContractorParticipant,
} from '../utils/contract-participants';

export function toContractMcpReadModel(contract: Contract) {
  const participants = getContractParticipants(contract);
  const payoutParticipants = participants.filter((participant) =>
    [
      ContractParticipantRole.CONTRACTOR,
      ContractParticipantRole.COLLABORATOR,
    ].includes(participant.role),
  );
  const primaryContractor = getPrimaryContractorParticipant(contract);

  return {
    kind: 'ricardian.contract',
    id: contract.id,
    title: contract.title,
    status: contract.status,
    description: contract.description,
    total_amount: contract.total_amount,
    currency: contract.currency,
    start_date: contract.start_date,
    end_date: contract.end_date,
    legacy: {
      client_id: contract.client_id,
      contractor_id: contract.contractor_id,
      contractor_wallet: contract.contractor_wallet,
    },
    participants: participants.map((participant) => ({
      id: participant.id,
      role: participant.role,
      user_id: participant.user_id,
      username: participant.username,
      display_name: participant.user?.display_name ?? null,
      wallet_address: participant.wallet_address,
      payout_split: participant.payout_split,
      position: participant.position,
    })),
    milestones: (contract.milestones ?? []).map((milestone) => ({
      id: milestone.id,
      sequence: milestone.sequence,
      title: milestone.title,
      amount: milestone.amount,
      status: milestone.status,
      due_date: milestone.due_date,
    })),
    payout_execution: {
      mode: payoutParticipants.length > 1 ? 'manual_fallback' : 'legacy_primary',
      primary_contractor_user_id: primaryContractor?.user_id ?? null,
      primary_contractor_wallet: primaryContractor?.wallet_address ?? null,
      notes:
        payoutParticipants.length > 1
          ? 'Stored splits are returned for MCP/manual operators, while automated escrow execution continues to follow the primary contractor compatibility path.'
          : 'Automated escrow continues to use the legacy primary contractor path.',
    },
  };
}
