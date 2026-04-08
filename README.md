# Ricardian

**The first platform to merge legal contracts with smart contracts.**

Ricardian is enterprise-grade infrastructure for hiring managers, procurement teams, and tech contractors. It eliminates payment friction and contract risk by fusing legally-binding prose with on-chain escrow execution on the Base blockchain.

Every contract simultaneously generates a human-readable legal document (ESIGN Act compliant) and a matching Base L2 smart contract. A cryptographic SHA-256 hash permanently links the two — creating a tamper-proof, dual-readable agreement that is both legally enforceable and machine-executable.

---

## Core Features

- **Ricardian Hash Linking** — Cryptographic binding of legal prose to smart contracts. Any post-signing modification is instantly detectable via hash mismatch.
- **Milestone-Based Escrow** — USDC deposited into smart contract escrow upon contract creation. Funds release instantly when milestones are approved.
- **Instant Settlement** — From 45 days to 14 seconds. Milestone approved, payment released. No invoices, no AP department.
- **Dispute Resolution** — On-chain arbitration with automatic escrow freezing and evidence-based resolution.
- **Contract Templates** — Milestone-Based, Fixed Price, and Monthly Retainer templates with full customization.
- **KYC/AML Verification** — Enterprise-grade identity verification for all parties before contract execution.
- **Multi-Wallet Support** — Connect via MetaMask, Coinbase Wallet, or Phantom (EVM).
- **Full Audit Trail** — Every action logged on-chain for compliance and transparency.

---

## Tech Stack

### Frontend
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

### Backend
| Technology | Purpose |
|---|---|
| NestJS 11 | API framework |
| TypeORM | Database ORM |
| PostgreSQL | Primary database |
| JWT + Passport | Authentication |
| Swagger/OpenAPI | API documentation |
| Helmet | Security headers |
| Throttler | Rate limiting |

### Blockchain
| Technology | Purpose |
|---|---|
| Base (Ethereum L2) | Settlement layer |
| USDC | Payment stablecoin |
| ethers.js | On-chain interaction |
| Wallet-based auth | Nonce + signature verification |

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

### Available Scripts

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

---

## How It Works

```
1. Company creates a contract with milestones and payment terms
2. Platform generates a legal PDF + Base smart contract simultaneously
3. SHA-256 hash cryptographically links the two documents
4. Both parties sign (electronic signature + wallet signature)
5. USDC is deposited into the smart contract escrow
6. Contractor completes work and submits deliverables per milestone
7. Company approves milestone → smart contract releases payment instantly
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

- Wallet-based authentication (nonce + cryptographic signature verification)
- JWT access and refresh tokens with rotation
- Global request validation with whitelisting
- Rate limiting on all endpoints
- Security headers via Helmet
- Parameterized database queries (SQL injection prevention)
- CORS enforcement with credential support

---

## Blockchain Details

- **Network:** Base (Coinbase Ethereum L2)
- **Finality:** Sub-second
- **Gas Fees:** Under $0.01 per transaction
- **Stablecoin:** USDC (zero crypto volatility)
- **Contract Linking:** SHA-256 cryptographic hash binding

---

## Compliance

- ESIGN Act & UETA compliant electronic signatures
- KYC/AML identity verification for all users
- SOC 2 Type II certification-ready architecture
- GENIUS Act federal stablecoin framework alignment
- Immutable on-chain audit trail for regulatory reporting

---

## Roadmap

| Phase | Timeline | Focus |
|---|---|---|
| Phase 1 | Weeks 1-16 | Foundation & MVP |
| Phase 2 | Weeks 17-32 | Security & Pilot |
| Phase 3 | Months 9-14 | Enterprise Scale |
| Phase 4 | Month 15+ | Global Expansion |

---

## License

Proprietary. All rights reserved.
