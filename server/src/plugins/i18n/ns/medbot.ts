import { params } from '@nanostores/i18n';

export const medbotNs = {
  test: '',
  menuButtonOrderTitle: '',
  menuButtonAppointmentTitle: '',
  subscriptionOrderComplete: '',
  oneTimeOrderComplete: '',
  appointmentCreated: params('{date}'),
  appointmentUpdated: params('{date}'),
  appointmentDeleted: '',
  completeAppointmentSubscriptionOrder: '',
  completeAppointmentOneTimeOrder: '',
  appointmentDeleteByDoctor: '',
  oneTimeProduct: '',
  subscriptionProduct: '',
  successfulPayment: params('{productName}{productDetails}{codes}'),
  activationCodesInfo: params('{activationCodes}'),

  forumOrderNotActive: '',

  entryMessage: '',
  forumNewOrder: params('{link}{productName}{subscription}'),
  yes: '',
  no: '',
  orderNotPaid: '',
  checkSubscriptionMiddlewareError: '',

  debugInfo: params('{userId}{email}'),
  debugCommandDescription: '',
};
