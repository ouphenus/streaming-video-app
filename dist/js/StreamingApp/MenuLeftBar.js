import { OphInterpolate } from "../Core/OphInterpolate.js";
import { OphUtils } from "../Core/OphUtils.js";
import { OphWidget } from "../Core/OphWidget.js";
import { MenuItem } from "./MenuItem.js";
export class MenuLeftBar extends OphWidget {
    constructor(x, y) {
        super(x, y);
        this.MARGIN_X = 80;
        this.MARGIN_Y = 300;
        this.SEPARATION = 80;
        this.index = 0;
        this.isShow = false;
        this.items = new Array();
        this.bg = OphUtils.CreateRectangle(0, 0, 3000, 2200, 0x000000, true);
        this.bgIcons = OphUtils.CreateRectangle(0, 0, 177, 2200, 0x000000);
        this.bgIcons.alpha = 0.7;
        this.marker = OphUtils.CreateRectangle(0, 0, 40, 10, 0xFF0000);
        this.marker.x = this.MARGIN_X - 5;
        this.marker.y = 415;
        this.markerMove = new OphInterpolate();
        this.appear = new OphInterpolate();
        this.container.addChild(this.bg);
        this.container.addChild(this.bgIcons);
        this.container.addChild(this.marker);
    }
    update(dt) {
        this.markerMove.update(dt);
        this.marker.y = this.MARGIN_Y + 40 + this.markerMove.value;
        this.appear.update(dt);
        this.bg.alpha = this.appear.value;
        this.items.forEach(item => {
            item.text.alpha = this.appear.value;
        });
    }
    onLoadData(data) {
        for (let i = 0; i < data.menuLeft.length; i++) {
            this.addItem(this.MARGIN_X, this.MARGIN_Y + this.SEPARATION * i, data.menuLeft[i].icon, data.menuLeft[i].des);
        }
        this.goto(1);
    }
    goto(amount) {
        if (!this.markerMove.isBusy) {
            let oldIndex = this.index;
            this.index += amount;
            this.index = OphUtils.clamp(this.index, 0, this.items.length - 1);
            this.markerMove.start(this.markerMove.value, this.index * this.SEPARATION, 100);
            this.items[this.index].onHover(true);
            if (oldIndex != this.index) {
                this.items[oldIndex].onHover(false);
            }
        }
    }
    show(value) {
        if (!this.appear.isBusy) {
            this.isShow = value;
            this.appear.start(this.appear.value, this.isShow ? 1 : 0, 300);
        }
    }
    addItem(x, y, icon, description) {
        let item = new MenuItem(x, y, icon, description);
        this.container.addChild(item.container);
        this.items.push(item);
    }
}
//# sourceMappingURL=MenuLeftBar.js.map