import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { Telegraf, Scenes, session } from 'telegraf';
import { message } from 'telegraf/filters';

// Use TypeScript module augmentation to declare the type of server.medbot to be medbotClient
declare module 'fastify' {
  interface FastifyInstance {
    medbot: Telegraf;
  }
}

const token = process.env.TG_BOT_TOKEN;
const forumId = process.env.TG_BOT_FORUM_ID;

const bot = new Telegraf(token);

// const stage = new Scenes.Stage([contactDataWizard]);

bot.use(session()); // to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
// bot.use(stage.middleware());

bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

// bot.hears('scene', Scenes.Stage.enter('CONTACT_DATA_WIZARD_SCENE_ID'));

bot.telegram.setMyCommands(
  [
    {
      command: 'close',
      description: 'End consultation',
    },
  ],
  { scope: { type: 'chat_administrators', chat_id: forumId } },
);

bot.command('close', (ctx) => {
  console.log('$$$ close command', ctx.message);
});

let forumTopic;

bot.on('message', async (ctx) => {
  const chatId = ctx.message.chat.id;

  // if (forumId !== chatId) {
  //   if (!forumTopic) {
  //     forumTopic = await bot.telegram.createForumTopic(forumId, `User: ${ctx.message.from.id}`);
  //   }

  //   console.log(ctx.message)

  //   return await ctx.telegram.copyMessage(forumId, chatId, ctx.message.message_id, { message_thread_id: forumTopic.message_thread_id })
  // }

  console.log('$$$ message', ctx.message);

  // fs.writeFileSync('./update.json', JSON.stringify(ctx, null, '  '))

  // console.log(ctx.update)
  // Explicit usage
  // await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)
});

const medbotPlugin: FastifyPluginAsync = fp(async (server) => {
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
