import { Container, Graphics, Resource, Sprite, Texture } from "pixi.js";
import { Globals } from "./Globals";
import { TextLabel } from "./TextLabel";
import { Easing, Tween } from "@tweenjs/tween.js";
import { config } from "./appConfig";
import { Header } from "./Header";
import { extname } from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { error } from "node:console";

export class UiSection  extends Container
{
    AutoButton  !: LargeButtons;
    ManualButton !: LargeButtons;
    betBoxSprite !: Sprite;
    AmouontBetBtns : AmountBetButtons;
    MinesBtn !: Sprite;
    currentMines : number = 0;
    CurrentMineText !: TextLabel;
    gameDetails: GameDetails;
    StartGameBtn!: Button;
    constructor(public Header: Header)
    {
        super();
        this.topBtnsInit();
        this.betAmountInit();
        this.minesBtnsInit();

       
        this.gameDetails = new GameDetails();
        this.addChild(this.gameDetails);
        this.AmouontBetBtns = new AmountBetButtons();
        this.addChild(this.AmouontBetBtns);
       
            this.StartGameBtn = new Button(Globals.resources.StartGameBtn.texture,0.215,"",30,()=>{});
          
        
            this.StartGameBtn.anchor.set(0.5);
            this.addChild(this.StartGameBtn);
    }


    topBtnsInit()
    {
        this.AutoButton = new LargeButtons(true,"Auto",this.getCurrentActiveBtn.bind(this,undefined));
        this.addChild(this.AutoButton);

        this.ManualButton = new LargeButtons(false,"Manual",this.getCurrentActiveBtn.bind(this,this.AutoButton));
        this.ManualButton.position.set(this.AutoButton.position.x + this.AutoButton.width*1.1,0);
        this.addChild(this.ManualButton);
        
    }

    getCurrentActiveBtn(ActiveBtn : LargeButtons | undefined)
    {

        // console.log("AutoBtn",this.AutoBtn.isSelected);
        // console.log("ManBtn",this.ManBtn.isSelected);
        if(ActiveBtn)
        {
            this.ManualButton.getSelected(true);
            this.AutoButton.getSelected(false);
        }
        else
        {
            this.ManualButton.getSelected(false);
            this.AutoButton.getSelected(true);
        }
    }

    betAmountInit()
    {
        this.betBoxSprite = new Sprite(Globals.resources.BetBox.texture);
        this.betBoxSprite.anchor.set(0);
        const betBoxText = new TextLabel(0,0,0.5,"Bet Amount",100,0xB5B8C7);
        betBoxText.position.set(betBoxText.width*0.7,betBoxText .height);
        this.betBoxSprite.addChild(betBoxText);
        this.addChild( this.betBoxSprite);
        this.betBoxSprite.scale.set(0.215);

    }

  
    minesBtnsInit() {
        this.MinesBtn = new Sprite(Globals.resources.BetBox.texture);
        this.MinesBtn.anchor.set(0);

        const btn1 = new Button(Globals.resources.MinerBetBtn.texture,0.9,"3",120,()=>{});
        const btn2 = new Button(Globals.resources.MinerBetBtn.texture,0.9,"5",120,()=>{});
        const minBtn = new Button(Globals.resources.MineBtn.texture,0.9,"-",120,()=>{}); 
        const plusBtn = new Button(Globals.resources.MineBtn.texture,0.9,"+",120,()=>{}); 
        const btn3 = new Button(Globals.resources.MinerBetBtn.texture,0.9,"10",120,()=>{});
        const btn4 = new Button(Globals.resources.MinerBetBtn.texture,0.9,"20",120,()=>{});
        
        minBtn.BtnText.position.y = -20;
        plusBtn.BtnText.position.y = -10;

        plusBtn.BtnText.style = style;
        minBtn.BtnText.style = style;


        if(!Globals.resources.MinebtnOverlay)
            return;
        const overlay = new Sprite(Globals.resources.MinebtnOverlay.texture);
        const overlayText = new TextLabel(0,0,0.5,"Mines",70,0x00FFAE);
        overlayText.position.y = -overlayText.height;
        overlay.position.set(this.MinesBtn.width/2,this.MinesBtn.height/2);

        this.CurrentMineText = new TextLabel(0,0,0.5,`${this.currentMines}`,70,0x00FFAE);
        this.CurrentMineText.position.y = overlayText.height/2;
        overlay.addChild(this.CurrentMineText);
        overlay.anchor.set(0.5);
       
       
        btn1.position.set( btn1.width*0.6,this.MinesBtn.height/2);
        btn2.position.set(btn1.position.x + btn1.width,this.MinesBtn.height/2);
        btn3.position.set(overlay.position.x + overlay.width/2 + btn3.width*0.7,this.MinesBtn.height/2);
        btn4.position.set(btn3.position.x + btn1.width,this.MinesBtn.height/2);
        minBtn.position.set(overlay.position.x - overlay.width/2 + minBtn.width*0.6,overlay.position.y + 10);
        plusBtn.position.set(overlay.position.x + overlay.width/2 - minBtn.width*0.6,overlay.position.y + 10);
       
        overlay.addChild(overlayText);
        this.MinesBtn.addChild(overlay,btn1,btn2,btn3,btn4,minBtn,plusBtn);
        this.MinesBtn.scale.set(0.215);
        this.addChild(this.MinesBtn);

    }

