import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Telegraf, session } from 'telegraf';

import { stage } from './scenes/index.js';
import { commands } from './commands/index.js';
import { PrismaSessionStorage } from './services/storage/prisma.js';
import type { iMedbotContext } from './types.js';
import { SCENES } from './constants/scenes.js';

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    medbot: Telegraf;
  }
}

// bot.command('quit', async (ctx) => {
//   // Explicit usage
//   await ctx.telegram.leaveChat(ctx.message.chat.id);

//   // Using context shortcut
//   await ctx.leaveChat();
// });

// bot.command('close', (ctx) => {
//   console.log('$$$ close command', ctx.message);
// });

// let forumTopic;

// bot.on('message', async (ctx) => {
//   const chatId = ctx.message.chat.id;

//   // if (forumId !== chatId) {
//   //   if (!forumTopic) {
//   //     forumTopic = await bot.telegram.createForumTopic(forumId, `User: ${ctx.message.from.id}`);
//   //   }

//   //   console.log(ctx.message)

//   //   return await ctx.telegram.copyMessage(forumId, chatId, ctx.message.message_id, { message_thread_id: forumTopic.message_thread_id })
//   // }

//   console.log('$$$ message', ctx.message);

//   // fs.writeFileSync('./update.json', JSON.stringify(ctx, null, '  '))

//   // console.log(ctx.update)
//   // Explicit usage
//   // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)
// });

const medbotPlugin: FastifyPluginAsync = fp(async (server) => {
  const token = process.env.TG_BOT_TOKEN;
  const testEnv = !!Number(process.env.TG_BOT_TEST);
  const forumId = process.env.TG_BOT_FORUM_ID;

  const bot = new Telegraf<iMedbotContext>(token, { telegram: { testEnv }});
  const store = new PrismaSessionStorage(server.prisma);

  bot.use(session({ store })); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
  bot.use((ctx, next) => {
    ctx.prisma = server.prisma;

    return next();
  });

  // clear scene and start from scratch
  bot.command('start', (ctx, next) => {
    if (ctx.session?.__scenes?.current !== SCENES.ENTER) {
      ctx.session = {};
    }

    return next();
  });

  bot.use(stage.middleware());

  // Make medbot Client available through the fastify server instance: server.medbot
  server.decorate('medbot', bot);

  server.addHook('onListen', async () => {
    bot.launch();
  });

  server.addHook('onClose', async () => {
    bot.stop();
  });
});

export default medbotPlugin;
