/**
 * Shared types for the Ricardian MCP (Model Context Protocol) server.
 *
 * The MCP wire format is JSON-RPC 2.0. We implement the subset required to
 * expose tools to agent clients (initialize, tools/list, tools/call, ping).
 */

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcErrorBody {
  code: number;
  message: string;
  data?: unknown;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: JsonRpcErrorBody;
}

export interface McpInputSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: McpInputSchema;
}

export interface AuthedUser {
  id: string;
  walletAddress: string;
  role: string;
}

export type ToolHandler = (
  user: AuthedUser,
  args: Record<string, unknown>,
) => Promise<unknown>;

export interface ToolDefinition {
  tool: McpTool;
  handler: ToolHandler;
}

export const JSON_RPC_ERRORS = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
} as const;

export const MCP_PROTOCOL_VERSION = '2025-06-18';

export const MCP_SERVER_INFO = {
  name: 'ricardian-mcp',
  version: '0.1.0',
} as const;
