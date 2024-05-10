import { Container, Graphics, InteractionEvent, Sprite } from "pixi.js";
import { GameData, GameGeneratorOffset, Globals, colors, makeTube, tube, } from "./Globals";
import { ball } from "./ball";
import { config } from "./appConfig";
import { TextLabel } from "./TextLabel";
import { Easing, Tween } from "@tweenjs/tween.js";
import { ButtonG } from "./Button";
import { levelStars, levelVariables } from "./LevelLib/GlobalLevelVar";

export class GameGenerator extends Container {

    tubesArray: tube[] = [];
    tube: Graphics[] = [];
    balls: ball[][] = [];
    lastPos: { current: number, last: number }[] = []

    tubeXPos: number;
    tubeYPos: number;
    ballXPos: number;
    ballYPos: number;

    currentLevelLabel: TextLabel;
    noOfEmptyTubes: number = 1;

    timeLeft: number = 120;
    timeInterval!: NodeJS.Timer;
    refreshButton!: Sprite;
    // lastPositions : 
    constructor() {
        super();
        this.tubeXPos = GameGeneratorOffset.tubeXPos;
        this.tubeYPos = GameGeneratorOffset.tubeYPos;
        this.ballXPos = GameGeneratorOffset.ballXPos;
        this.ballYPos = GameGeneratorOffset.ballYPos;
        this.sortableChildren = true;

        if (GameData.noOfTubes > 5) {
            this.noOfEmptyTubes = 1;
        }

        this.currentLevelLabel = new TextLabel(550, 240, 0.5, `LEVEL ${GameData.currentLevel}`, 60, 0xffffff);
        this.addChild(this.currentLevelLabel);

        this.generateTubes();
        this.spawnBalls();
        this.gameCheckLoop();

        this.refresh();
        this.makeTimer();
        this.reverseStep();
        this.cancelButton();;

    }

    generateTubes() {
        let currentColor = 0;
        for (let i = 0; i < GameData.noOfTubes; i++) {
            this.tubesArray.push([]);

            this.tube[i] = makeTube();
            this.tube[i].interactive = true;
            this.tube[i].buttonMode = true;
            this.tube[i].zIndex = 2;
            // console.log(this.tubeXPos);

            if (this.tubeXPos > 750) {
                this.tubeXPos = GameGeneratorOffset.tubeXPos;

                if (GameData.noOfTubes % 3 == 0) {
                    this.tubeXPos = GameGeneratorOffset.tubeXPos + this.tube[i].width;
                }

                this.tubeYPos += 500;
                // console.log("CALLED");
            }

            this.tube[i].position.x = this.tubeXPos;
            this.tube[i].position.y = this.tubeYPos;

            if (this.tubeXPos <= 750) {
                this.tubeXPos += 200;
            }
            this.addChild(this.tube[i]);

            for (let j = 0; j < GameData.height; j++) {
                if (currentColor < GameData.noOfColorsUsed)
                    this.tubesArray[i].push(colors[currentColor]);
            }
            currentColor++;


        }
        // console.log("AFTER  SORT:" + this.tubesArray);

        for (let i = 0; i < GameData.noOfIterations; i++) {
            this.shuffleColorsInTube();
            for (let j = 0; j < this.tubesArray.length; j++) {
                if (this.checkIfTubeHasSameColor(this.tubesArray[j])) {
                    i--;
                    this.shuffleColorsInTube();
                }
            }
        }
    }


    spawnBalls() {
        for (let i = 0; i < GameData.noOfTubes; i++) {
            this.balls.push([]);

            for (let j = 0; j < GameData.height; j++) {
                if (this.tubesArray[i]) {
                    let color = this.tubesArray[i].at(j);
                    if (color) {
                        if (j == 0) {
                            // console.log(i, j);
                            this.balls[i][j] = new ball(color, this.tube[i].position.x + this.tube[i].width / 2, this.tube[i].position.y + this.tube[i].height - 50, j);
                        }
                        else if (j > 0) {
                            // console.log(i, j);
                            const yPos = this.balls[i][j - 1].position.y - this.balls[i][j - 1].width;
                            this.balls[i][j] = new ball(color, this.tube[i].position.x + this.tube[i].width / 2, yPos, j);

                        }
                        this.balls[i][j].zIndex = 1;
                        this.balls[i][j].name = "ball";
                        this.addChild(this.balls[i][j]);
                        // console.log("X  :  " + i);
                        // console.log("Y  :  " + j);
                        this.ballYPos += GameGeneratorOffset.ballYOffset;
                    }
                    else
                        this.balls[i] = [];

                }

            }
            this.ballXPos += GameGeneratorOffset.ballXOffset;
            this.ballYPos = GameGeneratorOffset.ballYPos;
        }

    }

