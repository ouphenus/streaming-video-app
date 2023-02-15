import CRTFilter from "../Core/CRTFilter.js";
import { OphUtils } from "../Core/OphUtils.js";
import { OphWidget } from "../Core/OphWidget.js";

export class ContentMoviePreview extends OphWidget
{
    readonly MARGIN_X:number = 740;

    bg:TPIXI.Sprite;
    bgGradient:TPIXI.Sprite;
    logo:TPIXI.Sprite;
    previewLarge:TPIXI.Sprite;
    tvFrame:TPIXI.Sprite;
    topInfo:MoviePreviewTopInfo;
    info:TPIXI.Text;
    ctrFilter:CRTFilter;

    constructor(x:number, y:number)
    {
        super(x, y);

        this.logo = new PIXI.Sprite();
        this.previewLarge  = new PIXI.Sprite();
        this.previewLarge.x = this.MARGIN_X;

        this.ctrFilter = new CRTFilter({time:1, lineWidth:10, vignetting:0.1, noise:0.1, seed:0.5, vignettingBlur:0.5, noiseSize:5});
        this.previewLarge.filters = [this.ctrFilter];

        this.info = new PIXI.Text("",
            {
                wordWrap: true,
                wordWrapWidth: 740,
                align:"justify",
                fill:0xFFFFFF
            });

        this.info.x = 0;
        this.info.y = 300;

        this.topInfo = new MoviePreviewTopInfo(0, 256);

        this.bg = OphUtils.CreateRectangle(-177,0, 1920, 512, 0x000000);
        this.bgGradient = OphUtils.CreateRectangle(this.MARGIN_X - 2,0, 200, 512, 0x000000, true);

        this.tvFrame = PIXI.Sprite.from( "./assets/images/controls/tv-frame.png");
        this.tvFrame.x = this.MARGIN_X + 50;
        this.tvFrame.y = 25;
        this.tvFrame.scale.x = 0.9;
        this.tvFrame.scale.y = 0.9;

        this.previewLarge.y = 26;
        this.previewLarge.scale.x = 0.89;
        this.previewLarge.scale.y = 0.89;
        this.previewLarge.x = this.MARGIN_X + 51;

        this.container.addChild(this.bg);
        this.container.addChild(this.logo);
        this.container.addChild(this.previewLarge);
        this.container.addChild(this.tvFrame);
        // this.container.addChild(this.bgGradient);
        this.container.addChild(this.info);
        this.container.addChild(this.topInfo.container);
    }

    update(dt:number):void
    {
        this.ctrFilter.seed = Math.random() * 0.2;
        this.ctrFilter.time += 0.1;
    }

    setMovieData(data:DataMovie|null):void
    {
        if (data)
        {
            this.topInfo.textYear.text = data.year;
            this.topInfo.textAge.text = data.age + "+";
            this.topInfo.textDuration.text = data.duration;
            this.topInfo.textResolution.text = data.resolution;
            this.info.text = data.des;

            let texture = PIXI.Texture.from(`./assets/images/movies/${data.id}_logo.jpg`);
            this.logo.texture = texture;

            let img = new Image();
            img.onload = ()=> {this.onLoadImage()};
            img.src = `./assets/images/movies/${data.id}_preview_large.jpg`;
            let base = new PIXI.BaseTexture(img);
            this.previewLarge.texture = new PIXI.Texture(base);
        }
    }

    onLoadImage():void
    {
        // TODO
    }
}

export class MoviePreviewTopInfo extends OphWidget
{
    readonly ICON_SIZE:number = 32;
    textYear:TPIXI.Text;
    textAge:TPIXI.Text;
    textDuration:TPIXI.Text;
    textResolution:TPIXI.Text;
    iconAge:TPIXI.Sprite;
    iconResolution:TPIXI.Sprite;
    iconSubtitle:TPIXI.Sprite;

    constructor(x:number, y:number)
    {
        super(x, y);
        this.textYear = new PIXI.Text("2001", {fill:0xFFFFFF});

        this.textAge = new PIXI.Text("16+", {fill:0xFFFFFF, fontSize: 20, fontWeight: 800});
        this.textAge.x = 90;
        this.textAge.y = 4;

        this.iconAge = PIXI.Sprite.from(`./assets/images/icons/icon-square.png`);
        this.iconAge.width = this.ICON_SIZE + 26;
        this.iconAge.height = this.ICON_SIZE;
        this.iconAge.x = 80;

        this.textDuration = new PIXI.Text("3 Seasons", {fill:0xFFFFFF});
        this.textDuration.x = 150;

        this.textResolution = new PIXI.Text("HD", {fill:0x000000, fontSize: 20, fontWeight: 600});
        this.textResolution.x = 326;
        this.textResolution.y = 4;

        this.iconResolution = PIXI.Sprite.from(`./assets/images/icons/icon-square-white.png`);
        this.iconResolution.width = this.ICON_SIZE + 10;
        this.iconResolution.height = this.ICON_SIZE;
        this.iconResolution.x = 320;

        this.iconSubtitle = PIXI.Sprite.from(`./assets/images/icons/icon-subtitle.png`);
        this.iconSubtitle.width = this.ICON_SIZE;
        this.iconSubtitle.height = this.ICON_SIZE;
        this.iconSubtitle.x = 370;

        this.container.addChild(this.textYear);
        this.container.addChild(this.iconAge);
        this.container.addChild(this.textAge);
        this.container.addChild(this.textDuration);
        this.container.addChild(this.iconResolution);
        this.container.addChild(this.iconSubtitle);
        this.container.addChild(this.textResolution);
    }
}