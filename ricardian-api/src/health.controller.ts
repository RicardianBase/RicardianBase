import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  check() {
    const anthropicKey = this.config.get<string>('ai.anthropicApiKey') || '';
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      features: {
        usernames: true,
        user_resolution: true,
        multi_party_contracts: true,
        contract_jsonld: true,
        contract_mcp_manual_fallback: true,
        ai_contract_review: anthropicKey.length > 0,
      },
    };
  }
}
