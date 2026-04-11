import client from "./client";

export interface BackendFeatures {
  usernames?: boolean;
  user_resolution?: boolean;
  multi_party_contracts?: boolean;
  contract_jsonld?: boolean;
  contract_mcp_manual_fallback?: boolean;
  ai_contract_review?: boolean;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  features?: BackendFeatures;
}

export const getHealth = () =>
  client.get<{ data: HealthStatus }>("/health").then((response) => response.data.data);
