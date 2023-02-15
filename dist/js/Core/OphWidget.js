export class OphWidget {
    constructor(x = 0, y = 0) {
        this.container = new PIXI.Container();
        this.setPosition(x, y);
    }
    setPosition(x, y) {
        this.container.x = x;
        this.container.y = y;
    }
}
//# sourceMappingURL=OphWidget.js.map