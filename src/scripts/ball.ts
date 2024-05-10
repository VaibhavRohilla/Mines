import { Graphics, Resource, Sprite, Texture } from "pixi.js";
import { getColor } from "./Globals";
import { Easing, Tween } from "@tweenjs/tween.js";
import { lstat } from "fs";

export class ball extends Graphics {
    ballColor: string;
    lastPos: { x: number, y: number }[] = []
    recentPos: { x: number, y: number } = { x: 0, y: 0 }
    isUp: boolean = false;
    index!: number;

    constructor(color: string, xPos: number, yPos: number, indexX: number) {
        super();

        this.ballColor = color;

        this.beginFill(getColor(this.ballColor), 1);
        this.drawCircle(0, 0, 40);
        this.endFill();
        this.interactive = true;
        this.buttonMode = true;
        this.index = indexX;
        // console.log(yPos);
        // console.log(this.index);

        this.position.x = xPos;
        this.position.y = yPos;

        this.recentPos.x = xPos;
        this.recentPos.y = yPos;

    }

    spawnTween() {

    }

    moveUpTween(Pos: { x: number, y: number }) {
        this.isUp = true;

        new Tween(this)
            .to({ x: this.x, y: Pos.y }, 500)
            .easing(Easing.Bounce.Out)
            .start();
    }
    moveDownTween() {
        new Tween(this)
            .to({ y: this.recentPos.y }, 500)
            .easing(Easing.Bounce.Out)
            .start();
        this.isUp = false;

    }
    changeTubeTween(tubePos: { x: number, y: number }, index: number, finalPos: number) {
        // console.log(tubePos.y);
        this.isUp = false;
        console.log("INDEXXX AT CHANGE  : " + finalPos);


        this.index = index;
        const tween1 = new Tween(this.position)
            .to({ x: tubePos.x, y: tubePos.y }, 400)
            .easing(Easing.Exponential.Out)

        const tween2 = new Tween(this.position)
            .to({ x: tubePos.x, y: tubePos.y }, 500)
            .easing(Easing.Exponential.Out)

        const tween3 = new Tween(this.position)
            .to({ x: tubePos.x, y: finalPos }, 400)
            .easing(Easing.Bounce.Out)


        this.lastPos.push({ x: tubePos.x, y: finalPos });
        this.recentPos.x = tubePos.x;
        this.recentPos.y = finalPos;
        tween1.chain(tween2.chain(tween3));
        tween1.start();
    }

}