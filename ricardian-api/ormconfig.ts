import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

const baseOptions: DataSourceOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      database: process.env.DATABASE_NAME || 'ricardian_dev',
      username: process.env.DATABASE_USER || 'ricardian',
      password: process.env.DATABASE_PASSWORD || 'ricardian_local',
    };

export default new DataSource({
  ...baseOptions,
  entities: isProduction ? ['dist/src/**/*.entity.js'] : ['src/**/*.entity.ts'],
  migrations: isProduction
    ? ['dist/src/migrations/*.js']
    : ['src/migrations/*.ts'],
  synchronize: false,
  logging: isProduction ? ['error', 'warn'] : true,
});
