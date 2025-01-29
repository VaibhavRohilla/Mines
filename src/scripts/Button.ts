import { Tween } from "@tweenjs/tween.js";
import { Graphics, Resource, Sprite, Texture } from "pixi.js";
import { Globals } from "./Globals";





export class Button extends Sprite
{

    // mask : Graphics = new Graphics();
    constructor(Texture : Texture<Resource> | undefined , public CallBack : ()=>void)
    {
        super(Texture);
        this.anchor.set(0.5);
        this.setActive(true);
        this.on("pointerdown", this.onPointerDown.bind(this));
    }
    onPointerDown()
    {
        this.CallBack();
        this.setActive(false);
        new Tween(this.scale).to({x:this.scale.x*0.8,y:this.scale.y*0.8},100)
        .yoyo(true)
        .repeat(1)
        .onComplete(()=>{this.setActive(true)})
        .start();
    }

    setActive(active : boolean)
    {
        this.interactive = active;
        this.alpha = active ? 1 : 0.5;
        this.cursor =  active ?'pointer' : '';
    }
}