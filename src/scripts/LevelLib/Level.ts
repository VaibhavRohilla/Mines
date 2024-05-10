import { Graphics, Sprite } from "pixi.js";
import { TextLabel } from "../TextLabel";
import { Globals } from "../Globals";
import { levelStars, levelVariables } from "./GlobalLevelVar";
import { Easing, Tween } from "@tweenjs/tween.js";

export class Level extends Graphics {
    isUnlocked: boolean = false;
    button: Graphics;
    tween: any;
    constructor(level: number) {
        super();
        console.log(levelVariables.unlocked);

        const currentStars = levelStars[level - 1];

        this.button = new Graphics();
        this.button.lineStyle(5, 0xFFFFFF, 1);
        this.button.beginFill(0xFF8C00);
        this.button.drawRoundedRect(0, 0, 110, 100, 30);
        this.button.position.x = 530;
        this.button.position.y = 50;
        this.button.pivot.set(1);
        this.button.endFill();
        this.addChild(this.button);
        this.button.interactive = true;
        this.button.buttonMode = true;

        this.button.on("pointerdown", () => {
            this.button.alpha = 0.8;

            if (useLevelCallBack)
                useLevelCallBack(level);
        })
        this.button.on("pointerup", () => {
            this.button.alpha = 1;
        })
        this.button.on("pointerout", () => {
            this.button.alpha = 1;
        })
        const text = new TextLabel(0, 0, 0.5, level.toString(), 50, 0xFFFFFF);
        text.position.x = this.button.width / 2 - 5;
        text.position.y = this.button.height / 2;
        this.button.addChild(text);

        if (level > levelVariables.unlocked) {
            this.button.alpha = 0.5;
            this.isUnlocked = false;
            this.button.interactive = false;
        }

        if (level <= levelVariables.unlocked) {
            this.button.alpha = 1;
            let startPos = 0;
            for (let i = 0; i < currentStars; i++) {
                let star = new Sprite(Globals.resources.star.texture);
                this.button.addChild(star);
                star.anchor.set(0.5);
                star.scale.set(0.05);

                star.position.y = -20;
                star.position.x = startPos + 20;
                startPos += star.width + 10;

                if (currentStars == 1) {
                    star.position.x = this.button.width / 2 - 5;
                }

            }
        }
    }
}
export function addOnBallAssignCallback(callback: (index: number) => void) {
    useLevelCallBack = callback;
}
let useLevelCallBack: ((index: number) => void) | undefined = undefined;