import { Scenes } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import { SCENES } from '../constants/scenes.js';
import { orderScene } from './order/index.js';
import { forumScene } from './forum/index.js';
import { chatScene } from './chat/index.js';

export const medbotScenes = new Scenes.Stage<iMedbotContext>(
  [orderScene, chatScene],
  {
    default: SCENES.ORDER,
  },
);

export const forumScenes = new Scenes.Stage<iMedbotContext>([forumScene], {
  default: SCENES.FORUM,
});
