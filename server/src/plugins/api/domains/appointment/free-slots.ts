import dayjs from 'dayjs';
import type { RouteOptions } from 'fastify';
import { getFreeSlots } from '../../utils/time.js';

export const freeSlotsRoute: RouteOptions = {
  method: 'GET',
  url: '/appointment/free-slots',
  async handler() {
    const data = await this.prisma.appointment.findMany({
      where: {
        status: 'ACTIVE',
        time: {
          gte: dayjs().toISOString(),
          lte: dayjs().add(2, 'weeks').startOf('day').toISOString(),
        },
      },
    });

    return getFreeSlots(data);
  },
};
