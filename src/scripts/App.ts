import * as PIXI from 'pixi.js'
import { CalculateScaleFactor } from './appConfig';
import { Globals } from './Globals';
import { Loader } from './Loader';
import { MainScene } from './MainScene';
import { MyEmitter } from './MyEmitter';
import { Scene } from './Scene';
import { SceneManager } from './SceneManager';
// import { Loader } from "./Loader";
// import { SceneManager } from "./SceneManager";
// import { MainScene } from "./MainScene";


export class App {

    app: PIXI.Application;


    isDeviceLandscape!: boolean;

    isDeviceOrientationChanged: boolean = false;

    constructor() {
        // create canvas

        PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, antialias: true });
        // this.app = new PIXI.Application({width : window.innerWidth, height : window.innerHeight});
        document.body.appendChild(this.app.view);
        // document.body.appendChild( Globals.fpsStats.dom );
        // document.body.appendChild( Globals.stats.dom );

        CalculateScaleFactor();

        this.app.renderer.view.style.width = `${window.innerWidth}px`;
        this.app.renderer.view.style.height = `${window.innerHeight}px`;
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        PIXI.MIPMAP_MODES.ON;
        this.app.view.oncontextmenu = (e) => {
            e.preventDefault();

        };

        //Setting Up Window On Resize Callback
        window.onresize = (e) => {

            this.checkIfDeviceRotated();

            if (this.isDeviceOrientationChanged) {
                // this.isDeviceOrientationChanged = false;
                document.body.removeChild(this.app.view);
            }

            CalculateScaleFactor();

            this.app.renderer.view.style.width = `${window.innerWidth}px`;
            this.app.renderer.view.style.height = `${window.innerHeight}px`;
            this.app.renderer.resize(window.innerWidth, window.innerHeight);


            SceneManager.instance!.resize();

            if (this.isDeviceOrientationChanged) {
                document.body.append(this.app.view);
                this.isDeviceOrientationChanged = false;
            }

        }


        //Created Emitter
        Globals.emitter = new MyEmitter();

        //Create Scene Manager
        new SceneManager();

        this.app.stage.addChild(SceneManager.instance.container);
        this.app.ticker.add(dt => SceneManager.instance!.update(dt));


        // loader for loading data
        const loaderContainer = new PIXI.Container();
        this.app.stage.addChild(loaderContainer);

        const loader = new Loader(this.app.loader, loaderContainer);


        loader.preload().then(() => {
            setTimeout(() => {
                loaderContainer.destroy();

                SceneManager.instance!.start(new MainScene());
            }, 1000);
        });

        loader.preloadSounds();

       
    }

    tabChange() {
        document.addEventListener("visibilitychange", event => {
            if (document.visibilityState === "visible") {
                Globals.emitter?.Call("resume", true)
                console.log("tab active");
            } else {
                Globals.emitter?.Call("resume", false)
                console.log("tab inactive");
            }
        })
    }
    checkIfDeviceRotated() {
        if (window.innerWidth > window.innerHeight) {
            if (!this.isDeviceLandscape) {
                this.isDeviceOrientationChanged = true;
            }

            //landscape
        } else {
            if (!this.isDeviceLandscape) {
                this.isDeviceOrientationChanged = true;
            }
            //portrait
        }
    }

}