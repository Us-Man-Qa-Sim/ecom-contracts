import { z } from 'zod';
import { EventEnvelope, EventEnvelopeSchema } from './envelope';
import {
  OrderCancelledPayloadSchema,
  OrderConfirmedPayloadSchema,
  OrderCreatedPayloadSchema,
  OrderDeliveredPayloadSchema,
  OrderShippedPayloadSchema,
  OrderStockReservationFailedPayloadSchema,
  OrderStockReservedPayloadSchema,
  UserRegisteredPayloadSchema,
} from './payloads';
import { TOPICS, TopicName } from './topics';

export const EVENT_PAYLOAD_SCHEMAS = {
  [TOPICS.ORDER_CREATED]: OrderCreatedPayloadSchema,
  [TOPICS.ORDER_STOCK_RESERVED]: OrderStockReservedPayloadSchema,
  [TOPICS.ORDER_STOCK_RESERVATION_FAILED]: OrderStockReservationFailedPayloadSchema,
  [TOPICS.ORDER_CONFIRMED]: OrderConfirmedPayloadSchema,
  [TOPICS.ORDER_CANCELLED]: OrderCancelledPayloadSchema,
  [TOPICS.ORDER_SHIPPED]: OrderShippedPayloadSchema,
  [TOPICS.ORDER_DELIVERED]: OrderDeliveredPayloadSchema,
  [TOPICS.USER_REGISTERED]: UserRegisteredPayloadSchema,
} as const satisfies Record<TopicName, z.ZodType>;

export type EventPayloadMap = {
  [T in TopicName]: z.infer<(typeof EVENT_PAYLOAD_SCHEMAS)[T]>;
};

export type TypedEventEnvelope<T extends TopicName> = EventEnvelope<EventPayloadMap[T]> & {
  eventType: T;
};

/**
 * Validates a decoded Kafka message value against the envelope schema and the
 * payload schema registered for `topic`. Throws a ZodError on invalid input,
 * or an Error when the envelope's eventType does not match the topic.
 */
export function parseEvent<T extends TopicName>(topic: T, value: unknown): TypedEventEnvelope<T> {
  const envelope = EventEnvelopeSchema.parse(value);
  if (envelope.eventType !== topic) {
    throw new Error(`eventType "${envelope.eventType}" does not match topic "${topic}"`);
  }
  const payload = EVENT_PAYLOAD_SCHEMAS[topic].parse(envelope.payload) as EventPayloadMap[T];
  return { ...envelope, eventType: topic, payload };
}
