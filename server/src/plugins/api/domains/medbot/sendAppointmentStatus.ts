import type { RouteOptions } from 'fastify';

const STATUSES = ['created', 'updated', 'deleted'] as const;

type tStatuses = (typeof STATUSES)[number];

interface iBody {
  status: tStatuses;
}

// TODO rename method to point that it relates 
// to webapp answerQuery
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

    return this.medbotSdk.sendAppointmentStatus($tgQueryId, status);
  },
};
