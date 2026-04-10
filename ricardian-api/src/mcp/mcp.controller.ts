import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { McpService } from './mcp.service';
import type { AuthedUser, JsonRpcRequest } from './types';

/**
 * POST /api/mcp — Ricardian MCP (Model Context Protocol) endpoint.
 *
 * Uses @Res() in manual mode so the response bypasses the global
 * TransformInterceptor (which would otherwise wrap the JSON-RPC body in
 * `{ data: ... }` and break MCP clients).
 */
@ApiTags('mcp')
@ApiBearerAuth()
@Controller('mcp')
@UseGuards(JwtAuthGuard)
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Post()
  @ApiOperation({
    summary: 'Model Context Protocol endpoint (JSON-RPC 2.0)',
    description:
      'Single POST endpoint implementing MCP methods: initialize, tools/list, tools/call, ping. Authenticated via Bearer JWT — all tool calls are scoped to the authenticated user.',
  })
  async handle(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: JsonRpcRequest,
  ): Promise<void> {
    const user = req.user as AuthedUser;
    const response = await this.mcpService.handle(user, body);

    if (response === null) {
      // JSON-RPC notification — no response body per spec
      res.status(202).end();
      return;
    }

    res.status(200).json(response);
  }
}
