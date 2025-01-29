import { Container, Graphics, Sprite } from "pixi.js";
import { Globals } from "./Globals";
import { TextLabel } from "./TextLabel";
import { time } from "console";
import { extname } from "path";
import { Easing, Tween } from "@tweenjs/tween.js";
import { config } from "./appConfig";

export class Footer extends Container {
    dividerLine : Sprite;
    FooterBody !: Sprite;
    footerBlocks : footerBlock[] = [];
    footerHeader!: Sprite;
    AllBet: footerButton;
    TopBet: footerButton;
    MyBets: footerButton;
    isMobile : boolean = false;
    playerText !: TextLabel;
    TimeText !: TextLabel;
    BetAmountText !: TextLabel;
    MultiplayerText !: TextLabel;
    PayoutText !: TextLabel;
    constructor() {
        super();

        this.dividerLine = new Sprite(Globals.resources.dividerLine.texture);
        this.dividerLine.anchor.set(0.5);
        this.dividerLine.position.set(0, 0);
        this.addChild(this.dividerLine);
        
        this.AllBet = new footerButton(true,"All Bets",this.isActive.bind(this,"All Bets"));
        this.TopBet = new footerButton(false,"Top Bets",this.isActive.bind(this,"Top Bets"));
        this.MyBets = new footerButton(false,"My Bets",this.isActive.bind(this,"My Bets"));
        this.TopBet.position.set( this.AllBet.position.x + this.AllBet.width*1.2,0);
        this.MyBets.position.set( this.TopBet.position.x + this.TopBet.width*1.2,0);
        this.addChild(this.AllBet,this.TopBet,this.MyBets);

 
        
        this.footerBlockInit();
        setInterval(() => {
            
            this.addFooterBlock(playerData);
        }, 1000);

        

    }

    isActive(ActiveBtn : string)
    {
        if(ActiveBtn == "All Bets")
        {
            this.AllBet.getSelected(true);
            this.TopBet.getSelected(false);
            this.MyBets.getSelected(false);
        }
        else if(ActiveBtn == "Top Bets")
        {
            this.AllBet.getSelected(false);
            this.TopBet.getSelected(true);
            this.MyBets.getSelected(false);
        }
        else if(ActiveBtn == "My Bets")
        {
            this.AllBet.getSelected(false);
            this.TopBet.getSelected(false);
            this.MyBets.getSelected(true);
        }
    }

    normalRes()
    {
        this.isMobile = false;
        this.TimeText.visible = true;
        this.BetAmountText.visible = true;
        this.playerText.position.x = -this.footerHeader.width*0.45;
        this.TimeText.position.x = -this.footerHeader.width*0.25;
        this.BetAmountText.position.x = -this.footerHeader.width*0.05;
        this.MultiplayerText.position.x = this.footerHeader.width*0.2;
        this.PayoutText.position.x = this.footerHeader.width*0.4;
        this.footerBlocks.forEach(element => {
          
            element.onNormal(this.footerHeader);
        });
    }
    mobileRes()
    {
       
        this.isMobile = true;
        this.AllBet.scale.set(0.3*config.scaleFactor);
        this.TopBet.scale.set(0.3*config.scaleFactor);
        this.MyBets.scale.set(0.3*config.scaleFactor);
    
        this.AllBet.position.set( this.AllBet.width*0.8,-this.dividerLine.position.y + this.AllBet.height*1.6);
        this.TopBet.position.set(this.AllBet.position.x + this.AllBet.width,-this.dividerLine.position.y+ this.AllBet.height*1.6);
        this.MyBets.position.set(this.TopBet.position.x + this.AllBet.width,-this.dividerLine.position.y+ this.AllBet.height*1.6);
        this.FooterBody.scale.set(0.7*config.scaleFactor);
        this.FooterBody.position.set( window.innerWidth/2 , this.AllBet.position.y + this.FooterBody.height*0.8);
        this.footerBlocks.forEach(element => {

            element.playerText.position.x = -this.footerHeader.width*0.9;
            element.MultiplayerText.position.x = 0;
            element.PayoutText.position.x =  this.footerHeader.width*0.9;
            element.onmobile();
        });
        this.playerText.position.x = -this.footerHeader.width*0.3;
        this.TimeText.visible = false;
        this.BetAmountText.visible = false;
        this.MultiplayerText.position.x =0;
        this.PayoutText.position.x = this.footerHeader.width*0.3;
      
    }
    addFooterBlock (element: PlayerStats) {
        if (this.footerBlocks.length >= 10) {
            this.FooterBody.removeChild(this.footerBlocks[0]);
            this.footerBlocks.shift(); // Remove the first (oldest) element
        }


        const block = new footerBlock(element)
        block.scale.set(0.33);

        if(this.isMobile)
        {
            block.playerText.position.x = -this.footerHeader.width*0.9;
            block.MultiplayerText.position.x = 0;
            block.PayoutText.position.x =  this.footerHeader.width*0.9;
            block.onmobile();

        }
            else
            block.onNormal(this.footerHeader)

        block.zIndex = 2;
        this.sortChildren();
        this.footerBlocks.push(block); // Add the new element
        this.FooterBody.addChild(block);
        // block.mask = this.footerBlockMask;

        block.position.set(0,this.footerHeader.position.y );
        this.moveBlocks();

    }
    moveBlocks()
    {
        this.footerBlocks.forEach(element => {
            element.tweenBlock();
        });
    }
      
