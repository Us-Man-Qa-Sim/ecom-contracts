// Smoke tests against the built package (run `npm run build` first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { loadSync } from '@grpc/proto-loader';
import { loadPackageDefinition } from '@grpc/grpc-js';

const require = createRequire(import.meta.url);
const contracts = require('@us-man-qa-sim/ecom-contracts');
const events = require('@us-man-qa-sim/ecom-contracts/events');

const EXPECTED_RPCS = {
  user: {
    service: 'UserService',
    rpcs: [
      'Register',
      'Login',
      'RefreshToken',
      'Logout',
      'GetMe',
      'GetUser',
      'CreateAddress',
      'UpdateAddress',
      'DeleteAddress',
      'ListAddresses',
      'GetAddress',
    ],
  },
  product: {
    service: 'ProductService',
    rpcs: [
      'CreateProduct',
      'UpdateProduct',
      'DeleteProduct',
      'GetProduct',
      'ListProducts',
      'GetProductsByIds',
      'AdjustStock',
    ],
  },
  order: {
    service: 'OrderService',
    rpcs: [
      'CreateOrder',
      'GetOrder',
      'ListMyOrders',
      'ListAllOrders',
      'CancelOrder',
      'ShipOrder',
      'DeliverOrder',
    ],
  },
};

test('proto files ship with the package', () => {
  for (const file of Object.values(contracts.PROTO_FILES)) {
    assert.ok(existsSync(file), `missing ${file}`);
  }
});

for (const [name, { service, rpcs }] of Object.entries(EXPECTED_RPCS)) {
  test(`${name}.proto loads with GRPC_LOADER_OPTIONS and exposes all RPCs`, () => {
    const definition = loadSync(contracts.PROTO_FILES[name], contracts.GRPC_LOADER_OPTIONS);
    const pkg = loadPackageDefinition(definition).ecom[name].v1;
    assert.deepEqual(Object.keys(pkg[service].service).sort(), [...rpcs].sort());
  });
}

test('every topic has a payload schema', () => {
  assert.deepEqual(
    Object.keys(events.EVENT_PAYLOAD_SCHEMAS).sort(),
    Object.values(events.TOPICS).sort(),
  );
});

const validEnvelope = {
  eventId: '0b8a4e1e-6a4f-4a4e-9b1a-2f4a3c5d6e7f',
  eventType: 'order.created',
  version: 1,
  occurredAt: '2026-09-26T12:00:00.000Z',
  correlationId: '5f2c8f0e-3d1b-4c6a-8e9f-1a2b3c4d5e6f',
  payload: {
    orderId: '7d9e2a1b-4c3f-4e5d-8a6b-9c0d1e2f3a4b',
    items: [{ productId: '66f5a1b2c3d4e5f6a7b8c9d0', quantity: 2 }],
  },
};

test('parseEvent accepts a valid order.created envelope', () => {
  const event = events.parseEvent(events.TOPICS.ORDER_CREATED, validEnvelope);
  assert.equal(event.payload.items[0].quantity, 2);
});

test('parseEvent rejects an invalid payload', () => {
  const bad = { ...validEnvelope, payload: { orderId: 'not-a-uuid', items: [] } };
  assert.throws(() => events.parseEvent(events.TOPICS.ORDER_CREATED, bad));
});

test('parseEvent rejects an eventType that does not match the topic', () => {
  assert.throws(
    () => events.parseEvent(events.TOPICS.ORDER_CONFIRMED, validEnvelope),
    /does not match topic/,
  );
});
