import { Scenes } from 'telegraf';
import { enterScene } from './enter/index.js';
import type { iMedbotContext } from '../types.js';
import { SCENES } from '../constants/scenes.js';

export const stage = new Scenes.Stage<iMedbotContext>([enterScene], {
  default: SCENES.ENTER,
});
