import * as PIXI from 'pixi.js';
import { Scene } from './Scene';
import { ball } from './ball';
import { GameData, Globals, colors, tube } from './Globals';
import { Graphics, Sprite } from 'pixi.js';
import { GameGenerator } from './GameGenerator';
import { start } from 'repl';
import { ButtonG, ButtonS } from './Button';
import { levelGenerator, addOnCancelCallback } from './LevelLib/GenerateLevels';
import { addOnBallAssignCallback as onLevelChangeCallBack } from './LevelLib/Level';


export class MainScene extends Scene {

    game!: GameGenerator;
    levelGen !: levelGenerator;
    startButton!: ButtonG;
    levelButton!: ButtonG;


    constructor() {
        super(0x222021);

        this.startButtons();

        addOnCancelCallback(this.leavePage.bind(this));
        onLevelChangeCallBack(this.changeLevel.bind(this));
    }


    leavePage() {
        this.levelGen.destroy();
        this.startButtons();
    }
    changeLevel(index: number) {
        console.log(index);
        this.levelGen.destroy();
        this.game = new GameGenerator();
        this.mainContainer.addChild(this.game);
    }
    update(dt: number): void {
        // throw new Error('Method not implemented.');
    }

    recievedMessage(msgType: string, msgParams: any): void {
        // throw new Error('Method not implemented.');
        console.log(msgType);

        // if (msgType == "addToScene") {
        //     console.log("CALLED");

        //     this.addToScene(msgParams);
        // }

        if (msgType == "LevelFinished") {
            this.game.destroy();
            this.game = new GameGenerator();
            this.mainContainer.addChild(this.game);
        }
        if (msgType == "MainScreen") {
            this.game.destroy();
            this.startButtons();
        }

    }

    startButtons() {


        this.startButton = new ButtonG(0x000000, 1, "Start ▶", { x: 450, y: 550 }, 0xffffff, () => {
            this.game = new GameGenerator();
            this.mainContainer.addChild(this.game);
            this.startButton.destroy();
            this.levelButton.destroy();
        })
        this.startButton.setActive(true);
        this.mainContainer.addChild(this.startButton);

        this.levelButton = new ButtonG(0x000000, 1, "Levels", { x: 450, y: 750 }, 0xffffff, () => {
            this.startButton.destroy();
            this.levelButton.destroy();
            this.levelGen = new levelGenerator();
            this.mainContainer.addChild(this.levelGen);
        })
        this.levelButton.setActive(true);
        this.mainContainer.addChild(this.levelButton);

        this.levelButton.on("pointerdown", () => {

        })


    }



}