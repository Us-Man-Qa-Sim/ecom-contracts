import { z } from 'zod/v4';

// --- order.created ---

export const OrderCreatedPayloadSchema = z.object({
  orderId: z.uuid(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.int().min(1),
    }),
  ),
});

export type OrderCreatedPayload = z.infer<typeof OrderCreatedPayloadSchema>;

// --- order.stock-reserved ---

export const OrderStockReservedPayloadSchema = z.object({
  orderId: z.uuid(),
});

export type OrderStockReservedPayload = z.infer<typeof OrderStockReservedPayloadSchema>;

// --- order.stock-reservation-failed ---

export const OrderStockReservationFailedPayloadSchema = z.object({
  orderId: z.uuid(),
  reason: z.string().min(1),
});

export type OrderStockReservationFailedPayload = z.infer<
  typeof OrderStockReservationFailedPayloadSchema
>;

// --- order.confirmed ---

export const OrderConfirmedPayloadSchema = z.object({
  orderId: z.uuid(),
  userId: z.uuid(),
});

export type OrderConfirmedPayload = z.infer<typeof OrderConfirmedPayloadSchema>;

// --- order.cancelled ---

export const OrderCancelledPayloadSchema = z.object({
  orderId: z.uuid(),
  userId: z.uuid(),
  reason: z.string().optional(),
});

export type OrderCancelledPayload = z.infer<typeof OrderCancelledPayloadSchema>;

// --- order.shipped ---

export const OrderShippedPayloadSchema = z.object({
  orderId: z.uuid(),
  userId: z.uuid(),
});

export type OrderShippedPayload = z.infer<typeof OrderShippedPayloadSchema>;

// --- order.delivered ---

export const OrderDeliveredPayloadSchema = z.object({
  orderId: z.uuid(),
  userId: z.uuid(),
});

export type OrderDeliveredPayload = z.infer<typeof OrderDeliveredPayloadSchema>;

// --- user.registered ---

export const UserRegisteredPayloadSchema = z.object({
  userId: z.uuid(),
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type UserRegisteredPayload = z.infer<typeof UserRegisteredPayloadSchema>;
