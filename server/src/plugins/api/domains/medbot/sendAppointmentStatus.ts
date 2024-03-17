import type { RouteOptions } from 'fastify';
import { capitalize } from '../../utils/string.js';

const STATUSES = ['created', 'updated', 'deleted'] as const;

type tStatuses = (typeof STATUSES)[number];

interface iBody {
  status: tStatuses;
}

export const sendAppointmentStatusRoute: RouteOptions = {
  method: 'POST',
  url: '/send-appointment-status',
  schema: {
    body: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: STATUSES,
        },
      },
      required: ['status'],
    },
  },
  handler(req) {
    const { $tgQueryId } = req;
    const { status } = req.body as iBody;

    return this.medbot.telegram.answerWebAppQuery($tgQueryId, {
      id: `${Math.random()}`,
      type: 'article',
      title: 'Оновлення статусу зустрічі',
      input_message_content: {
        message_text: `/appointment${capitalize(status)}`,
      },
    });
  },
};
