import type { RouteOptions } from 'fastify';

export const proceedToChatRoute: RouteOptions = {
  method: 'GET',
  url: '/medbot/proceed-to-chat',
  handler(req) {
    const { $tgQueryId } = req;

    return this.medbot.telegram.answerWebAppQuery($tgQueryId, {
      id: '0',
      type: 'article',
      title: 'Дякуємо за замовлення!',
      input_message_content: {
        message_text: '/successfullOrder',
      },
    });
  },
};

