import type { MiddlewareFn, NarrowedContext, Types } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import { SCENES } from '../constants/scenes.js';
import { medbotLogger } from '../../../logger.js';

export const cleanupOnSecondStartCommand: MiddlewareFn<
  NarrowedContext<iMedbotContext, Types.MountMap['text']>
> = async function cleanupOnSecondStartCommand(ctx, next) {
  if (ctx.session?.__scenes?.current !== SCENES.ORDER) {
    ctx.session = {};

    const { update } = ctx;

    try {
      const orders = await ctx.prisma.order.findMany({
        where: { userId: update.message.from.id, status: 'ACTIVE' },
      });
      const appointments = await ctx.prisma.appointment.findMany({
        where: { userId: update.message.from.id, status: 'ACTIVE' },
      });

      const pendingArr = [];

      orders.forEach((order) => {
        pendingArr.push(
          ctx.prisma.order.update({
            where: { id: order?.id },
            data: { status: 'DONE' },
          }),
        );
      });
      appointments.map((appointment) => {
        pendingArr.push(
          ctx.prisma.appointment.update({
            where: { id: appointment?.id },
            data: { status: 'DELETED' },
          }),
        );

        pendingArr.push(
          ctx.googleCalendar.events.delete({
            calendarId: ctx.googleCalendarId,
            eventId: appointment.calendarEventId,
          }),
        );
      });

      await Promise.all(pendingArr);
    } catch (e) {
      medbotLogger.error(e, 'cleanupOnSecondStartCommand');
    }
  }

  return next();
};