    findLastBall(x: number) {
        // console.log(this.balls[x].length);
        if (this.balls[x].length == 0) {
            // console.log("EMPTY");
            return 0;
        }
        else if (this.balls[x].length != 0) {

            for (let i = 0; i < GameData.height; i++) {
                if (i + 1 == GameData.height && this.balls[x][i] != undefined) {
                    // console.log(x, i);
                    // console.log("returned  :" + (i));
                    return i;
                }
                if (i + 1 != GameData.height && this.balls[x][i] != undefined && this.balls[x][i + 1] == undefined) {
                    // console.log(x, i);
                    // console.log("returned  :" + i);
                    return i;
                }
            }
        }
    }

    getAvailableSpace(x: number) {
        if (this.balls[x].length == 0) {
            // console.log("EMPTY");
            return 0;
        }
        else if (this.balls[x].length != 0) {

            for (let i = 0; i < GameData.height; i++) {

                if (i + 1 != GameData.height && this.balls[x][i] != undefined && this.balls[x][i + 1] == undefined) {
                    // console.log(x, i);
                    // console.log("returned  :" + i + 1);
                    return i + 1;
                }
                if (i + 1 == GameData.height && this.balls[x][i - 1] != undefined && this.balls[x][i] == undefined) {
                    // console.log(x, i);
                    // console.log("returned  :" + i + 1);
                    return i;
                }
            }
        }
    }
    checkMatch() {
        let completedCount = 0;
        for (let j = 0; j < this.tube.length; j++) {

            for (let i = 0; i < GameData.height; i++) {

                // if (this.balls[x][i] && this.balls[x][i + 1])
                // console.log(this.balls[x][i].ballColor, this.balls[x][i + 1].ballColor);

                if (i != GameData.height && this.balls[j][i] && this.balls[j][i + 1] && this.balls[j][i].ballColor != this.balls[j][i + 1].ballColor) {
                    return;
                }
                if (i + 1 == GameData.height && this.balls[j][i] && this.balls[j][i - 1] && this.balls[j][i].ballColor == this.balls[j][i - 1].ballColor) {
                    completedCount++;
                }
                if (completedCount == GameData.noOfTubes - this.noOfEmptyTubes) {
                    setTimeout(() => { this.levelCompleted(); }, 1000)
                }
            }

        }
    }

    shuffleColorsInTube() {
        let tempTubes: tube[] = [[], [], [], [], [], [], [], [], [], []];
        for (let i = 0; i < GameData.noOfTubes - this.noOfEmptyTubes; i++) {
            for (let j = 0; j < GameData.height; j++) {
                let randIndex = Math.floor(Math.random() * (GameData.noOfTubes - this.noOfEmptyTubes));

                while (tempTubes[randIndex].length == GameData.height) {
                    randIndex = Math.floor(Math.random() * (GameData.noOfTubes - this.noOfEmptyTubes));
                }
                // console.log(i, j);

                tempTubes[randIndex].push(this.tubesArray[i][j]);

                // tubesArray[i].splice(j, 1);
            }
        }
        this.tubesArray = tempTubes;
    }

    checkIfTubeHasSameColor(tube: tube) {
        let colorCount = 0;
        for (let i = 0; i < tube.length; i++) {
            if (tube[i] == tube[i + 1]) {
                colorCount++;
            }
        }
        // console.log(colorCount);
        return colorCount == tube.length - 1;
    }

