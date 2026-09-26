import { join } from 'node:path';

// Compiled to dist/proto-paths.js; the .proto files ship alongside dist/ in the package.
export const PROTO_ROOT = join(__dirname, '..', 'proto');

export const PROTO_FILES = {
  common: join(PROTO_ROOT, 'ecom/common/v1/common.proto'),
  user: join(PROTO_ROOT, 'ecom/user/v1/user.proto'),
  product: join(PROTO_ROOT, 'ecom/product/v1/product.proto'),
  order: join(PROTO_ROOT, 'ecom/order/v1/order.proto'),
} as const;

/**
 * @grpc/proto-loader options that match the ts-proto generated types:
 * camelCase fields, numeric enums, defaults populated, Timestamps as objects.
 * Use as `loader` in NestJS gRPC client/server options.
 */
export const GRPC_LOADER_OPTIONS = {
  keepCase: false,
  longs: Number,
  enums: Number,
  defaults: true,
  arrays: true,
  objects: true,
  oneofs: true,
  includeDirs: [PROTO_ROOT],
};
