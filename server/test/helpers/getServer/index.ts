import { type Test } from 'tap';
import { main } from '../../../src/server.js';
import { medbotPluginMock } from './plugins/medbotPlugin.js';
import { googleCalendarPluginMock } from './plugins/googleCalendarPlugin.js';
import { applyScenario, type tScenario } from './scenarios/index.js';

interface iOptions {
  t: Test;
  scenarios?: Array<tScenario>;
}

export async function getServer({ t, scenarios }: iOptions) {
  const fastify = await main({
    plugins: {
      medbot: medbotPluginMock,
      googleCalendar: googleCalendarPluginMock,
    },
  });

  applyScenario(fastify.prisma, scenarios);

  return {
    fastify,
    generateEndpoint(end: string) {
      return `http://127.0.0.1:${fastify.server.address()!.port}${end}`;
    },
    async cleanup() {
      await fastify.prisma.$transaction([
        fastify.prisma.product.deleteMany(),
        fastify.prisma.user.deleteMany(),
        fastify.prisma.order.deleteMany(),
        fastify.prisma.appointment.deleteMany(),
        fastify.prisma.admin.deleteMany(),
        fastify.prisma.telegrafSessions.deleteMany(),
        fastify.prisma.activationCode.deleteMany(),
      ]);

      await fastify.close();
    },
  };
}