    gameCheckLoop() {
        for (let i = 0; i < GameData.noOfTubes; i++) {
            this.tube[i].on("pointerdown", (e: InteractionEvent) => {
                let xIndex = this.findLastBall(i) as number;
                const pBall = this.balls[i][xIndex];
                // console.log(this.balls);

                if (pBall?.isUp) {
                    pBall?.moveDownTween();
                    return;
                }

                for (let j = 0; j < GameData.noOfTubes; j++) {
                    let index = this.findLastBall(j) as number;

                    if (this.balls[j][index] && this.balls[j][index].isUp) {
                        let ball = this.balls[j][index];

                        if (this.tube[i] != this.tube[j] && ball != undefined && this.findLastBall(i) as number == GameData.height - 1) {
                            this.balls[j][index]?.moveDownTween();
                        }

                        else if (this.tube[i] != this.tube[j]) {
                            if (!this.balls[i][xIndex] || this.balls[j][index].ballColor == this.balls[i][xIndex].ballColor && this.balls[i][this.findLastBall(i) as number]) {
                                // console.log("Current NUBMER   :" + this.getAvailableSpace(i));
                                let finalPos = this.tube[i].position.y + this.tube[i].height - 50;

                                if (this.getAvailableSpace(i) as number != 0) {
                                    finalPos = this.balls[i][this.findLastBall(i) as number].recentPos.y - this.balls[i][this.findLastBall(i) as number].width;
                                    // console.log(this.balls[i][this.findLastBall(i) as number].position.y);
                                }

                                ball?.changeTubeTween({ x: this.tube[i].position.x + this.tube[i].width / 2, y: this.tube[i].position.y - 50 }, this.getAvailableSpace(i) as number, finalPos);
                                this.balls[i][this.getAvailableSpace(i) as number] = this.balls[j][index];
                                this.lastPos.push({ current: i, last: j })
                                this.balls[j].pop();
                                this.checkMatch();
                                return;
                            }
                        }
                    }
                }
                if (pBall?.isUp) {
                    pBall?.moveDownTween();
                    return;
                }
                if (!pBall?.isUp) {

                    pBall?.moveUpTween({ x: this.tube[i].position.x + this.tube[i].width / 2, y: this.tube[i].position.y - 100 });
                }
                console.log("_________________________________________________________");
            });
        }
    }

    levelCompleted() {
        clearInterval(this.timeInterval);

        let noOfStars = 0;
        let startPos = 0;
        if (this.timeLeft >= 80) { noOfStars = 3; }
        if (this.timeLeft < 80 && this.timeLeft >= 60) { noOfStars = 2; }
        if (this.timeLeft < 60) { noOfStars = 1; }

        const mask = new Graphics();
        mask.beginFill(0x000000, 0.8);
        mask.drawRect(0, 0, config.logicalWidth, config.logicalHeight);
        mask.endFill();
        mask.zIndex = 3;
        this.addChild(mask)

        const box = new Graphics();
        box.lineStyle(2, 0x5a5a5a, 1);
        box.beginFill(0x0000000, 0.8);
        box.drawRoundedRect(0, 0, config.logicalWidth / 2, 100, 16);
        box.endFill();
        box.position.x = config.logicalWidth / 4;
        box.position.y = 1200;
        box.zIndex = 3;

        const text = new TextLabel(box.width / 2, box.height / 2, 0.5, "Level Completed", 40, 0xFFFFFF);

        box.addChild(text);
        this.addChild(box);

        const nextBox = new ButtonG(0xFFFFFF, 0.8, "Next", { x: 0, y: config.logicalHeight / 2 }, 0x00000,
            () => {
                levelStars[GameData.currentLevel - 1] = noOfStars;
                mask.destroy();
                GameData.currentLevel++;
                this.currentLevelLabel.upadteLabelText(`LEVEL ${GameData.currentLevel}`, 0xffffff);
                Globals.emitter?.Call("LevelFinished");
                this.removeChild(box, nextBox);
            })
        nextBox.zIndex = 3;
        this.addChild(nextBox);

        new Tween(box)
            .to({ y: 600 }, 1500)
            .easing(Easing.Bounce.Out)
            .start();

        new Tween(nextBox)
            .to({ x: config.logicalWidth / 2 - 100 }, 1500)
            .easing(Easing.Exponential.Out)
            .onComplete(() => {
                for (let i = 0; i < noOfStars; i++) {
                    let x = new Sprite(Globals.resources.star.texture);
                    x.position.y = -50;
                    x.anchor.set(0.5);
                    x.scale.set(0);
                    x.position.x = startPos + 20;
                    startPos += 70;
                    nextBox.addChild(x);

                    if (noOfStars == 1) {
                        x.position.x = nextBox.width / 2;
                    }
                    new Tween(x.scale)
                        .to({ x: 0.1, y: 0.1 })
                        .easing(Easing.Circular.InOut)
                        .duration(500)
                        .start();
                } nextBox.setActive(true);
            })
            .start();
    }

