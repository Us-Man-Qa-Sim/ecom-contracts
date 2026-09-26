# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-09-26

### Added

- Buf v2 config with STANDARD lint and FILE breaking-change detection.
- Proto definitions: `common.proto` (pagination, `Money`), `user.proto` (11 RPCs),
  `product.proto` (7 RPCs), `order.proto` (7 RPCs). Timestamps use
  `google.protobuf.Timestamp`.
- Prices and totals use `ecom.common.v1.Money` (`Product.price`, `Order.total`,
  `OrderItem.unit_price`).
- `UpdateProductRequest` uses `AttributesUpdate` / `ImagesUpdate` wrappers so
  "leave unchanged" and "clear" are distinguishable.
- ts-proto code generation (`nestJs=true`, `addGrpcMetadata=true`).
- Event envelope type and zod validators for all 8 Kafka topics.
- `TOPICS` constants, `EVENT_PAYLOAD_SCHEMAS` topic → schema map, and a typed
  `parseEvent(topic, value)` helper.
- `PROTO_ROOT`, `PROTO_FILES` and `GRPC_LOADER_OPTIONS` for wiring NestJS gRPC
  servers/clients to the `.proto` files shipped in the package.
- Package exports for `@us-man-qa-sim/ecom-contracts`,
  `@us-man-qa-sim/ecom-contracts/events`, per-service generated subpaths, and
  `@us-man-qa-sim/ecom-contracts/proto/*`.
- Smoke tests (`node:test`): every proto loads and exposes the expected RPCs,
  and event parsing accepts valid events and rejects invalid ones.
- CI workflow (proto lint, breaking-change detection on PRs, ESLint, Prettier,
  build, stale-codegen check, tests).
- Published publicly to npmjs.com (`publishConfig.access: public`). Publish
  workflow (GitHub Actions on `v*` tags, npm trusted publishing, tag/version
  match check, GitHub Release); `prepublishOnly` runs all checks before any publish.

[Unreleased]: https://github.com/Us-Man-Qa-Sim/ecom-contracts/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Us-Man-Qa-Sim/ecom-contracts/releases/tag/v0.1.0
