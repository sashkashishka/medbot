import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';

export const enterScene = new Scenes.WizardScene(
  SCENES.ENTER,
  (ctx) => {
    ctx.reply('What is your name?');
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    // validation example
    if (ctx.message.text.length < 2) {
      ctx.reply('Please enter name for real');
      return;
    }
    ctx.wizard.state.contactData.fio = ctx.message.text;
    ctx.reply('Enter your e-mail');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.contactData.email = ctx.message.text;
    ctx.reply("Thank you for your replies, we'll contact your soon");
    // await mySendContactDataMomentBeforeErase(ctx.wizard.state.contactData);
    return ctx.scene.enter(SCENES.TEST);
  },
);

export const testScene = new Scenes.WizardScene(SCENES.TEST, (ctx) => {
  ctx.reply('This is test message!!!!!');

  return ctx.scene.leave();
});

// enterScene.on('text', () => {});