    footerBlockInit() {

        
        this.FooterBody = new Sprite(Globals.resources.FooterBody.texture);
        this.FooterBody .anchor.set(0.5);
        this.FooterBody.position.set(window.innerWidth/4  + this.FooterBody.width/4, this.dividerLine.position.y + this.dividerLine.height*2+this.FooterBody.height*0.5);
        this.addChild(this.FooterBody );

        this.footerHeader = new Sprite(Globals.resources.FooterHeading.texture);
        this.footerHeader.anchor.set(0.5);
        this.footerHeader.scale.set(1);
        this.footerHeader.position.set(0,  - this.FooterBody.height/2);
        this.FooterBody.addChild(this.footerHeader);
        this.footerHeader.zIndex = 3;

        this.playerText = new TextLabel(0,0,0.5,"Player",25,0x00FFAE);
        this.TimeText = new TextLabel(0,0,0.5,"Time",25,0x00FFAE);
        this.BetAmountText = new TextLabel(0,0,0.5,"Bet Amount",25,0x00FFAE);
        this.MultiplayerText = new TextLabel(0,0,0.5,"Multiplayer",25,0x00FFAE);
        this.PayoutText = new TextLabel(0,0,0.5,"Payout",25,0x00FFAE);
        this.playerText.position.x = -this.footerHeader.width*0.45;
        this.TimeText.position.x = -this.footerHeader.width*0.25;
        this.BetAmountText.position.x = -this.footerHeader.width*0.05;
        this.MultiplayerText.position.x = this.footerHeader.width*0.2;
        this.PayoutText.position.x = this.footerHeader.width*0.4;
        this.footerHeader.addChild(this.playerText,this.TimeText,this.BetAmountText,this.MultiplayerText,this.PayoutText);
        this.FooterBody.scale.set(0.75);
        this.sortChildren();
    }


 
}





export class footerButton extends Sprite {
    BtnText : TextLabel; 
    isSelected : boolean = false;
    constructor(isActive : boolean = false,text : string = "", public CallBack : ()=>void) {

        super(Globals.resources.FooterBtnNormal.texture);
        this.scale.set(0.25)
        this.BtnText = new TextLabel(0,0,0.5,text,70,0xA8A8A8);
        this.addChild(this.BtnText);
       
       
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
            this.BtnText.style.fill = 0x00FFAE;
            if(!Globals.resources.FooterButtonSelected.texture)
                return;
            this.texture = Globals.resources.FooterButtonSelected.texture;
        }
        else
        {
            if(!Globals.resources.FooterBtnNormal.texture)
            return;
            this.BtnText.style.fill = 0xA8A8A8;
            this.texture = Globals.resources.FooterBtnNormal.texture;
        }
    }
    setActive(active : boolean)
    {
        this.interactive = active;
        this.cursor =  active ?'pointer' : '';
    }
}


export class footerBlock extends Sprite
{
    playerText: TextLabel;
    TimeText : TextLabel;
    BetAmountText : TextLabel;
    MultiplayerText : TextLabel;
    PayoutText : TextLabel;

    constructor(Stats : PlayerStats)
    {
        super(Globals.resources.FooterBodyBlock.texture);
        this.anchor.set(0.5);
        this.playerText = new TextLabel(0,0,0.5,Stats.Player,65,0xFFFFFF);
        this.TimeText = new TextLabel(0,0,0.5,Stats.Time,65,0xFFFFFF);
        this.BetAmountText = new TextLabel(0,0,0.5,Stats.BetAmount,65,0xFFFFFF);
        this.MultiplayerText = new TextLabel(0,0,0.5,Stats.Multiplayer,65,0xFFFFFF);
        this.PayoutText = new TextLabel(0,0,0.5,Stats.Payout,65,0xFFFFFF);
        this.addChild(this.playerText,this.TimeText,this.BetAmountText,this.MultiplayerText,this.PayoutText);
      
    }
    onmobile( )
    {
        this.TimeText.visible = false;
        this.BetAmountText.visible = false;

    }
    onNormal(body : Sprite)
    {
        this.TimeText.visible = true;
        this.BetAmountText.visible = true;
        this.playerText.position.x = -body.width*1.3;
        this.TimeText.position.x = -body.width*0.75;
        this.BetAmountText.position.x =  -body.width*0.2;
        this.MultiplayerText.position.x = body.width*0.6;
        this.PayoutText.position.x = this.width*1.25;
    }
    tweenBlock()
    {
        new Tween(this.position)
        .to({y : this.position.y + this.height*1.2},400)
        .easing(Easing.Exponential.Out)
        .start();
    }
}

interface PlayerStats {
    Player: string;
    Time: string;
    BetAmount: string;
    Multiplayer: string;
    Payout: string;
  }
  const playerData: PlayerStats = {
    Player: "Rohitkumar00",
    Time: "8:20 PM",
    BetAmount: "$10",
    Multiplayer: "2.00x",
    Payout: "$20",
  };