    mobileRes()
    {
        this.AutoButton.scale.set(1.5*config.scaleFactor);
        this.ManualButton.scale.set(1.5*config.scaleFactor);
        this.ManualButton.position.set(this.AutoButton.position.x + this.AutoButton.width,this.AutoButton.position.y);
        this.StartGameBtn.scale.set(0.35*config.scaleFactor);
        this.betBoxSprite.scale.set(0.35*config.scaleFactor);
        this.AmouontBetBtns.scale.set(1.6*config.scaleFactor);  
        this.MinesBtn.scale.set(0.35*config.scaleFactor);
        this.gameDetails.scale.set(1.4*config.scaleFactor);
        this.betBoxSprite.position.set(this.StartGameBtn.position.x - this.StartGameBtn.width/2,this.StartGameBtn.position.y + this.StartGameBtn.height*0.8);
        this.AmouontBetBtns.position.set(this.betBoxSprite.position.x + this.AmouontBetBtns.children[0].getBounds().width/2,this.betBoxSprite.position.y + this.betBoxSprite.height*1.6);
        this.MinesBtn.position.set(this.AmouontBetBtns.position.x - this.AmouontBetBtns.children[0].getBounds().width/2,this.AmouontBetBtns.position.y + this.AmouontBetBtns.height*0.8);
        this.gameDetails.position.set(this.MinesBtn.position.x ,this.MinesBtn.position.y + this.MinesBtn.height*1.6);
      
    }
    
}

export class AmountBetButtons extends Container 
{
    minBtn !: Button;
    maxBtn !: Button;
    decBtn !: Button;
    incBtn !: Button;
    constructor()
    {
        super();
      
        this.minBtn = new Button(Globals.resources.BetBtn.texture,0.89,"Min",20,()=>{});
        this.decBtn = new Button(Globals.resources.BetBtn.texture,0.89,"-",20,()=>{});
        this.incBtn = new Button(Globals.resources.BetBtn.texture,0.89,"+",20,()=>{});
        this.maxBtn = new Button(Globals.resources.BetBtn.texture,0.89,"Max",20,()=>{});


        this.minBtn.position.set(0, 0);
        this.decBtn.position.set(this.minBtn.position.x +  this.minBtn.width, 0);
        this.incBtn.position.set(this.decBtn.position.x +  this.decBtn.width, 0);
        this.maxBtn.position.set(this.incBtn.position.x +  this.incBtn.width, 0);

        this.addChild(this.minBtn);
        this.addChild(this.decBtn);
        this.addChild(this.incBtn);
        this.addChild(this.maxBtn);
    }
}


export class Button extends Sprite {
    BtnText : TextLabel; 
    constructor(Texture : Texture<Resource>|undefined,scale : number,text : string = "",textScale : number, public CallBack : ()=>void) {

        super(Texture);
        this.BtnText = new TextLabel(0,0,0.5,text,textScale,0xFFFFFF);
        this.addChild(this.BtnText);
       
        this.anchor.set(0.5);
        this.setActive(true);
        this.on("pointerdown", this.onPointerDown.bind(this));
        this.scale.set(scale)

    }

    onPointerDown()
    {
        this.setActive(false);
        new Tween(this.scale)
        .to({x:this.scale.x*0.8,y:this.scale.y*0.8},100)
        .easing(Easing.Back.Out)
        .yoyo(true)
        .repeat(1)
        .onComplete(()=>{this.setActive(true)})
        .start();
        this.CallBack();
    }

   
   
