import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { HealthController } from '../src/health.controller';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';

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

describe('Release 2 verification (e2e)', () => {
  let app: INestApplication<App>;
  let usersService: {
    getProfile: jest.Mock;
    updateProfile: jest.Mock;
    updateNotifications: jest.Mock;
    resolveIdentifier: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      updateNotifications: jest.fn(),
      resolveIdentifier: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController, UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
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

  it('exposes release capabilities from health', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.data).toEqual(
          expect.objectContaining({
            status: 'ok',
            version: '1.0.0',
            features: expect.objectContaining({
              usernames: true,
              user_resolution: true,
            }),
          }),
        );
      });
  });

  it('guards resolve by default and only resolves when authenticated', async () => {
    await request(app.getHttpServer()).get('/api/users/resolve/testuser').expect(401);

    usersService.resolveIdentifier.mockResolvedValue({
      id: 'user-2',
      username: 'builder',
      display_name: 'Builder',
      walletAddress: '0x1111111111111111111111111111111111111111',
    });

    await request(app.getHttpServer())
      .get('/api/users/resolve/builder')
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect((response) => {
        expect(response.body.data).toEqual({
          id: 'user-2',
          username: 'builder',
          display_name: 'Builder',
          walletAddress: '0x1111111111111111111111111111111111111111',
        });
      });
  });

  it('returns a 404 payload for authenticated unknown identifiers', async () => {
    usersService.resolveIdentifier.mockRejectedValue(
      new NotFoundException('User not found'),
    );

    await request(app.getHttpServer())
      .get('/api/users/resolve/missing-user')
      .set('Authorization', 'Bearer test-token')
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            message: 'User not found',
            path: '/api/users/resolve/missing-user',
          }),
        );
      });
  });
});
