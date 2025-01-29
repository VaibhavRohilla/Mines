import { Container, InteractionEvent, Texture } from "pixi.js";
import { config } from "./appConfig";
import { BackgroundGraphic, BackgroundSprite } from "./Background";
import { Globals } from "./Globals";

export abstract class Scene {
  private sceneContainer: Container;
  mainContainer: Container;
  mainBackground: BackgroundGraphic | BackgroundSprite;

  private minY: number = 0; // Minimum scroll position
    maxY: number = -2963; // Maximum scroll position
  private scrollSpeed: number = 50; // Speed of scrolling
  callBack !: ()=>void;
  private isDragging: boolean = false; // Track drag state
  private dragStartY: number = 0; // Track drag start position
  constructor(fullBackgroundColor: number | Texture) {
    this.sceneContainer = new Container();
    this.sceneContainer.interactive = true; // Enable interactivity

    this.mainBackground =
      typeof fullBackgroundColor === "number"
        ? new BackgroundGraphic(window.innerWidth, window.innerHeight, fullBackgroundColor)
        : new BackgroundSprite(fullBackgroundColor, window.innerWidth, window.innerHeight);

    this.sceneContainer.addChild(this.mainBackground);
    this.mainContainer = new Container();
    this.resetMainContainer();
    this.sceneContainer.addChild(this.mainContainer);

    this.enableMouseWheelScrolling(); // Enable mouse wheel scrolling
    this.enableDragging();
  }

  resetMainContainer() {
    this.mainContainer.x = config.minLeftX;
    this.mainContainer.y = 0;
    this.mainContainer.scale.set(config.minScaleFactor);
  }

  resize(): void {
    console.log("CALLED");
    
    this.resetMainContainer();

    // Adjust scroll boundaries dynamically if necessary
    this.maxY = window.innerHeight - this.sceneContainer.height;
  }

  initScene(container: Container) {
    container.addChild(this.sceneContainer);
  }

  destroyScene() {
    this.sceneContainer.destroy();
  }

  addChildToFullScene(component: any) {
    this.sceneContainer.addChild(component);
  }

  removeChildToFullScene(component: any) {
    this.sceneContainer.removeChild(component);
  }

  addChildToIndexFullScene(component: any, index: number) {
    this.sceneContainer.addChildAt(component, index);
  }

  // Enable mouse wheel scrolling
  private enableMouseWheelScrolling() {
    Globals.App?.app.view.addEventListener(
      "wheel",
      (event: WheelEvent) => this.onMouseWheel(event),
      { passive: true } // Add the passive option
  );
  }

  private enableDragging() {
    this.sceneContainer.on("pointerdown", this.onDragStart, this);
    this.sceneContainer.on("pointermove", this.onDragMove, this);
    this.sceneContainer.on("pointerup", this.onDragEnd, this);
    this.sceneContainer.on("pointerupoutside", this.onDragEnd, this);
}

private onDragStart(event: InteractionEvent) {
  this.isDragging = true;
  this.dragStartY = event.data.global.y - this.sceneContainer.y; // Store the offset
}

private onDragMove(event: InteractionEvent) {
  if (this.isDragging) {
    
    const newY = event.data.global.y - this.dragStartY; // Calculate the new position

    // Clamp the position within the allowed range
    this.sceneContainer.y = Math.max(this.maxY, Math.min(newY, this.minY));
    if(this.callBack)
      this.callBack();
  }
}

private onDragEnd() {
  this.isDragging = false;
}

  private onMouseWheel(event: WheelEvent) {
    // Adjust the sceneContainer's position based on the wheel delta
    const delta = event.deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed;
    const newY = this.sceneContainer.y -delta;
    if(this.callBack)
    this.callBack();

    // Clamp the position within the allowed range
    this.sceneContainer.y = Math.max(this.maxY, Math.min(newY, this.minY));
  }

  abstract update(dt: number): void;

  abstract recievedMessage(msgType: string, msgParams: any): void;
}
