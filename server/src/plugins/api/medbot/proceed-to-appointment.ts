import type { RouteOptions } from 'fastify';

export const proceedToAppointmentRoute: RouteOptions = {
  method: 'GET',
  url: '/medbot/proceed-to-appointment',
  async handler(req) {
    const { tgQueryId } = req;

    return this.medbot.telegram.answerWebAppQuery(tgQueryId, {
      id: '0',
      type: 'article',
      title: 'Order was successfully paid!',
      input_message_content: {
        message_text: '/proceedToAppointment',
      },
    });
  },
};
