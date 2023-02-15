export class OphRender {
    constructor(app) {
        this.appWidth = 1920;
        this.appHeight = 1080;
        this.app = app;
        document.addEventListener('keydown', (evt) => { this.onKeyDown(evt); });
        this.pixiApp = new PIXI.Application({ width: this.appWidth, height: this.appHeight, antialias: true });
        this.canvas = this.pixiApp.view;
        this.canvas.style.position = "absolute";
        document.body.appendChild(this.pixiApp.view);
        // @ts-ignore
        this.pixiApp.ticker.add(() => this.update(this.pixiApp.ticker.deltaMS));
        this.pixiApp.stage.addChild(this.app.container);
    }
    /**
    * @param evt Evento del teclado
    * */
    onKeyDown(evt) {
        this.app.onKeyDown(evt);
        document.documentElement.requestFullscreen();
        evt.preventDefault();
    }
    /**
    * @param dt Delta de tiempo
    * */
    update(dt) {
        this.app.update(dt);
        if (this.appWidth != window.innerWidth || this.appHeight != window.innerHeight) {
            this.onResize();
        }
    }
    /**
    * Reaclculando dimensiones del Browser
    * */
    onResize() {
        this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
        let scale = window.innerWidth / this.appWidth;
        if (this.app.container) {
            this.app.container.scale.x = scale;
            this.app.container.scale.y = scale;
        }
    }
}
//# sourceMappingURL=OphRender.js.map