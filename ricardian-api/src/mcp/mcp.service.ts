import { Injectable, Logger } from '@nestjs/common';
import {
  AuthedUser,
  JSON_RPC_ERRORS,
  JsonRpcRequest,
  JsonRpcResponse,
  MCP_PROTOCOL_VERSION,
  MCP_SERVER_INFO,
} from './types';
import { ToolRegistry } from './tools';

/**
 * JSON-RPC 2.0 dispatcher for the Ricardian MCP server.
 *
 * Handles the minimal MCP method surface: initialize, tools/list, tools/call,
 * ping, and the initialized notification. Any other method returns a standard
 * JSON-RPC method-not-found error.
 *
 * Returns `null` for notifications (no response expected by the client).
 */
@Injectable()
export class McpService {
  private readonly logger = new Logger(McpService.name);

  constructor(private readonly registry: ToolRegistry) {}

  async handle(
    user: AuthedUser,
    request: JsonRpcRequest,
  ): Promise<JsonRpcResponse | null> {
    if (!request || request.jsonrpc !== '2.0' || typeof request.method !== 'string') {
      return this.error(
        request?.id ?? null,
        JSON_RPC_ERRORS.INVALID_REQUEST,
        'Invalid JSON-RPC 2.0 request',
      );
    }

    const isNotification = request.id === undefined || request.id === null;

    try {
      switch (request.method) {
        case 'initialize':
          return this.ok(request.id ?? 0, {
            protocolVersion: MCP_PROTOCOL_VERSION,
            capabilities: { tools: { listChanged: false } },
            serverInfo: MCP_SERVER_INFO,
            instructions:
              'Ricardian Base MCP server. Exposes contracts, milestones, disputes, dashboard, profile, and wallet actions as tools. All tool calls are scoped to the authenticated JWT user.',
          });

        case 'notifications/initialized':
        case 'initialized':
          return null;

        case 'ping':
          return isNotification ? null : this.ok(request.id!, {});

        case 'tools/list':
          return this.ok(request.id ?? 0, { tools: this.registry.list() });

        case 'tools/call': {
          const params = request.params ?? {};
          const name = params.name as string | undefined;
          const args = (params.arguments as Record<string, unknown>) ?? {};

          if (!name) {
            return this.error(
              request.id ?? null,
              JSON_RPC_ERRORS.INVALID_PARAMS,
              "tools/call requires a 'name' parameter",
            );
          }

          const def = this.registry.get(name);
          if (!def) {
            return this.error(
              request.id ?? null,
              JSON_RPC_ERRORS.METHOD_NOT_FOUND,
              `Unknown tool: ${name}`,
            );
          }

          try {
            const result = await def.handler(user, args);
            return this.ok(request.id ?? 0, {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            });
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            this.logger.warn(
              `Tool "${name}" failed for user ${user.id}: ${message}`,
            );
            // Per MCP spec, tool execution errors are returned as successful
            // results with isError: true so the agent can reason about them.
            return this.ok(request.id ?? 0, {
              content: [{ type: 'text', text: `Error: ${message}` }],
              isError: true,
            });
          }
        }

        default:
          if (isNotification) return null;
          return this.error(
            request.id!,
            JSON_RPC_ERRORS.METHOD_NOT_FOUND,
            `Unknown method: ${request.method}`,
          );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`MCP dispatcher crashed: ${message}`);
      return this.error(
        request.id ?? null,
        JSON_RPC_ERRORS.INTERNAL_ERROR,
        message,
      );
    }
  }

  private ok(id: string | number, result: unknown): JsonRpcResponse {
    return { jsonrpc: '2.0', id, result };
  }

  private error(
    id: string | number | null,
    code: number,
    message: string,
  ): JsonRpcResponse {
    return { jsonrpc: '2.0', id, error: { code, message } };
  }
}
