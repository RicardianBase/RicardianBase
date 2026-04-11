import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { HealthController } from '../src/health.controller';
import { ContractsController } from '../src/contracts/contracts.controller';
import { ContractsService } from '../src/contracts/contracts.service';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';

class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    request.user = { id: 'user-1' };
    return true;
  }
}

describe('Release 7 verification (e2e)', () => {
  let app: INestApplication<App>;
  let contractsService: {
    findOne: jest.Mock;
    getJsonLd: jest.Mock;
    getMcpReadModel: jest.Mock;
  };

  beforeEach(async () => {
    contractsService = {
      findOne: jest.fn(),
      getJsonLd: jest.fn(),
      getMcpReadModel: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController, ContractsController],
      providers: [{ provide: ContractsService, useValue: contractsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('advertises multi-party and manual contract read capabilities from health', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.data).toEqual(
          expect.objectContaining({
            status: 'ok',
            features: expect.objectContaining({
              multi_party_contracts: true,
              contract_jsonld: true,
              contract_mcp_manual_fallback: true,
            }),
          }),
        );
      });
  });

  it('returns participant-aware JSON-LD contract reads', async () => {
    const contractId = '11111111-1111-1111-1111-111111111111';
    contractsService.getJsonLd.mockResolvedValue({
      '@id': `urn:ricardian:contract:${contractId}`,
      participants: [
        { roleName: 'client', username: 'founder', payoutSplit: null },
        { roleName: 'contractor', username: 'builder', payoutSplit: '60.00' },
        { roleName: 'collaborator', username: 'designer', payoutSplit: '40.00' },
      ],
    });

    await request(app.getHttpServer())
      .get(`/api/contracts/${contractId}/jsonld`)
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect((response) => {
        expect(response.body.data).toEqual(
          expect.objectContaining({
            '@id': `urn:ricardian:contract:${contractId}`,
            participants: expect.arrayContaining([
              expect.objectContaining({ roleName: 'contractor', payoutSplit: '60.00' }),
              expect.objectContaining({ roleName: 'collaborator', payoutSplit: '40.00' }),
            ]),
          }),
        );
      });
  });

  it('returns participant-aware REST contract reads while preserving legacy fields', async () => {
    const contractId = '33333333-3333-3333-3333-333333333333';
    contractsService.findOne.mockResolvedValue({
      id: contractId,
      client_id: 'user-1',
      contractor_id: 'user-2',
      contractor_wallet: '0x1111111111111111111111111111111111111111',
      participants: [
        { role: 'client', username: 'founder', payout_split: null },
        { role: 'contractor', username: 'builder', payout_split: '60.00' },
        { role: 'collaborator', username: 'designer', payout_split: '40.00' },
      ],
    });

    await request(app.getHttpServer())
      .get(`/api/contracts/${contractId}`)
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect((response) => {
        expect(response.body.data).toEqual(
          expect.objectContaining({
            id: contractId,
            client_id: 'user-1',
            contractor_id: 'user-2',
            contractor_wallet: '0x1111111111111111111111111111111111111111',
            participants: expect.arrayContaining([
              expect.objectContaining({ role: 'contractor', payout_split: '60.00' }),
              expect.objectContaining({ role: 'collaborator', payout_split: '40.00' }),
            ]),
          }),
        );
      });
  });

  it('returns MCP-ready contract reads with manual fallback metadata', async () => {
    const contractId = '22222222-2222-2222-2222-222222222222';
    contractsService.getMcpReadModel.mockResolvedValue({
      kind: 'ricardian.contract',
      id: contractId,
      participants: [
        { role: 'client', payout_split: null },
        { role: 'contractor', payout_split: '60.00' },
        { role: 'collaborator', payout_split: '40.00' },
      ],
      payout_execution: {
        mode: 'manual_fallback',
      },
    });

    await request(app.getHttpServer())
      .get(`/api/contracts/${contractId}/mcp`)
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect((response) => {
        expect(response.body.data).toEqual(
          expect.objectContaining({
            kind: 'ricardian.contract',
            participants: expect.arrayContaining([
              expect.objectContaining({ role: 'contractor', payout_split: '60.00' }),
              expect.objectContaining({ role: 'collaborator', payout_split: '40.00' }),
            ]),
            payout_execution: expect.objectContaining({
              mode: 'manual_fallback',
            }),
          }),
        );
      });
  });
});
