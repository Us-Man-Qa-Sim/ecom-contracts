export const TOPICS = {
  ORDER_CREATED: 'order.created',
  ORDER_STOCK_RESERVED: 'order.stock-reserved',
  ORDER_STOCK_RESERVATION_FAILED: 'order.stock-reservation-failed',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  USER_REGISTERED: 'user.registered',
  STORE_CREATED: 'store.created',
  STORE_UPDATED: 'store.updated',
  STORE_STATUS_CHANGED: 'store.status-changed',
} as const;

export type TopicName = (typeof TOPICS)[keyof typeof TOPICS];
