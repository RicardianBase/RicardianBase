import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { ActivityModule } from './activity/activity.module';
import { ContractsModule } from './contracts/contracts.module';
import { MilestonesModule } from './milestones/milestones.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('database.url');
        const isProduction =
          configService.get<string>('nodeEnv') === 'production';

        return {
          type: 'postgres' as const,
          ...(databaseUrl
            ? {
                url: databaseUrl,
                ssl: { rejectUnauthorized: false },
              }
            : {
                host: configService.get<string>('database.host'),
                port: configService.get<number>('database.port'),
                database: configService.get<string>('database.name'),
                username: configService.get<string>('database.user'),
                password: configService.get<string>('database.password'),
              }),
          autoLoadEntities: true,
          synchronize: false,
          logging: isProduction ? (['error', 'warn'] as const) : true,
        };
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'short', ttl: 60000, limit: 10 }],
    }),
    AuthModule,
    UsersModule,
    WalletModule,
    ActivityModule,
    ContractsModule,
    MilestonesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
