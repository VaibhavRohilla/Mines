import { Container, Sprite } from "pixi.js";
import { Globals } from "./Globals";
import { config } from "./appConfig";
import { Button } from "./Button";
import { TextLabel } from "./TextLabel";

export class Header extends Container {
    HeaderSprite: Sprite;
    Logo: Sprite;
    exitBtn: Button;
    settingBtn: Button;
    musicBtn: Button;
    BalanceTxt: Sprite;
    BalanceHead: Sprite;

    constructor() {
        super();

        this.HeaderSprite = new Sprite(Globals.resources.Header.texture);
        this.HeaderSprite.anchor.set(0.5);
        this.HeaderSprite.scale.y = 1.5 * config.minScaleFactor;
        this.HeaderSprite.position.set(window.innerWidth / 2, this.HeaderSprite.height / 2);
        this.HeaderSprite.width = window.innerWidth;
        this.addChild(this.HeaderSprite);

        this.exitBtn = new Button(Globals.resources.ExitBtn.texture, () => {
            console.log("Exit");
        });
        this.exitBtn.scale.set(1.5 * config.minScaleFactor);
        this.exitBtn.position.set(config.minLeftX + this.exitBtn.width * 1.5 * config.scaleFactor, this.HeaderSprite.height / 2 + 3);
        this.addChild(this.exitBtn);

        this.settingBtn = new Button(Globals.resources.SettingsBtn.texture, () => {
            console.log("Settings");
        });
        this.settingBtn.scale.set(1.5 * config.minScaleFactor);
        this.settingBtn.position.set(config.minRightX - this.settingBtn.width * 1.5 * config.scaleFactor, this.HeaderSprite.height / 2 + 3);
        this.addChild(this.settingBtn);

        this.musicBtn = new Button(Globals.resources.MusicBtn.texture, () => {
            console.log("Music");
        });
        this.musicBtn.scale.set(1.5 * config.minScaleFactor);
        this.musicBtn.position.set(this.settingBtn.position.x - this.settingBtn.width * 1.2, this.HeaderSprite.height / 2 + 3);
        this.addChild(this.musicBtn);

        this.BalanceHead = new Sprite(Globals.resources.BalanceVar.texture);
        this.BalanceHead.anchor.set(1, 0.5);
        this.BalanceHead.scale.set(1.3 * config.minScaleFactor);
        this.BalanceHead.position.set(
            this.musicBtn.position.x - this.musicBtn.width * 1.5 * config.minScaleFactor,
            this.HeaderSprite.height / 2 + 3
        );
        this.addChild(this.BalanceHead);

        this.BalanceTxt = new Sprite(Globals.resources.BalanceText.texture);
        this.BalanceTxt.anchor.set(1, 0.5);
        this.BalanceTxt.scale.set(0.1 * config.scaleFactor);
        this.BalanceTxt.position.set(this.BalanceHead.position.x - this.BalanceHead.width*1.05, this.HeaderSprite.height / 2 + 3);
        this.addChild(this.BalanceTxt);

        this.Logo = new Sprite(Globals.resources.Logo.texture);
        this.Logo.anchor.set(0, 0.5);
        this.Logo.scale.set(0.35 * config.minScaleFactor);
        this.Logo.position.set(
            this.exitBtn.position.x + this.exitBtn.width * 2 * config.minScaleFactor,
            this.HeaderSprite.height / 2 + 3
        );
        this.addChild(this.Logo);
    }

    resize() {
        this.HeaderSprite.scale.y = 1.5 * config.minScaleFactor;
        this.HeaderSprite.position.set(window.innerWidth / 2, this.HeaderSprite.height / 2);
        this.HeaderSprite.width = window.innerWidth;

        this.exitBtn.scale.set(1.5 * config.minScaleFactor);
        this.exitBtn.position.set(config.leftX + this.exitBtn.width * 1.5 * config.scaleFactor, this.HeaderSprite.height / 2 + 3);

        this.Logo.scale.set(0.35 * config.minScaleFactor);
        this.Logo.position.set(
            this.exitBtn.position.x + this.exitBtn.width * 2 * config.minScaleFactor,
            this.HeaderSprite.height / 2 + 3
        );

        this.settingBtn.scale.set(1.5 * config.minScaleFactor);
        this.settingBtn.position.set(config.minRightX - this.settingBtn.width * 1.5 * config.scaleFactor, this.HeaderSprite.height / 2 + 3);

        this.musicBtn.scale.set(1.5 * config.minScaleFactor);
        this.musicBtn.position.set(this.settingBtn.position.x - this.settingBtn.width * 1.2, this.HeaderSprite.height / 2 + 3);

        this.BalanceHead.scale.set(1.3 * config.minScaleFactor);
        this.BalanceHead.position.set(
            this.musicBtn.position.x - this.musicBtn.width * 1.5 * config.minScaleFactor,
            this.HeaderSprite.height / 2 + 3
        );

        this.BalanceTxt.scale.set(0.2 * config.scaleFactor);
        this.BalanceTxt.position.set(this.BalanceHead.position.x - this.BalanceHead.width*1.1, this.HeaderSprite.height / 2 + 3);
    }
}
