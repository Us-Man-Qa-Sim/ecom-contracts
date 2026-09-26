# contracts

Shared `.proto` definitions and event schemas for the ecom microservices platform.

Published as an npm package via GitHub Packages so every service imports the same generated TypeScript types.

## Contents

- `proto/` — gRPC service definitions (user, product, order, common types)
- `events/` — Kafka event envelope + payload types, zod validators, topic constants
- `generated/` — TypeScript output from `ts-proto` (committed for convenience)

## Usage

```bash
npm install @<org>/contracts
```

```typescript
import { UserServiceClient } from '@<org>/contracts/generated/user';
import { TOPICS, OrderCreatedPayload } from '@<org>/contracts/events';
```

## Development

```bash
npm install
npm run proto:lint      # buf lint
npm run proto:breaking  # buf breaking --against .git#branch=main
npm run proto:generate  # ts-proto code generation
npm run build           # compile TypeScript
```

## Versioning

Follows semver. Published automatically via GitHub Actions on tagged releases.
