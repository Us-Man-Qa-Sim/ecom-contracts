import { z } from 'zod';

export const ENVELOPE_VERSION = 2;

export const EventEnvelopeSchema = z.object({
  eventId: z.uuid(),
  eventType: z.string().min(1),
  version: z.int().min(1),
  occurredAt: z.iso.datetime(),
  correlationId: z.uuid(),
  storeId: z.union([z.uuid(), z.null()]).optional(),
  payload: z.record(z.string(), z.unknown()),
});

export type EventEnvelope<T = Record<string, unknown>> = Omit<
  z.infer<typeof EventEnvelopeSchema>,
  'payload'
> & {
  payload: T;
};