    resetLevel() {
        const length = this.children.length;
        let toDelete = [];
        for (let i = 0; i < length; i++) {
            let x = this.getChildAt(i)
            if (x.name == "ball")
                toDelete.push(x);
        }
        for (let i = 0; i < toDelete.length; i++) {
            this.removeChild(toDelete[i]);
        }
        this.balls = [];
        this.spawnBalls()
    }

    reverseStep() {
        const reverseBtn = new Sprite(Globals.resources.reverseBtn.texture);
        reverseBtn.position.x = 550;
        reverseBtn.position.y = 90;
        reverseBtn.anchor.set(0.5);
        reverseBtn.scale.set(0.4);

        reverseBtn.interactive = true;
        reverseBtn.buttonMode = true;
        this.addChild(reverseBtn);
        reverseBtn.on("pointerdown", () => {
            if (this.lastPos[this.lastPos.length - 1]) {
                console.log(this.lastPos[this.lastPos.length - 1]);

                let x = this.lastPos[this.lastPos.length - 1];
                console.log(x.current);
                const currentBall = this.balls[x.current][this.findLastBall(x.current) as number];
                currentBall.changeTubeTween({ x: this.tube[x.last].position.x + this.tube[x.last].width / 2, y: this.tube[x.last].position.y - 50 }, this.getAvailableSpace(x.last) as number, this.balls[x.last][this.findLastBall(x.last) as number].recentPos.y - this.balls[x.last][this.findLastBall(x.last) as number].width)
                this.balls[x.last][this.getAvailableSpace(x.last) as number] = this.balls[x.current][this.findLastBall(x.current) as number];
                this.balls[x.current].pop();
                this.lastPos.pop();
            }

            // this.balls[i][this.getAvailableSpace(i) as number] = this.balls[j][index];
            // this.lastPos.push({ current: i, last: j })
            // this.balls[j].pop();
            // this.checkMatch(i);
        })
    }

    makeTimer() {
        const arc = new Graphics();
        arc.lineStyle(5, 0xFFFFFF, 1);
        arc.arc(0, 0, 70, Math.PI, 3 * Math.PI);
        arc.position.x = 950;
        arc.position.y = 100;
        this.addChild(arc);

        const timeLeftLable = new TextLabel(0, 0, 0.5, this.timeLeft.toString(), 30, 0xFFFFFF);
        arc.addChild(timeLeftLable);

        this.timeInterval = setInterval(() => {
            this.timeLeft--;
            timeLeftLable.upadteLabelText(this.timeLeft.toString());

            if (this.timeLeft == 0) {
                clearInterval(this.timeInterval);
            }

        }, 1000)
    }

    cancelButton() {
        const cancel = new Sprite(Globals.resources.cancel.texture);
        cancel.anchor.set(0.5);
        cancel.position.x = 100;
        cancel.position.y = 80;
        cancel.interactive = true;
        cancel.buttonMode = true;
        cancel.scale.set(0.2);
        cancel.on("pointerdown", () => {
            cancel.alpha = 0.8;
            Globals.emitter?.Call("MainScreen");
        })
        cancel.on("pointerup", () => {
            cancel.alpha = 1;
        })
        cancel.on("pointerout", () => {
            cancel.alpha = 1;
        })
        this.addChild(cancel);
    }

    refresh() {
        this.refreshButton = new Sprite(Globals.resources.refreshSprite.texture);
        this.refreshButton.position.x = 350;
        this.refreshButton.position.y = 50;
        this.refreshButton.scale.set(0.15);
        this.refreshButton.interactive = true;
        this.refreshButton.buttonMode = true;
        this.addChild(this.refreshButton);
        this.refreshButton.on("pointerdown", () => {
            this.resetLevel();
        })
    }
}