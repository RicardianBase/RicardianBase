export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    name: process.env.DATABASE_NAME || 'ricardian_dev',
    user: process.env.DATABASE_USER || 'ricardian',
    password: process.env.DATABASE_PASSWORD || 'ricardian_local',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '24h',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  },
});