    setActive(active: boolean) {
        this.interactive = active;
        this.alpha = active ? 1 : 0.5;
        this.cursor = active ? 'pointer' : '';
    }
}
export class LargeButtons extends Sprite {
    BtnText : TextLabel; 
    btn : Sprite;
    isSelected : boolean = false;
    constructor(isActive : boolean = false,text : string = "", public CallBack : ()=>void) {

        super(Globals.resources.LargeBtn.texture);
        this.scale.set(0.9)
        this.BtnText = new TextLabel(0,0,0.5,text,20,0xFFFFFF);
        this.addChild(this.BtnText);
        this.btn = new Sprite(Globals.resources.BtnOn.texture);
        this.btn.anchor.set(0.5);
        this.btn.position.set(this.width/4,0);
        this.addChild(this.btn);
       
        this.getSelected(isActive);
        this.anchor.set(0.5);
        this.setActive(true);
        this.on("pointerdown", this.onPointerDown.bind(this));
    }

    onPointerDown()
    {
        this.setActive(false);
        new Tween(this.scale)
        .to({x:this.scale.x*0.8,y:this.scale.y*0.8},100)
        .easing(Easing.Back.Out)
        .yoyo(true)
        .repeat(1)
        .onComplete(()=>{this.setActive(true)})
        .start();
        this.CallBack();
    }

    getSelected(isSelected : boolean)
    {
        this.isSelected = isSelected;
        if(this.isSelected)
        {
            if(!Globals.resources.BtnOn.texture || !Globals.resources.LargeBtnSelected.texture)
                return;
            this.btn.texture = Globals.resources.BtnOn.texture;
            this.texture = Globals.resources.LargeBtnSelected.texture;
        }
        else
        {
            if(!Globals.resources.BtnOff.texture || !Globals.resources.LargeBtn.texture)
            return;
            this.btn.texture = Globals.resources.BtnOff.texture;
            this.texture = Globals.resources.LargeBtn.texture;
        }
    }
    setActive(active : boolean)
    {
        this.interactive = active;
        this.cursor =  active ?'pointer' : '';
    }
}


export class GameDetails extends Sprite
{
    GameLeftText : TextLabel = new TextLabel(0,0,0.5,"5",50,0x00FFAE);;
    MineRiskText: TextLabel  = new TextLabel(0,0,0.5,"5",50,0x00FFAE);;;
    OpenedTilesText : TextLabel  = new TextLabel(0,0,0.5,"5",50,0x00FFAE);;;
    constructor()
    {
        super(Globals.resources.GameDetails.texture);
        this.anchor.set(0);
        this.scale.set(0.85)

        const GameLeftSprite = this.getTiles(Globals.resources.GameLeftSprite.texture,"Game Left");
        GameLeftSprite.position.set(this.width/2,this.height/2);

        const MineRiskSprite = this.getTiles(Globals.resources.MineRiskSprite.texture,"Mine Risk");
        MineRiskSprite.position.set(this.width/2,GameLeftSprite.position.y + GameLeftSprite.height*1.2)

        const OpenedTilesSprite = this.getTiles(Globals.resources.OpenedTilesSprite.texture,"Opened Tiles");
        OpenedTilesSprite.position.set(this.width/2,MineRiskSprite.position.y + MineRiskSprite.height*1.2);

        const GameleftHolder  = this.getHolder(this.GameLeftText);
        GameleftHolder.position.set(GameLeftSprite.position.x + GameLeftSprite.width*0.7,GameLeftSprite.position.y);

        const MineRiskHolder  = this.getHolder(this.MineRiskText);
        MineRiskHolder.position.set(MineRiskSprite.position.x + MineRiskSprite.width*0.7,MineRiskSprite.position.y);

        const OpenedTilesHolder  = this.getHolder(this.OpenedTilesText);
        OpenedTilesHolder.position.set(OpenedTilesSprite.position.x + OpenedTilesSprite.width*0.7,OpenedTilesSprite.position.y);
        this.addChild(MineRiskSprite,OpenedTilesSprite,GameLeftSprite,GameleftHolder,MineRiskHolder,OpenedTilesHolder);
    }

    getHolder(text : TextLabel)
    {
        const sprite = new Sprite(Globals.resources.GameHolder.texture);
        sprite.anchor.set(0.5);
        sprite.scale.set(0.3);  
        sprite.addChild(text);
        return sprite

    }
    getTiles(logo :Texture<Resource> | undefined, text : string)
    {
        const sprite = new Sprite(Globals.resources.GameDetailsTiles.texture);
        sprite.anchor.set(0.5);
        const logoSprite = new Sprite(logo);
        logoSprite.anchor.set(0.5);
        logoSprite.position.x = -sprite.width/2 + logoSprite.width*2;
        sprite.addChild(logoSprite);

        const textLabel = new TextLabel(logoSprite.position.x + logoSprite.width,0,0.5,text,50,0x00FFAE);
        textLabel.anchor.set(0,0.5);
        sprite.addChild(textLabel);
        sprite.scale.set(0.3);
        return sprite
    }
}
const style = {
    fontSize: 120,
    fill: 0x00FFAE
}