// ── User & Auth ──

export interface User {
  id: string;
  username: string | null;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: 'company_admin' | 'contractor' | 'platform_admin';
  notification_prefs: Record<string, boolean>;
  created_at: string;
  updated_at: string;
  wallets?: WalletAddress[];
}

export interface WalletAddress {
  id: string;
  address: string;
  provider: 'phantom' | 'metamask' | 'coinbase';
  chain: 'solana' | 'ethereum';
  is_primary: boolean;
  created_at: string;
}

export interface AuthUser {
  id: string;
  username: string | null;
  display_name: string | null;
  role: string;
  walletAddress: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: AuthUser;
}

// ── Contracts ──

export type ContractStatus =
  | 'draft'
  | 'active'
  | 'in_review'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface Contract {
  id: string;
  title: string;
  description: string | null;
  template_id: string | null;
  client_id: string;
  contractor_id: string | null;
  contractor_wallet: string | null;
  status: ContractStatus;
  total_amount: string;
  currency: string;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
  client?: User;
  contractor?: User | null;
}

// ── Milestones ──

export type MilestoneStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'paid';

export interface Milestone {
  id: string;
  contract_id: string;
  sequence: number;
  title: string;
  description: string | null;
  amount: string;
  status: MilestoneStatus;
  due_date: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  paid_at: string | null;
  submission_note: string | null;
  submission_files: { name: string; type: string; size: number; url: string }[];
  created_at: string;
  updated_at: string;
}

// ── Disputes ──

export type DisputeStatus =
  | 'under_review'
  | 'evidence_required'
  | 'resolved'
  | 'escalated';

export interface Dispute {
  id: string;
  contract_id: string;
  milestone_id: string | null;
  initiated_by: string;
  title: string;
  description: string | null;
  status: DisputeStatus;
  amount_locked: string | null;
  created_at: string;
  updated_at: string;
}

// ── Wallet & Transactions ──

export interface WalletBalance {
  token: string;
  balance: string;
  chain: string;
}

export type TransactionType =
  | 'escrow_fund'
  | 'milestone_release'
  | 'deposit'
  | 'withdrawal'
  | 'refund';

export interface Transaction {
  id: string;
  user_id: string;
  contract_id: string | null;
  milestone_id: string | null;
  type: TransactionType;
  direction: 'in' | 'out';
  amount: string;
  currency: string;
  description: string | null;
  tx_hash: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

// ── Dispute Evidence ──

export interface DisputeEvidence {
  id: string;
  dispute_id: string;
  user_id: string;
  content: string;
  attachment_url: string | null;
  created_at: string;
}

// ── API Keys ──

export type ApiKeyScope = 'read' | 'write' | 'payments' | 'disputes' | 'admin';

export interface ApiKeyRecord {
  id: string;
  name: string;
  key_prefix: string;
  scopes: ApiKeyScope[];
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface NewApiKey extends ApiKeyRecord {
  key: string; // Raw key, shown once
}

export interface CreateApiKeyInput {
  name?: string;
  scopes?: ApiKeyScope[];
  expires_in_days?: number | null;
}

// ── Activity ──

export interface ActivityLog {
  id: string;
  user_id: string;
  contract_id: string | null;
  action: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ── Dashboard ──

export interface DashboardStats {
  activeContracts: number;
  totalValue: number;
  pendingReviews: number;
  completedContracts: number;
}

// ── Pagination ──

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}
