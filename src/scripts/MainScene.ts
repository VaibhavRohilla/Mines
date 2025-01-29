import { Scene } from "./Scene";
import { Header } from "./Header";
import { config } from "./appConfig";
import { MineBoxes } from "./MineBoxes";
import {  UiSection } from "./UiButtons";
import { Footer } from "./Footer";
import { log } from "node:console";
import { copyFile } from "node:fs";
import { allowedNodeEnvironmentFlags } from "node:process";

export class MainScene extends Scene 
{
  header: Header;
  uiContainer: UiSection;
;
  minexBoxes  : MineBoxes;
  footerContainer : Footer;
  constructor() {
    super(0x152B5F);

    this.header = new Header();
    this.addChildToFullScene(this.header);
  
    this.minexBoxes = new MineBoxes();
    this.addChildToFullScene(this.minexBoxes); 

    this.uiContainer = new UiSection(this.header);
    this.addChildToFullScene(this.uiContainer);

    this.footerContainer = new Footer();
    this.addChildToFullScene(this.footerContainer);
    this.callBack = this.onMouseWheelCallBack.bind(this);

    this.resize();

  }

 
  onMouseWheelCallBack() {
    this.minexBoxes.multiplierContainer.drawMask();
  }

  getContainerLength()
  {
    return -this.footerContainer.position.y ;
  }


  recievedMessage(msgType: string, msgParams: any): void {
    // Handle incoming messages
  

  }
  update(dt: number): void {
    
  }

 
  resize(): void {
    this.mainBackground.resetBg();
    this.header.resize();
    
    if(window.innerWidth < window.innerHeight )
      {
        this.mobileResize();
        this.header.BalanceTxt.visible = false;
      }
      else
      {
        this.header.BalanceTxt.visible = true;
        this.normalResize();
      }
      this.footerContainer.position.set(0,this.uiContainer.gameDetails.position.y + this.uiContainer.gameDetails.height*1.5);
      this.maxY = this.getContainerLength();

  }

