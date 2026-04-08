# Contributing to RicardianBase

Thank you for your interest in contributing to RicardianBase! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 20 LTS or later
- PostgreSQL 16+ (or a Supabase account)
- A wallet browser extension (Phantom, MetaMask, or Coinbase Wallet)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/RicardianBase/RicardianBase.git
   cd RicardianBase
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ricardian-api
   npm install
   cd ..
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   cp ricardian-api/.env.example ricardian-api/.env
   ```
   Fill in the required values in both `.env` files.

5. **Start the development servers**
   ```bash
   # Frontend (runs on port 8080)
   npm run dev

   # Backend (runs on port 3000, in a separate terminal)
   cd ricardian-api
   npm run start:dev
   ```

## How to Contribute

### Reporting Bugs

1. Check existing [issues](https://github.com/RicardianBase/RicardianBase/issues) to avoid duplicates
2. Use the bug report template when creating a new issue
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS/wallet information
   - Screenshots if applicable

### Suggesting Features

1. Open a [feature request](https://github.com/RicardianBase/RicardianBase/issues/new) issue
2. Describe the feature and its use case
3. Explain why it benefits the platform
4. Include mockups or examples if possible

### Submitting Code

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test** your changes locally
5. **Commit** with clear, descriptive messages:
   ```
   feat: add milestone deadline notifications
   fix: resolve escrow balance calculation for partial releases
   docs: update API endpoint documentation
   ```
6. **Push** to your fork and open a **Pull Request**

### Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Update documentation if you change APIs or user-facing behavior
- Ensure the build passes (`npm run build`)
- Add tests for new backend endpoints
- Include screenshots for UI changes
- Reference any related issues

## Coding Standards

### Frontend (React + TypeScript)

- Use functional components with hooks
- Use TypeScript strict mode — no `any` types without justification
- Follow the existing component structure in `src/`
- Use Tailwind CSS for styling — avoid inline styles
- Use React Query for server state management
- Place API calls in `src/api/`, hooks in `src/hooks/api/`

### Backend (NestJS + TypeORM)

- Follow NestJS module structure (controller → service → entity)
- Use DTOs with class-validator for input validation
- Use TypeORM repositories — never write raw SQL
- Add Swagger decorators to all endpoints
- Guard all authenticated endpoints with `JwtAuthGuard`
- Log activity for user-facing state changes

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring (no behavior change)
- `test:` — Adding or updating tests
- `chore:` — Build, CI, or tooling changes

## Project Structure

```
RicardianBase/
├── src/                    # Frontend (React + Vite)
│   ├── api/                # API service functions
│   ├── components/         # React components
│   ├── contexts/           # React contexts (Wallet, Theme)
│   ├── hooks/              # Custom hooks + React Query hooks
│   ├── lib/                # Utilities (onchain, profanity, auth)
│   ├── pages/              # Page components
│   └── types/              # TypeScript type definitions
├── ricardian-api/          # Backend (NestJS)
│   └── src/
│       ├── auth/           # Wallet authentication + JWT
│       ├── contracts/      # Contract CRUD + status machine
│       ├── milestones/     # Milestone management
│       ├── escrow/         # USDC escrow funding + release
│       ├── disputes/       # Dispute handling + evidence
│       ├── wallet/         # Wallet addresses + transactions
│       ├── users/          # User profiles + settings
│       ├── api-keys/       # API key management
│       ├── dashboard/      # Stats + activity aggregation
│       └── activity/       # Activity logging
├── public/                 # Static assets
└── vercel.json             # Vercel deployment config
```

## Security

If you discover a security vulnerability, please refer to our [Security Policy](SECURITY.md). Do **not** open a public issue for security vulnerabilities.

## Community

- Be respectful and constructive in all interactions
- Help others when you can
- Follow our [Code of Conduct](#code-of-conduct)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. We expect all participants to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

Harassment, trolling, and discriminatory behavior will not be tolerated.

## License

By contributing to RicardianBase, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Last updated: April 8, 2026
