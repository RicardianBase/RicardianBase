<div align="center">

# Ricardian

### The first platform to merge legal contracts with smart contracts.

[![Base](https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://base.org)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![USDC](https://img.shields.io/badge/USDC-2775CA?style=for-the-badge&logo=circle&logoColor=white)](https://circle.com/usdc)

---

Enterprise-grade infrastructure for hiring managers, procurement teams, and tech contractors.
Eliminates payment friction and contract risk by fusing legally-binding prose with on-chain escrow execution on the Base blockchain.

Every contract simultaneously generates a human-readable legal document (ESIGN Act compliant) and a matching Base L2 smart contract. A cryptographic SHA-256 hash permanently links the two — creating a tamper-proof, dual-readable agreement that is both legally enforceable and machine-executable.

</div>

---

## Core Features

| | Feature | Description |
|---|---|---|
| :link: | **Ricardian Hash Linking** | Cryptographic binding of legal prose to smart contracts. Any post-signing modification is instantly detectable via hash mismatch. |
| :bank: | **Milestone-Based Escrow** | USDC deposited into smart contract escrow upon contract creation. Funds release instantly when milestones are approved. |
| :zap: | **Instant Settlement** | From 45 days to 14 seconds. Milestone approved, payment released. No invoices, no AP department. |
| :balance_scale: | **Dispute Resolution** | On-chain arbitration with automatic escrow freezing and evidence-based resolution. |
| :page_facing_up: | **Contract Templates** | Milestone-Based, Fixed Price, and Monthly Retainer templates with full customization. |
| :shield: | **KYC/AML Verification** | Enterprise-grade identity verification for all parties before contract execution. |
| :key: | **Multi-Wallet Support** | Connect via MetaMask, Coinbase Wallet, or Phantom (EVM). |
| :mag: | **Full Audit Trail** | Every action logged on-chain for compliance and transparency. |

---

## Tech Stack

<details>
<summary><strong>Frontend</strong></summary>
<br>

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tooling |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| TanStack React Query | Server state management |
| React Router | Client-side routing |
| Zod | Schema validation |
| React Hook Form | Form handling |

</details>

<details>
<summary><strong>Backend</strong></summary>
<br>

| Technology | Purpose |
|---|---|
| NestJS 11 | API framework |
| TypeORM | Database ORM |
| PostgreSQL | Primary database |
| JWT + Passport | Authentication |
| Swagger/OpenAPI | API documentation |
| Helmet | Security headers |
| Throttler | Rate limiting |

</details>

<details>
<summary><strong>Blockchain</strong></summary>
<br>

| Technology | Purpose |
|---|---|
| Base (Ethereum L2) | Settlement layer |
| USDC | Payment stablecoin |
| ethers.js | On-chain interaction |
| Wallet-based auth | Nonce + signature verification |

</details>

---

## Project Structure

```
ricardian/
├── src/                        # Frontend (React + Vite)
│   ├── api/                    # API client layer
│   ├── assets/                 # Static assets
│   ├── components/
│   │   ├── dashboard/          # Application UI
│   │   ├── ricardian/          # Landing page sections
│   │   └── ui/                 # Shared UI components
│   ├── contexts/               # React contexts (wallet, theme)
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities and helpers
│   ├── pages/                  # Route pages
│   └── types/                  # TypeScript type definitions
│
├── ricardian-api/              # Backend (NestJS)
│   ├── src/
│   │   ├── auth/               # Wallet-based authentication
│   │   ├── contracts/          # Contract CRUD and lifecycle
│   │   ├── milestones/         # Milestone management
│   │   ├── disputes/           # Dispute handling
│   │   ├── wallet/             # Wallet management
│   │   ├── users/              # User profiles
│   │   ├── dashboard/          # Stats and analytics
│   │   ├── activity/           # Audit logging
│   │   ├── migrations/         # Database migrations
│   │   └── seeds/              # Template seeding
│   └── test/                   # E2E tests
│
└── public/                     # Static public assets
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 16+
- A Web3 wallet (MetaMask, Coinbase Wallet, or Phantom)

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend

```bash
cd ricardian-api

# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env

# Run database migrations
npm run migration:run

# Seed contract templates
npm run seed

# Start development server
npm run start:dev
```

<details>
<summary><strong>All Available Scripts</strong></summary>
<br>

**Frontend:**

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run preview` | Preview production build |

**Backend:**

| Command | Description |
|---|---|
| `npm run start:dev` | Start with hot reload |
| `npm run start:prod` | Start production server |
| `npm run build` | Compile TypeScript |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run migration:run` | Apply database migrations |
| `npm run migration:revert` | Rollback last migration |
| `npm run seed` | Seed contract templates |

</details>

---

## How It Works

```
  1. Company creates a contract with milestones and payment terms
                              |
  2. Platform generates a legal PDF + Base smart contract simultaneously
                              |
  3. SHA-256 hash cryptographically links the two documents
                              |
  4. Both parties sign (electronic signature + wallet signature)
                              |
  5. USDC is deposited into the smart contract escrow
                              |
  6. Contractor completes work and submits deliverables per milestone
                              |
  7. Company approves milestone -> smart contract releases payment instantly
                              |
  8. Full audit trail stored on Base blockchain
```

---

## Platform Services

| Service | Description |
|---|---|
| **Smart Escrow** | Milestone-based escrow with automatic USDC settlement |
| **Hybrid Contract Generation** | Simultaneous legal document + smart contract creation with hash linking |
| **Milestone Auto-Payments** | One-click approval triggers instant on-chain payment release |
| **Compliance & Verification** | Integrated KYC/AML with SOC 2 readiness and ESIGN Act compliance |

---

## Security

| | Measure |
|---|---|
| :closed_lock_with_key: | Wallet-based authentication (nonce + cryptographic signature verification) |
| :repeat: | JWT access and refresh tokens with rotation |
| :white_check_mark: | Global request validation with whitelisting |
| :stopwatch: | Rate limiting on all endpoints |
| :helmet_with_white_cross: | Security headers via Helmet |
| :syringe: | Parameterized database queries (SQL injection prevention) |
| :globe_with_meridians: | CORS enforcement with credential support |

---

## Blockchain Details

<div align="center">

| | |
|---|---|
| **Network** | Base (Coinbase Ethereum L2) |
| **Finality** | Sub-second |
| **Gas Fees** | Under $0.01 per transaction |
| **Stablecoin** | USDC (zero crypto volatility) |
| **Contract Linking** | SHA-256 cryptographic hash binding |

</div>

---

## Compliance

| Standard | Status |
|---|---|
| ESIGN Act & UETA | Compliant electronic signatures |
| KYC/AML | Identity verification for all users |
| SOC 2 Type II | Certification-ready architecture |
| GENIUS Act | Federal stablecoin framework alignment |
| Audit Trail | Immutable on-chain records for regulatory reporting |

---

## Roadmap

| Phase | Timeline | Focus |
|---|---|---|
| :one: | Weeks 1-16 | Foundation & MVP |
| :two: | Weeks 17-32 | Security & Pilot |
| :three: | Months 9-14 | Enterprise Scale |
| :four: | Month 15+ | Global Expansion |

---

<div align="center">

## License

Proprietary. All rights reserved.

---

Built on Base. Powered by USDC. Secured by cryptography.

</div>
