import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
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
      },
    };
  }
}
