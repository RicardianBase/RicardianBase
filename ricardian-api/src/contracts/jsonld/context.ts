/**
 * JSON-LD @context for Ricardian contracts.
 *
 * Ricardian emits machine-readable JSON-LD representations of every contract
 * so that any external system — other platforms, AI agents, compliance
 * tooling, knowledge graphs — can parse them without custom adapters.
 *
 * Design:
 * - Ricardian-specific terms live under the `https://ricardianbase.com/vocab#`
 *   namespace. This gives us full control over the domain vocabulary
 *   (Contract, Milestone, Party, status transitions, etc).
 * - schema.org is pulled in for common types (Person, MonetaryAmount) where
 *   it's already the industry standard.
 * - xsd is used for strong type hints on dates and datetimes so consumers
 *   know exactly how to parse them.
 *
 * The `@version: 1.1` pragma enables JSON-LD 1.1 features such as typed
 * `@container: @list` (used to keep milestones in their authored order).
 */

export const RICARDIAN_VOCAB_URL = 'https://ricardianbase.com/vocab#';

export const RICARDIAN_JSONLD_CONTEXT = {
  '@version': 1.1,
  '@vocab': RICARDIAN_VOCAB_URL,
  schema: 'https://schema.org/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',

  // Reuse schema.org types where they're the natural fit
  Person: 'schema:Person',
  MonetaryAmount: 'schema:MonetaryAmount',

  // Milestones are an ordered list, not an unordered set
  milestones: {
    '@id': `${RICARDIAN_VOCAB_URL}milestones`,
    '@container': '@list',
  },

  // Date / datetime typing so consumers know how to parse
  startDate: { '@id': `${RICARDIAN_VOCAB_URL}startDate`, '@type': 'xsd:date' },
  endDate: { '@id': `${RICARDIAN_VOCAB_URL}endDate`, '@type': 'xsd:date' },
  dueDate: { '@id': `${RICARDIAN_VOCAB_URL}dueDate`, '@type': 'xsd:date' },
  createdAt: {
    '@id': `${RICARDIAN_VOCAB_URL}createdAt`,
    '@type': 'xsd:dateTime',
  },
  updatedAt: {
    '@id': `${RICARDIAN_VOCAB_URL}updatedAt`,
    '@type': 'xsd:dateTime',
  },
  submittedAt: {
    '@id': `${RICARDIAN_VOCAB_URL}submittedAt`,
    '@type': 'xsd:dateTime',
  },
  approvedAt: {
    '@id': `${RICARDIAN_VOCAB_URL}approvedAt`,
    '@type': 'xsd:dateTime',
  },
  paidAt: {
    '@id': `${RICARDIAN_VOCAB_URL}paidAt`,
    '@type': 'xsd:dateTime',
  },
} as const;
