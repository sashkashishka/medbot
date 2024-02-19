export enum API {
  PRODUCT_LIST = '/api/product/list',
  USER = '/api/user/:userId',
  CREATE_USER = '/api/user/create',
  UPDATE_USER = '/api/user/update/:userId',
  ACTIVE_ORDER = '/api/order/active/:userId',
  WAITING_FOR_PAYMENT_ORDER = '/api/order/waiting-for-payment/:userId/:productId',
  CREATE_ORDER = '/api/order/create',
  UPDATE_ORDER = '/api/order/update/:orderId',
  CREATE_ORDER_BY_CODE = '/api/order/create/:code',
  MEDBOT_SEND_APPOINTMENT_STATUS = '/api/medbot/send-appointment-status',
  MEDBOT_PROCEED_TO_CHAT = '/api/medbot/proceed-to-chat',
  ACTIVE_APPOINTMENT = '/api/appointment/:userId',
  FREE_SLOTS = '/api/appointment/free-slots',
  CREATE_APPOINTMENT = '/api/appointment/create',
  UPDATE_DELETE_APPOINTMENT = '/api/appointment/:appointmentId',
}
