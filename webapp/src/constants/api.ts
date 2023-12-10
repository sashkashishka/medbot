export enum API {
  PRODUCT_LIST = '/api/product/list',
  USER = '/api/user/:userId',
  ACTIVE_ORDER = '/api/order/active/:userId',
  WAITING_FOR_PAYMENT_ORDER = '/api/order/waiting-for-payment/:userId',
}
