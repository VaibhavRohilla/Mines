
import * as PIXI from 'pixi.js';
import { App } from './App';
import { MyEmitter } from './MyEmitter';
import { SceneManager } from './SceneManager';
import { Graphics } from 'pixi.js';
import { Howl } from 'howler';

type globalDataType = {
  soundResources: { [key: string]: Howl };
  resources: PIXI.utils.Dict<PIXI.LoaderResource>;
  emitter: MyEmitter | undefined;
  isMobile: boolean;
  // SceneManager : SceneManager | undefined,

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
  // SceneManager : undefined,
  soundResources: {},
  // fpsStats: undefined,
  App: undefined
};
