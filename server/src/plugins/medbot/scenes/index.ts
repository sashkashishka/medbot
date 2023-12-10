import { Scenes } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import { SCENES } from '../constants/scenes.js';
import { orderScene } from './order/index.js';
import { appointmentScene } from './appointment/index.js';

export const stage = new Scenes.Stage<iMedbotContext>(
  [orderScene, appointmentScene],
  {
    default: SCENES.ORDER,
  },
);
