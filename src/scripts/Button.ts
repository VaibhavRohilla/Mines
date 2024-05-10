import { Graphics, Resource, Sprite, Texture } from "pixi.js";
import { TextLabel } from "./TextLabel";


export class ButtonS extends Sprite {
    buttonLabel: TextLabel;


    constructor(texture: Texture<Resource> | undefined, text: string, position: { x: number, y: number }, color: number = 0xffffff, onPointerDown: any | undefined) {
        super(texture);

        this.interactive = true;
        this.anchor.set(0.5);
        this.tint = color;
        this.buttonLabel = new TextLabel(this.width / 2, this.height / 2, 0.5, text, 42, color);
        this.x = position.x;
        this.y = position.y;
        this.addChild(this.buttonLabel);

        this.on("pointerdown", () => { onPointerDown(); })
    }

    setActive(active: boolean) {

        this.renderable = active;
        this.interactive = active;
    }

}
export class ButtonG extends Graphics {
    buttonLabel: TextLabel;


    constructor(Color: number, alpha: number, text: string, position: { x: number, y: number }, TextColor: number = 0xffffff, onPointerDown: any | undefined) {
        super();

        this.beginFill(Color, alpha);
        this.drawRoundedRect(0, 0, 180, 100, 20);
        this.endFill();
        this.interactive = true;
        this.buttonLabel = new TextLabel(this.width / 2, this.height / 2, 0.5, text, 42, TextColor);
        this.x = position.x;
        this.y = position.y;
        this.buttonMode = true;

        this.addChild(this.buttonLabel);

        this.on("pointerdown", () => { onPointerDown(); })
    }

    setActive(active: boolean) {
        this.renderable = active;
        this.interactive = active;
    }

}