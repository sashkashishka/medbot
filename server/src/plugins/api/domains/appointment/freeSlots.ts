import { addWeeks, startOfDay } from 'date-fns';
import type { RouteOptions } from 'fastify';
import { getFreeSlots } from '../../../../utils/time.js';

export const freeSlotsRoute: RouteOptions = {
  method: 'GET',
  url: '/appointment/free-slots',
  async handler() {
    const data = await this.prisma.appointment.findMany({
      where: {
        status: 'ACTIVE',
        time: {
          gte: new Date().toISOString(),
          lte: addWeeks(startOfDay(new Date()), 2).toISOString(),
        },
      },
    });

    return getFreeSlots(data);
  },
};
