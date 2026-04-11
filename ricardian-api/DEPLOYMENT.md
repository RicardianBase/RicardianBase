# Ricardian API — Deployment Guide

## Infrastructure

- **Platform**: Digital Ocean App Platform
- **Service**: Node.js (basic-xxs, $5/mo)
- **Database**: Managed PostgreSQL 16 (db-s-1vcpu-1gb, $15/mo)
- **App Spec**: `.do/app.yaml` (configured for the monorepo `RicardianBase/RicardianBase` with `source_dir: ricardian-api`)

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes (prod) | PostgreSQL connection string. Provided automatically by DO managed DB. |
| `DATABASE_HOST` | Yes (local) | Database host. Not needed when `DATABASE_URL` is set. |
| `DATABASE_PORT` | No | Database port. Defaults to `5432`. |
| `DATABASE_NAME` | Yes (local) | Database name. Not needed when `DATABASE_URL` is set. |
| `DATABASE_USER` | Yes (local) | Database user. Not needed when `DATABASE_URL` is set. |
| `DATABASE_PASSWORD` | Yes (local) | Database password. Not needed when `DATABASE_URL` is set. |
| `JWT_SECRET` | Yes | Secret for signing JWTs. Must be 32+ characters. |
| `JWT_ACCESS_EXPIRY` | No | Access token lifetime. Defaults to `24h`. |
| `JWT_REFRESH_EXPIRY` | No | Refresh token lifetime. Defaults to `7d`. |
| `CORS_ORIGIN` | No | Allowed CORS origin(s). Defaults to `http://localhost:8080`. Comma-separated values are supported in production, for example `https://www.ricardianbase.com,https://ricardianbase.com`. |
| `NODE_ENV` | No | Environment. Defaults to `development`. Set to `production` in prod. |
| `PORT` | No | Server port. Defaults to `3000`. |

## Generating JWT_SECRET

```bash
openssl rand -base64 48
```

Set this value in the DO App Platform dashboard under **Settings > App-Level Environment Variables**, or via the CLI:

```bash
doctl apps update <app-id> --spec .do/app.yaml
```

`JWT_SECRET` is marked as `type: SECRET` in the app spec and will be encrypted at rest.

## Deployment

### Automatic Deploys

Pushes to the `main` branch trigger automatic deployments (`deploy_on_push: true` in the app spec).

### Manual Deploy

```bash
doctl apps create-deployment <app-id>
```

### Deploy Flow

1. Push to `main`
2. DO builds the app: `npm ci && npm run build`
3. Pre-deploy job runs migrations: `npm run migration:run:prod`
4. App starts: `node dist/src/main.js`
5. Health check polls `GET /api/health` every 30s (15s initial delay)

## Migrations

Migrations run automatically as a pre-deploy job. If the job fails:

```bash
# Connect to the production database and run manually
doctl databases connection <db-id> --format DSN

# Then on a machine with the built project:
DATABASE_URL="<connection-string>" npm run migration:run:prod
```

### Creating New Migrations

```bash
# Local development
npm run migration:generate -- src/migrations/MigrationName
```

## Seeding

After the first deploy, seed the database with template data:

```bash
# Via DO console
doctl apps console <app-id> api
npm run seed:prod

# Or set DATABASE_URL locally and run
DATABASE_URL="<connection-string>" npm run seed:prod
```

## Verifying Deployment

```bash
curl https://your-app.ondigitalocean.app/api/health
# Expected release 2 shape:
# {"status":"ok","timestamp":"...","version":"1.0.0","features":{"usernames":true,"user_resolution":true}}
```

## Release 2 Rollout

1. Deploy the updated app spec and backend build.
2. Confirm the pre-deploy migration job completes successfully.
3. Run the seed step if templates are not already present or if the environment was rebuilt.
4. Verify `GET /api/health` includes `features.usernames` and `features.user_resolution`.
5. Verify authenticated `GET /api/users/resolve/:identifier` returns `401` when unauthenticated and resolves by username and wallet when authenticated.
6. Verify production create-contract succeeds for both:
   - `@username` input tied to an existing Ricardian profile
   - raw `0x...` wallet input not yet tied to a Ricardian profile

## Logs

```bash
# Stream live logs
doctl apps logs <app-id> --type run

# View build logs
doctl apps logs <app-id> --type build

# View pre-deploy job logs
doctl apps logs <app-id> --type deploy
```

## Database Backups

Digital Ocean managed databases include automatic daily backups with 7-day retention. No additional configuration required.

To create a manual backup:

```bash
doctl databases backups create <db-id>
doctl databases backups list <db-id>
```

## Docker (Alternative Deployment)

The project includes a production-ready Dockerfile:

```bash
docker build -t ricardian-api .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  -e CORS_ORIGIN="https://ricardian.app" \
  -e NODE_ENV=production \
  ricardian-api
```

The Docker image uses a multi-stage build with a non-root user (uid 1001) and includes a health check.
