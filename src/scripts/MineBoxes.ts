import { AnimatedSprite, Container, Graphics, Sprite } from "pixi.js";
import { Globals } from "./Globals";
import { Easing, Tween } from "@tweenjs/tween.js";
import { config } from "./appConfig";
import { TextLabel } from "./TextLabel";

export class MineBoxes extends Container {
    multiplierContainer: MultiplierContainer = new MultiplierContainer();
    mineBoxContainer: MineBoxContainer = new MineBoxContainer();
    constructor() {
        super();
        this.addChild(this.multiplierContainer);
        this.addChild(this.mineBoxContainer);
    }

   
   


}

export class MineBoxContainer extends Container {
    MineBoxes: Boxes[] = [];
    constructor() {
        super();
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const MineBox = new Boxes();
                this.MineBoxes.push(MineBox);
                MineBox.position.set((j * MineBox.width * 1.1), MineBox.height + (i * MineBox.height));
                this.addChild(MineBox);
            }
        }
    }
}

export class MultiplierContainer extends Container {
    MineMultiplier: MultiplierBox[] = [];
    MultiplierHolder !: Sprite;
    multiplierMask: Graphics;

    constructor() {
        super();
        this.MultiplierHolder = new Sprite(Globals.resources.MultiplierHolder.texture)
        this.MultiplierHolder.anchor.set(0.5);
        this.addChild(this.MultiplierHolder);

        this.multiplierMask = new Graphics();
        this.addChild(this.multiplierMask);

        for (let i = 0; i < 10; i++) {
            const multiplierBox = new MultiplierBox();
            multiplierBox.mask = this.multiplierMask;
            this.MineMultiplier.push(multiplierBox);
            this.MineMultiplier[i].isActive(false);
            multiplierBox.position.set((-this.MultiplierHolder.width / 2 + (multiplierBox.width / 2) * 1.2) + (i * multiplierBox.width * 1.1), 0);
            this.addChild(multiplierBox);
        }

        this.MineMultiplier[0].isActive(true);
        this.drawMask();
    }

    drawMask() {
        this.multiplierMask.clear();
        this.multiplierMask.beginFill(0xFF3300);
        this.multiplierMask.drawRect(0, 0, this.MultiplierHolder.width * 0.98, this.MultiplierHolder.height);
        this.multiplierMask.endFill();
        this.multiplierMask.position.set(this.MineMultiplier[0].position.x - this.MineMultiplier[0].width / 2, this.MineMultiplier[0].position.y - this.MineMultiplier[0].height / 2);
    }
}


export class MultiplierBox extends Sprite {
    multiplier: number = 1;
    multiplierText: TextLabel;
    constructor(CurrentMultiplier: string = "1.3x") {
        super(Globals.resources.MultiplierEmpty.texture);
        this.anchor.set(0.5);
        this.multiplierText = new TextLabel(0, 0, 0.5, CurrentMultiplier, 20, 0xFFFFFF);
        this.addChild(this.multiplierText);
    }

    isActive(active: boolean) {
        if(!Globals.resources.MultiplierFill.texture || !Globals.resources.MultiplierEmpty.texture) return;
        this.texture = active ? Globals.resources.MultiplierFill.texture : Globals.resources.MultiplierEmpty.texture;
    }
}

export class Boxes extends AnimatedSprite {
    currentResult: number = -1;
    constructor() {
        if(!Globals.resources.Closed.texture || !Globals.resources.Opened.texture) return;
        super([Globals.resources.Closed.texture, Globals.resources.Opened.texture]);
        this.gotoAndStop(0);
        this.scale.set(0.4)
        this.anchor.set(0.5);
        this.setActive(true);
        this.on("pointerdown", this.onPointerDown.bind(this));
    }

    onPointerDown() {
        this.currentResult = Math.floor(Math.random() * 2);
        const ResultSprite = this.currentResult === 0 ? Globals.resources.Diamond : Globals.resources.Bomb;

        const Result = new Sprite(ResultSprite.texture)
        Result.anchor.set(0.5);
        this.setActive(false);

        const CurrentScale = this.scale.x;
        const chain1 = new Tween(this.scale,)
            .to({ x: CurrentScale }, 100)
            .easing(Easing.Bounce.Out)

        new Tween(this.scale).to({ x: 0 }, 100)
            .chain(chain1)
            .easing(Easing.Bounce.In)
            .onComplete(() => { this.gotoAndStop(1); this.addChild(Result); })
            .start();
    }

    setActive(active: boolean) {
        this.interactive = active;
        if (this.currentResult == -1)
            this.alpha = active ? 1 : 0.5;
        this.cursor = active ? 'pointer' : '';
    }
}