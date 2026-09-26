# contracts

Shared `.proto` definitions and event schemas for the ecom microservices platform.

Published as `@us-man-qa-sim/ecom-contracts` to GitHub Packages so every service imports the same generated TypeScript types.

## Contents

- `proto/` — gRPC service definitions (user, product, order, common types); shipped in the package
- `events/` — Kafka event envelope + payload types, zod validators, topic constants, `parseEvent`
- `generated/` — TypeScript output from `ts-proto` (committed; CI fails if it is stale)
- `proto-paths.ts` — runtime paths to the shipped `.proto` files + matching proto-loader options

## Installing

GitHub Packages needs a registry mapping and a token with `read:packages`. In the consuming repo, add `.npmrc`:

```ini
@us-man-qa-sim:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then:

```bash
npm install --save-exact @us-man-qa-sim/ecom-contracts
```

In GitHub Actions, `secrets.GITHUB_TOKEN` works if the package grants the consuming repo read access (package settings → Manage Actions access). In Docker builds, pass the token as a build secret, not an `ARG`.

## Usage

### gRPC server (NestJS)

```typescript
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PROTO_FILES, GRPC_LOADER_OPTIONS } from '@us-man-qa-sim/ecom-contracts';
import { ECOM_USER_V1_PACKAGE_NAME } from '@us-man-qa-sim/ecom-contracts/generated/user';

app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.GRPC,
  options: {
    package: ECOM_USER_V1_PACKAGE_NAME,
    protoPath: PROTO_FILES.user,
    loader: GRPC_LOADER_OPTIONS,
    url: '0.0.0.0:50051',
  },
});
```

Implement the generated `UserServiceController` interface and decorate the class with the generated `UserServiceControllerMethods()`.

### gRPC client (NestJS)

```typescript
ClientsModule.register([
  {
    name: 'USER_SERVICE',
    transport: Transport.GRPC,
    options: {
      package: ECOM_USER_V1_PACKAGE_NAME,
      protoPath: PROTO_FILES.user,
      loader: GRPC_LOADER_OPTIONS,
      url: 'user-service:50051',
    },
  },
]);
// then: client.getService<UserServiceClient>(USER_SERVICE_NAME)
```

Always use `GRPC_LOADER_OPTIONS`. It keeps runtime values consistent with the generated types: camelCase fields, numeric enums, populated defaults, and `Timestamp` as `{ seconds, nanos }`.

### Kafka events

```typescript
import { TOPICS, parseEvent } from '@us-man-qa-sim/ecom-contracts/events';

const event = parseEvent(TOPICS.ORDER_CREATED, JSON.parse(message.value.toString()));
event.payload.items; // typed as OrderCreatedPayload['items']
```

`parseEvent` validates the envelope, checks `eventType` matches the topic, and validates the payload. It throws on invalid input.

### Money

Prices and totals use `ecom.common.v1.Money` (`amountMinor` integer minor units + ISO 4217 `currency`), never floats.

## Development

```bash
npm install
npm run proto:lint      # buf lint
npm run proto:breaking  # buf breaking --against .git#branch=main
npm run proto:generate  # ts-proto code generation
npm run build           # codegen + compile TypeScript
npm run lint            # eslint
npm run format:check    # prettier
npm test                # smoke tests against dist/ (build first)
```

## Releasing

Follows semver; record changes in `CHANGELOG.md`.

```bash
npm version minor   # runs lint + build + test, bumps package.json, commits, tags vX.Y.Z
git push --follow-tags
```

The tag triggers the Publish workflow. It verifies the tag matches `package.json`, publishes to GitHub Packages and creates a GitHub Release.
