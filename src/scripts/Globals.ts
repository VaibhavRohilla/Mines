
import * as PIXI from 'pixi.js';
import { App } from './App';
import { MyEmitter } from './MyEmitter';
import { SceneManager } from './SceneManager';
import { Graphics } from 'pixi.js';

type globalDataType = {
  resources: PIXI.utils.Dict<PIXI.LoaderResource>;
  emitter: MyEmitter | undefined;
  isMobile: boolean;
  // fpsStats : Stats | undefined,
  App: App | undefined,
};

export const Globals: globalDataType = {
  resources: {},
  emitter: undefined,
  get isMobile() {
    //  return true;
    return PIXI.utils.isMobile.any;
  },
  // fpsStats: undefined,
  App: undefined
};

export function getColor(color: string) {

  if (color == 'r') {
    return 0xFF0000;

  } else if (color == 'g') {
    return 0xAAFF00;

  } else if (color == 'b') {
    return 0x1E90FF;

  } else if (color == 'y') {

    return 0xFFEA00;
  }
  return 0xFFFFFF;
}

type color = 'r' | 'g' | 'b' | 'y';
export const colors: color[] = ['r', 'g', 'b', 'y'];
export type tube = color[];

export const GameGeneratorOffset = {
  tubeXPos: 150,
  tubeYPos: 720,
  tubeYOffset: 500,
  ballXPos: 200,
  ballYPos: 1000,
  ballXOffset: 200,
  ballYOffset: -150,
}

export function makeTube() {
  const tube = new Graphics();
  tube.lineStyle(4, 0xFFFFFF, 1);
  tube.beginFill(0x000000, 0.1);
  tube.drawRect(0, 0, 100, (GameData.height + 1) * 70);
  tube.endFill();
  return tube;
}

export const GameData = {
  currentLevel: 1,
  noOfTubes: 4,
  noOfColorsUsed: 3,
  height: 4,
  noOfIterations: 4,
}