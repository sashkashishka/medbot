export enum API {
  PRODUCT_LIST = '/api/product/list',
  USER = '/api/user/:userId',
  CREATE_USER = '/api/user/create',
  UPDATE_USER = '/api/user/update/:userId',
  ACTIVE_ORDER = '/api/order/active/:userId',
  WAITING_FOR_PAYMENT_ORDER = '/api/order/waiting-for-payment/:userId/:productId',
  CREATE_ORDER = '/api/order/create',
  UPDATE_ORDER = '/api/order/update/:orderId',
  MEDBOT_PROCEED_TO_APPOINTMENT = '/api/medbot/proceed-to-appointment',
}
