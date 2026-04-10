# Ricardian MCP Server

Model Context Protocol (MCP) server that exposes the Ricardian Base NestJS API as a set of agent-callable tools.

This is a thin JSON-RPC 2.0 adapter over the existing NestJS services — no new business logic. Everything authorization, validation, and state transitions are enforced by the same services the HTTP controllers call.

## Endpoint

```
POST /api/mcp
```

- **Authentication:** `Authorization: Bearer <access_token>` (same JWT used everywhere else)
- **Content-Type:** `application/json`
- **Body:** single JSON-RPC 2.0 request

All tool calls are scoped to the user encoded in the JWT.

## Supported MCP methods

| Method | Purpose |
|---|---|
| `initialize` | Returns protocol version, capabilities, server info |
| `notifications/initialized` | Client handshake notification (no response) |
| `tools/list` | Returns the tool catalog with input schemas |
| `tools/call` | Execute a tool with arguments |
| `ping` | Health check |

Unknown methods return JSON-RPC `method not found` (code `-32601`).

## Tool catalog

### Contracts
- `ricardian_list_contracts` — list the user's contracts (filter by status, search by title, paginated)
- `ricardian_get_contract` — fetch a single contract with milestones
- `ricardian_create_contract` — create a new contract in DRAFT (caller becomes client)
- `ricardian_update_contract_status` — transition contract status (server-enforced transitions)

### Milestones
- `ricardian_list_milestones` — list milestones for a contract, in sequence order
- `ricardian_update_milestone_status` — role-enforced status transitions; approval auto-records a payment transaction

### Disputes
- `ricardian_create_dispute` — open a dispute (freezes escrow, marks contract disputed)
- `ricardian_list_disputes` — list user's disputes
- `ricardian_get_dispute` — fetch a single dispute
- `ricardian_update_dispute_status` — transition dispute status (resolving returns contract to active)

### Dashboard
- `ricardian_dashboard_stats` — active contracts, total value, pending reviews, completed contracts
- `ricardian_recent_activity` — last 20 activity log entries for the user

### Profile
- `ricardian_get_profile` — current user profile with linked wallets

### Wallet
- `ricardian_wallet_balances` — token balances (MVP placeholder)
- `ricardian_wallet_transactions` — paginated transaction history (filter by type and direction)

Call `tools/list` for the authoritative catalog with full input schemas.

## Testing with curl

Assuming your API is running locally at `http://localhost:3000` and you have a JWT in `$JWT`:

```bash
# 1. List available tools
curl -s -X POST http://localhost:3000/api/mcp \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | jq

# 2. Call the dashboard stats tool
curl -s -X POST http://localhost:3000/api/mcp \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":2,
    "method":"tools/call",
    "params": {
      "name": "ricardian_dashboard_stats",
      "arguments": {}
    }
  }' | jq

# 3. Initialize handshake
curl -s -X POST http://localhost:3000/api/mcp \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":0,
    "method":"initialize",
    "params": {
      "protocolVersion":"2025-06-18",
      "capabilities":{},
      "clientInfo":{"name":"curl","version":"0.0.0"}
    }
  }' | jq
```

## Connecting from Claude Desktop

Claude Desktop only speaks MCP over stdio, so use the `mcp-remote` bridge to connect to the HTTP endpoint. Add this to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ricardian": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://api.ricardianbase.com/api/mcp",
        "--header",
        "Authorization: Bearer ${RICARDIAN_JWT}"
      ]
    }
  }
}
```

Set `RICARDIAN_JWT` in your shell environment, then restart Claude Desktop.

## Connecting from Cursor / MCP Inspector

Both Cursor and the MCP Inspector natively support HTTP MCP servers. Point them at:

```
https://api.ricardianbase.com/api/mcp
```

and set a custom header:

```
Authorization: Bearer <your-jwt>
```

## Architecture notes

- **Single endpoint, stateless.** Each POST is a complete JSON-RPC exchange. No session IDs, no SSE, no long-lived connections.
- **Tool handlers call services directly.** No self-HTTP calls — tools resolve via NestJS DI and invoke `ContractsService.findAll(...)` etc. All existing authorization checks (ownership, role, status transitions) apply.
- **Interceptor bypass.** The MCP controller uses `@Res()` in manual mode to write the response directly, bypassing the global `TransformInterceptor` that would otherwise wrap the JSON-RPC body in `{ data: ... }` and break MCP clients.
- **Tool errors vs protocol errors.** Protocol-level failures (malformed request, unknown method) return JSON-RPC error objects. Tool execution failures return a successful result with `isError: true` and an error message, per the MCP spec — this lets agents reason about and recover from tool failures.
- **No new dependencies.** This is a pure TypeScript implementation; no `@modelcontextprotocol/sdk` is required.

## Future work

- Rate limiting per user (ThrottlerModule is already global at 10 req/min; may want a higher MCP-specific limit).
- Streamable HTTP transport (SSE) for long-running tool calls.
- Server-initiated notifications (currently we only handle client→server messages).
- Resource and prompt support beyond the current tool-only capability set.
