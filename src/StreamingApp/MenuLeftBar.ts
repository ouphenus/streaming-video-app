import { OphInterpolate } from "../Core/OphInterpolate.js";
import { OphUtils } from "../Core/OphUtils.js";
import { OphWidget } from "../Core/OphWidget.js";
import { MenuItem } from "./MenuItem.js";

export class MenuLeftBar extends OphWidget
{
    readonly MARGIN_X:number = 80;
    readonly MARGIN_Y:number = 300;
    readonly SEPARATION:number = 80;

    index:number = 0;
    items:Array<MenuItem>;
    bg:TPIXI.Sprite;
    bgIcons:TPIXI.Sprite;
    marker:TPIXI.Sprite;
    markerMove:OphInterpolate;
    appear:OphInterpolate;
    isShow:boolean = false;

    constructor(x:number, y:number)
    {
        super(x, y);
        this.items = new Array<MenuItem>();
        this.bg = OphUtils.CreateRectangle(0, 0, 3000, 2200, 0x000000, true);

        this.bgIcons = OphUtils.CreateRectangle(0,0, 177, 2200, 0x000000);
        this.bgIcons.alpha = 0.7;
        this.marker = OphUtils.CreateRectangle(0,0, 40, 10, 0xFF0000);

        this.marker.x = this.MARGIN_X - 5;
        this.marker.y = 415;

        this.markerMove = new OphInterpolate();
        this.appear = new OphInterpolate();

        this.container.addChild(this.bg);
        this.container.addChild(this.bgIcons);
        this.container.addChild(this.marker);
    }

    update(dt:number):void
    {
        this.markerMove.update(dt);
        this.marker.y = this.MARGIN_Y + 40 + this.markerMove.value;

        this.appear.update(dt);
        this.bg.alpha = this.appear.value;
        this.items.forEach(item => {
            item.text.alpha = this.appear.value;
        });
    }

    onLoadData(data:Data):void
    {
        for (let i = 0; i < data.menuLeft.length; i++)
        {
            this.addItem(this.MARGIN_X,
                this.MARGIN_Y + this.SEPARATION * i,
                data.menuLeft[i].icon,
                data.menuLeft[i].des);
        }
        this.goto(1);
    }

    goto(amount:number):void
    {
        if (!this.markerMove.isBusy)
        {
            let oldIndex = this.index;
            this.index += amount;
            this.index = OphUtils.clamp(this.index, 0, this.items.length - 1);
            this.markerMove.start(this.markerMove.value, this.index * this.SEPARATION, 100);
            this.items[this.index].onHover(true);

            if (oldIndex != this.index)
            {
                this.items[oldIndex].onHover(false);
            }
        }
    }

    show(value:boolean):void
    {
        if (!this.appear.isBusy)
        {
            this.isShow = value;
            this.appear.start(this.appear.value, this.isShow ? 1 : 0, 300);
        }
    }

    addItem(x:number, y:number, icon:string, description:string):void
    {
        let item = new MenuItem(x, y, icon, description);
        this.container.addChild(item.container);
        this.items.push(item);
    }
}