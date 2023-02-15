import { OphWidget } from "../Core/OphWidget.js";
export class MenuItem extends OphWidget {
    constructor(x, y, icon, text) {
        super(x, y);
        this.ICON_SIZE = 30;
        this.icon = PIXI.Sprite.from(icon);
        this.icon.width = this.ICON_SIZE;
        this.icon.height = this.ICON_SIZE;
        this.text = new PIXI.Text(text);
        this.style = this.text.style;
        this.style.fill = "0xFFFFFF";
        this.text.x = 100;
        this.text.y = 0;
        this.container.addChild(this.icon);
        this.container.addChild(this.text);
    }
    onHover(isHover) {
        if (isHover) {
            this.style.fill = "0xFF0000";
            this.style.fontWeight = "800";
        }
        else {
            this.style.fill = "0xFFFFFF";
            this.style.fontWeight = "normal";
        }
    }
}
//# sourceMappingURL=MenuItem.js.map