  normalResize()
  {
    this.minexBoxes.mineBoxContainer.scale.set(0.4*config.scaleFactor);
    this.minexBoxes.multiplierContainer.scale.set(0.5*config.scaleFactor);
    this.uiContainer.AutoButton.scale.set(0.5*config.scaleFactor);
    this.uiContainer.ManualButton.scale.set(0.5*config.scaleFactor);

    this.uiContainer.StartGameBtn.scale.set(0.12*config.scaleFactor);
    this.uiContainer.betBoxSprite.scale.set(0.12*config.scaleFactor);
    this.uiContainer.AmouontBetBtns.scale.set(0.55*config.scaleFactor);
    this.uiContainer.MinesBtn.scale.set(0.12*config.scaleFactor);
    this.uiContainer.gameDetails.scale.set(0.48*config.scaleFactor);
    
    this.footerContainer.FooterBody.scale.set(0.48*config.scaleFactor);
    this.footerContainer.AllBet.scale.set(0.15*config.scaleFactor);
    this.footerContainer.TopBet.scale.set(0.15*config.scaleFactor);
    this.footerContainer.MyBets.scale.set(0.15*config.scaleFactor);

    this.uiContainer.ManualButton.position.set(window.innerWidth/2 - this.uiContainer.AutoButton.width*0.8,this.header.HeaderSprite.height  + this.uiContainer.AutoButton.height*1.2);
    this.uiContainer.AutoButton.position.set(this.uiContainer.ManualButton.position.x - this.uiContainer.AutoButton.width, this.header.HeaderSprite.height  + this.uiContainer.AutoButton.height*1.2);
    this.uiContainer.betBoxSprite.position.set(this.uiContainer.AutoButton.position.x - this.uiContainer.AutoButton.width/2,this.uiContainer.AutoButton.position.y + this.uiContainer.StartGameBtn.height*0.8);
    this.uiContainer.AmouontBetBtns.position.set(this.uiContainer.betBoxSprite.position.x + this.uiContainer.AmouontBetBtns.children[0].getBounds().width/2,this.uiContainer.betBoxSprite.position.y + this.uiContainer.betBoxSprite.height*1.6);
    this.uiContainer.MinesBtn.position.set(this.uiContainer.AmouontBetBtns.position.x - this.uiContainer.AmouontBetBtns.children[0].getBounds().width/2,this.uiContainer.AmouontBetBtns.position.y + this.uiContainer.AmouontBetBtns.height*0.8);
    this.uiContainer.StartGameBtn.position.set( this.uiContainer.betBoxSprite.position.x +  this.uiContainer.StartGameBtn.width/2,this.uiContainer.MinesBtn.position.y + this.uiContainer.StartGameBtn.height*1.6 );
    this.uiContainer.gameDetails.position.set(this.uiContainer.MinesBtn.position.x ,this.uiContainer.StartGameBtn.position.y + this.uiContainer.StartGameBtn.height*0.8);

    this.minexBoxes.multiplierContainer.position.set(window.innerWidth/2 + this.minexBoxes.multiplierContainer.width/2,this.uiContainer.AutoButton.position.y );
    this.minexBoxes.mineBoxContainer.position.set(this.minexBoxes.multiplierContainer.position.x - this.minexBoxes.mineBoxContainer.width/2, this.minexBoxes.multiplierContainer.position.y + this.minexBoxes.multiplierContainer.height/4);
    
    this.footerContainer.dividerLine.position.set(window.innerWidth/2,this.minexBoxes.mineBoxContainer.position.y/4);
    this.footerContainer.AllBet.position.set( this.uiContainer.AutoButton.position.x - this.footerContainer.AllBet.width/4,this.footerContainer.dividerLine.position.y + this.footerContainer.AllBet.height*1.2);
    this.footerContainer.TopBet.position.set(this.footerContainer.AllBet.position.x + this.footerContainer.AllBet.width,this.footerContainer.dividerLine.position.y+ this.footerContainer.AllBet.height*1.2);
    this.footerContainer.MyBets.position.set(this.footerContainer.TopBet.position.x + this.footerContainer.AllBet.width,this.footerContainer.dividerLine.position.y+ this.footerContainer.AllBet.height*1.2);
    this.footerContainer.FooterBody.position.set( window.innerWidth/2 + 25*config.scaleFactor, this.footerContainer.AllBet.position.y + this.footerContainer.FooterBody.height/2 + this.footerContainer.AllBet.height*2);
    this.footerContainer.normalRes();

  }
  mobileResize()
  {
    this.uiContainer.AutoButton.scale.set(1.5*config.scaleFactor);
    this.uiContainer.ManualButton.scale.set(1.5*config.scaleFactor);
    this.uiContainer.AutoButton.position.set(window.innerWidth/2 - this.uiContainer.AutoButton.width/2,this.header.HeaderSprite.height  + this.uiContainer.AutoButton.height*1.2);
    this.uiContainer.ManualButton.position.set(this.uiContainer.AutoButton.position.x + this.uiContainer.AutoButton.width,this.uiContainer.AutoButton.position.y);
    this.minexBoxes.multiplierContainer.scale.set(1.2*config.scaleFactor);
    this.minexBoxes.mineBoxContainer.scale.set(0.8*config.scaleFactor);
    this.minexBoxes.multiplierContainer.position.set(this.minexBoxes.multiplierContainer.width/2,this.uiContainer.AutoButton.position.y + this.uiContainer.AutoButton.height);
    this.minexBoxes.mineBoxContainer.position.set(this.uiContainer.AutoButton.position.x - this.minexBoxes.mineBoxContainer.MineBoxes[0].width/4,this.minexBoxes.multiplierContainer.position.y + this.minexBoxes.multiplierContainer.height/4);
    this.uiContainer.StartGameBtn.position.set(  this.uiContainer.AutoButton.position.x +   this.uiContainer.AutoButton.width/2 ,this.minexBoxes.multiplierContainer.position.y + this.minexBoxes.mineBoxContainer.height);
    this.footerContainer.position.set(0,this.uiContainer.gameDetails.position.y + this.uiContainer.gameDetails.height*1.2);
    
    this.uiContainer.mobileRes();
    this.footerContainer.mobileRes();
  }

}
