# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.7.x   | :white_check_mark: |
| 0.6.x   | :white_check_mark: |
| < 0.6   | :x:                |

## Reporting a Vulnerability

We take the security of RicardianBase seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email us at **security@ricardianbase.com** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Any suggested fixes (optional)

### What to Expect

- **Acknowledgment** within 48 hours of your report
- **Assessment** within 5 business days
- **Resolution timeline** communicated after assessment
- **Credit** in our security acknowledgments (if desired)

### Scope

The following are in scope for security reports:

- Authentication bypass or wallet impersonation
- Escrow fund manipulation or unauthorized release
- Smart contract interaction vulnerabilities
- Cross-site scripting (XSS) in the dashboard
- SQL injection or database access issues
- API key leakage or privilege escalation
- CORS misconfiguration allowing unauthorized origins
- Sensitive data exposure in API responses

### Out of Scope

- Denial of service attacks
- Social engineering
- Physical security
- Issues in third-party dependencies (report to the upstream project)
- Vulnerabilities requiring physical access to a user's device

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption of services
- Only interact with accounts you own or with explicit permission
- Do not exploit a vulnerability beyond what is necessary to confirm it
- Report vulnerabilities promptly

We will not pursue legal action against researchers who follow these guidelines.

## Security Best Practices for Deployment

When deploying RicardianBase, ensure:

1. **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template.
2. **JWT Secret**: Use a cryptographically random string of at least 32 characters.
3. **Platform Wallet**: Store the `PLATFORM_WALLET_PRIVATE_KEY` in a secure secrets manager, not in plaintext config files.
4. **Database SSL**: Enable `rejectUnauthorized: true` for production database connections.
5. **CORS Origins**: Restrict `CORS_ORIGIN` to your exact production domain(s).
6. **Rate Limiting**: The default rate limits are configured but should be tuned for your traffic patterns.

---

Last updated: April 8, 2026
