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

    constructor()
    {
        this.container = new PIXI.Container();
        this.contentMovies = new ContentMovieLists(this.MARGIN_CONTENT, 512);
        this.contentPreview = new ContentMoviePreview(this.MARGIN_CONTENT, 0);
        this.menuLeftBar = new MenuLeftBar(0, 0);

        this.container?.addChild(this.contentMovies.container);
        this.container?.addChild(this.contentPreview.container);
        this.container?.addChild(this.menuLeftBar.container);
        this.contentMovies.onExitLeft = ()=>{this.menuLeftBar.show(true);};
        this.contentMovies.onChangeMovie = (data:DataMovie)=>{ this.onChangeMovie(data); }
        this.getData();
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
        StreamingApp.data = data;
        this.menuLeftBar.onLoadData(data);
        this.contentMovies.onLoadData(data);
        // Set Firts data
        this.contentPreview.setMovieData(StreamingApp.getDataMovie("001"));
    }

    onKeyDown(evt:KeyboardEvent):void
    {
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