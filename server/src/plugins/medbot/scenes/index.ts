import { Scenes } from 'telegraf';
import { enterScene, testScene } from './enter/index.js';

export const stage = new Scenes.Stage([enterScene, testScene]);
