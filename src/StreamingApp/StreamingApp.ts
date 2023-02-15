import { OphInterpolate } from "../Core/OphInterpolate.js";
import { Keys, OphUtils } from "../Core/OphUtils.js";
import { OphWidget } from "../Core/OphWidget.js";
import { ContentMovieLists } from "./ContentMovieLists.js";
import { ContentMoviePreview } from "./ContentMoviePreview.js";
import { MenuLeftBar } from "./MenuLeftBar.js";
import { MovieItemList } from "./MovieItemList.js";

export class StreamingApp implements OphApp
{
    readonly MARGIN_CONTENT:number = 177;
    static data:Data;

    container:TPIXI.Container|null = null;
    menuLeftBar:MenuLeftBar;
    contentMovies:ContentMovieLists;
    contentPreview:ContentMoviePreview;
    popupInfo:PopupInfo|null;

    constructor()
    {
        this.container = new PIXI.Container();
        this.popupInfo = new PopupInfo();
        this.contentMovies = new ContentMovieLists(this.MARGIN_CONTENT, 512);
        this.contentPreview = new ContentMoviePreview(this.MARGIN_CONTENT, 0);
        this.menuLeftBar = new MenuLeftBar(0, 0);

        this.container?.addChild(this.contentMovies.container);
        this.container?.addChild(this.contentPreview.container);
        this.container?.addChild(this.menuLeftBar.container);
        this.contentMovies.onExitLeft = ()=>{this.menuLeftBar.show(true);};
        this.contentMovies.onChangeMovie = (data:DataMovie)=>{ this.onChangeMovie(data); }
        this.getData();
        this.container?.addChild(this.popupInfo.container);
    }

    getData():Promise<Data>
    {
        return fetch('./assets/data/data.json').then(res => res.json())
        .then(res => {
            // The response has an "any" type, so we need to cast to "Data"
            this.onLoadData(res as Data);
            return res;
        })
    }

    onLoadData(data:Data):void
    {
        console.log("onLoadData :: data", data);
        StreamingApp.data = data;
        this.menuLeftBar.onLoadData(data);
        this.contentMovies.onLoadData(data);
        // Set Firts data
        this.contentPreview.setMovieData(StreamingApp.getDataMovie("001"));
    }

    onKeyDown(evt:KeyboardEvent):void
    {
        if (this.popupInfo) { return; }

        if (this.menuLeftBar.isShow)
        {
            if (evt.code == Keys.ArrowUp)
            {
                this.menuLeftBar.goto(-1);
            }
            else if (evt.code == Keys.ArrowDown)
            {
                this.menuLeftBar.goto(1);
            }
            else if (evt.code == Keys.ArrowLeft ||
                evt.code == Keys.ArrowRight ||
                evt.code == Keys.Enter)
            {
                this.menuLeftBar.show(false);
            }
        }
        else
        {
            this.contentMovies.onKeyDown(evt);
        }
    }

    onChangeMovie(data:DataMovie)
    {
        this.contentPreview.setMovieData(data);
    }

    update(dt:number):void
    {
        this.contentMovies.update(dt);
        this.menuLeftBar.update(dt);
        this.contentPreview.update(dt);

        if (this.popupInfo)
        {
            this.popupInfo.update(dt);
            if (this.popupInfo.timeShowInfo <= 0)
            {
                this.container?.removeChild(this.popupInfo.container);
                this.popupInfo = null;
            }
        }
    }

    static getDataMovie(idMovie:string):DataMovie|null
    {
        for (let i = 0; i < StreamingApp.data.movies.length; i++)
        {
            if (StreamingApp.data.movies[i].id == idMovie)
            {
                return StreamingApp.data.movies[i];
            }
        }

        return null;
    }
}

export class PopupInfo extends OphWidget
{
    bg:TPIXI.Sprite;
    imageInfo:TPIXI.Sprite;
    timeShowInfo:number = 3500;
    move:OphInterpolate;

    constructor()
    {
        super(0, 0);
        this.bg = OphUtils.CreateRectangle(0,0, 1920, 2400, 0x000000);
        this.bg.alpha = 0.7;
        this.container.addChild(this.bg);
        this.imageInfo = PIXI.Sprite.from("./assets/images/controls/info.png");
        this.imageInfo.pivot.x = 512 * 0.5;
        this.imageInfo.pivot.y = 512 * 0.5;
        this.imageInfo.x = 960;
        this.imageInfo.y = 300;
        this.container.addChild(this.imageInfo);
        this.move = new OphInterpolate();
        this.move.start(0, 1, 500);
    }

    update(dt:number)
    {
        this.move.update(dt);
        this.imageInfo.scale.x = this.move.value;
        this.imageInfo.scale.y = this.move.value;
        this.timeShowInfo -= dt;
    }
}