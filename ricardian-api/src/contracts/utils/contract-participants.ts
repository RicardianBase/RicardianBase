import { Contract } from '../entities/contract.entity';
import {
  ContractParticipant,
  ContractParticipantRole,
} from '../entities/contract-participant.entity';

type ParticipantLike = Pick<
  ContractParticipant,
  | 'id'
  | 'user_id'
  | 'role'
  | 'wallet_address'
  | 'username'
  | 'payout_split'
  | 'position'
> & {
  user?: {
    id?: string;
    username?: string | null;
    display_name?: string | null;
  } | null;
};

type ContractWithParticipants = Pick<
  Contract,
  'id' | 'client_id' | 'contractor_id' | 'contractor_wallet' | 'participants'
> & {
  client?: {
    id?: string;
    username?: string | null;
    display_name?: string | null;
  } | null;
  contractor?: {
    id?: string;
    username?: string | null;
    display_name?: string | null;
  } | null;
};

function sortParticipants<T extends ParticipantLike>(participants: T[]): T[] {
  return [...participants].sort((left, right) => left.position - right.position);
}

export function synthesizeLegacyParticipants(
  contract: ContractWithParticipants,
): ParticipantLike[] {
  const participants: ParticipantLike[] = [
    {
      id: `legacy-client-${contract.id}`,
      role: ContractParticipantRole.CLIENT,
      user_id: contract.client_id,
      wallet_address: null,
      username: contract.client?.username ?? null,
      payout_split: null,
      position: 0,
      user: contract.client ?? null,
    },
  ];

  if (contract.contractor_id || contract.contractor_wallet) {
    participants.push({
      id: `legacy-contractor-${contract.id}`,
      role: ContractParticipantRole.CONTRACTOR,
      user_id: contract.contractor_id,
      wallet_address: contract.contractor_wallet,
      username: contract.contractor?.username ?? null,
      payout_split: contract.contractor_id || contract.contractor_wallet ? '100.00' : null,
      position: 1,
      user: contract.contractor ?? null,
    });
  }

  return participants;
}

export function getContractParticipants(
  contract: ContractWithParticipants,
): ParticipantLike[] {
  const participants = contract.participants?.length
    ? contract.participants
    : synthesizeLegacyParticipants(contract);

  return sortParticipants(participants);
}

export function hasContractAccess(
  contract: ContractWithParticipants,
  userId: string,
): boolean {
  if (contract.client_id === userId || contract.contractor_id === userId) {
    return true;
  }

  return getContractParticipants(contract).some(
    (participant) => participant.user_id === userId,
  );
}

export function isClientActor(
  contract: ContractWithParticipants,
  userId: string,
): boolean {
  if (contract.client_id === userId) {
    return true;
  }

  return getContractParticipants(contract).some(
    (participant) =>
      participant.user_id === userId &&
      participant.role === ContractParticipantRole.CLIENT,
  );
}

export function isContractorActor(
  contract: ContractWithParticipants,
  userId: string,
): boolean {
  if (contract.contractor_id === userId) {
    return true;
  }

  return getContractParticipants(contract).some(
    (participant) =>
      participant.user_id === userId &&
      [
        ContractParticipantRole.CONTRACTOR,
        ContractParticipantRole.COLLABORATOR,
      ].includes(participant.role),
  );
}

export function getPrimaryContractorParticipant(
  contract: ContractWithParticipants,
): ParticipantLike | null {
  return (
    getContractParticipants(contract).find(
      (participant) => participant.role === ContractParticipantRole.CONTRACTOR,
    ) ??
    getContractParticipants(contract).find(
      (participant) => participant.role === ContractParticipantRole.COLLABORATOR,
    ) ?? null
  );
}
