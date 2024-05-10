import { Container, Graphics, InteractionEvent, Sprite } from "pixi.js";
import { levelStars, levelVariables, pos } from "./GlobalLevelVar";
import { Level } from "./Level";
import { GameData, Globals } from "../Globals";
import { TextLabel } from "../TextLabel";
import { clamp, fetchGlobalPosition, getMousePosition } from "../Utilities";
import { config } from "../appConfig";
import { Easing, Tween } from "@tweenjs/tween.js";


export class levelGenerator extends Container {

    divContainer: divContainer;
    currentPage: number = 0;
    constructor() {
        super();

        levelVariables.unlocked = GameData.currentLevel;

        const levelsText = new TextLabel(0, 0, 0.5, "L E V E L S", 70, 0xFF8C00);
        levelsText.position.x = 550;
        levelsText.position.y = 80;
        levelsText.style.dropShadow = true;
        levelsText.style.stroke = 0xFFFFFF;
        levelsText.style.strokeThickness = 3;

        this.addChild(levelsText);

        this.divContainer = new divContainer();
        this.divContainer.y = 250;
        this.addChild(this.divContainer);



        this.cancelButton();
        this.movingBtns();
    }
    cancelButton() {
        const cancel = new Sprite(Globals.resources.cancel.texture);
        cancel.anchor.set(0.5);
        cancel.position.x = 1000;
        cancel.position.y = 80;
        cancel.interactive = true;
        cancel.buttonMode = true;
        cancel.scale.set(0.2);
        cancel.on("pointerdown", () => {
            cancel.alpha = 0.8;
            if (onCancelCallback) {
                onCancelCallback();
            }

        })
        cancel.on("pointerup", () => {
            cancel.alpha = 1;
        })
        cancel.on("pointerout", () => {
            cancel.alpha = 1;
        })
        this.addChild(cancel);
    }

    movingBtns() {

        const leftBtn = new Sprite(Globals.resources.leftBtn.texture);
        leftBtn.scale.set(0.5);
        leftBtn.anchor.set(0.5);
        leftBtn.position.x = 50;
        leftBtn.position.y = 950;
        leftBtn.interactive = true;
        leftBtn.buttonMode = true;
        this.addChild(leftBtn);


        leftBtn.on("pointerdown", () => {
            // console.log(this.currentPage);

            if (this.currentPage > 0) {
                this.divContainer.moveleft();
                this.currentPage--;
            }

        })
        const RightBtn = new Sprite(Globals.resources.rightBtn.texture);
        RightBtn.scale.set(0.5);
        RightBtn.anchor.set(0.5);
        RightBtn.position.x = 1000;
        RightBtn.position.y = 950;
        RightBtn.interactive = true;
        RightBtn.buttonMode = true;
        this.addChild(RightBtn);

        RightBtn.on("pointerdown", () => {
            // console.log(this.currentPage);

            if (this.currentPage < this.divContainer.pages - 1) {
                this.divContainer.moveRight();
                this.currentPage++;
            }

        })


    }
}

export class divContainer extends Container {
    levels: Level[][] = [];
    pages: number = 0;
    constructor() {

        super();
        let xPos = -350;
        let yPos = 0;

        let recentX = pos.xPos;
        let j = 0;
        for (let i = 0; i < 200; i++) {
            if (i == 0) {
                this.levels[this.pages] = [];
            }
            let x = new Level(i + 1);
            x.position.x = xPos;
            x.position.y = yPos;

            xPos += pos.xOffset;
            this.levels[this.pages][j] = x;
            j++;
            if (yPos >= 1300 && xPos >= recentX + 750) {
                this.pages++;
                let nextX = recentX + 1000;
                recentX = nextX;
                xPos = recentX;
                yPos = pos.yPos - 250;
                j = 0;
                this.levels[this.pages] = [];
            }
            if (xPos >= recentX + 750 && yPos <= 1300) {
                xPos = recentX;
                yPos += pos.yOffset;
            }



            this.addChild(x);
        }
    }

    moveRight() {
        new Tween(this)
            .to({ x: this.x - 1000 }, 200)
            .easing(Easing.Exponential.Out)
            .start();

    }

    moveleft() {
        new Tween(this)
            .to({ x: this.x + 1000 }, 200)
            .easing(Easing.Exponential.Out)
            .start();
    }
}
export function addOnCancelCallback(callBack: () => void) {
    onCancelCallback = callBack;
}
let onCancelCallback: (() => void) | undefined = undefined;