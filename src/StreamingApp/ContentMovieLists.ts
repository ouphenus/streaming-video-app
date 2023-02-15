import { OphInterpolate } from "../Core/OphInterpolate.js";
import { Keys, OphUtils } from "../Core/OphUtils.js";
import { OphWidget } from "../Core/OphWidget.js";
import { MovieItemList } from "./MovieItemList.js";

export class ContentMovieLists extends OphWidget
{
    readonly SEPARATION:number = 400;
    readonly MAKER_X:number = -4;
    readonly MAKER_Y:number = 43;

    index:number = 0;
    movement:OphInterpolate;
    containerLists:TPIXI.Container;
    movieLists : Array<MovieItemList> = [];
    marker:TPIXI.Sprite;
    onExitLeft?:OnCallback;
    onChangeMovie?:OnChangeMovieCallback;

    constructor(x:number, y:number)
    {
        super(x, y)
        this.movement = new OphInterpolate();
        this.containerLists = new PIXI.Container();
        this.container.addChild(this.containerLists);

        this.marker =  PIXI.Sprite.from(`./assets/images/controls/selector.png`);
        this.marker.x = this.MAKER_X;
        this.marker.y = this.MAKER_Y;
        this.container.addChild(this.marker);
    }

    onKeyDown(evt:KeyboardEvent):void
    {
        if (evt.code == Keys.ArrowRight)
        {
            this.movieLists[this.index].goTo(1, undefined, this.onChangeMovie);
        }
        else if (evt.code == Keys.ArrowLeft)
        {
            this.movieLists[this.index].goTo(-1, this.onExitLeft, this.onChangeMovie);
        }
        else if (evt.code == Keys.ArrowUp)
        {
            this.goto(-1);

        }
        else if (evt.code == Keys.ArrowDown)
        {
            this.goto(1);
        }
    }

    onLoadData(data:Data):void
    {
        for (let i = 0; i < data.movieList.length; i++)
        {
            this.addList(0, this.SEPARATION * i, data.movieList[i]);
        }
    }

    goto(amount:number):void
    {
        if (!this.movement.isBusy)
        {
            let oldIndex = this.index;
            this.index += amount;
            this.index = OphUtils.clamp(this.index, 0, this.movieLists.length - 1 );
            this.movement.start(this.movement.value, this.index * this.SEPARATION, 400);

            if (oldIndex != this.index && this.onChangeMovie)
            {
                this.onChangeMovie(this.movieLists[this.index].getCurrenMovieItem().data);
            }

            this.marker.x = this.MAKER_X + (this.movieLists[this.index].showCounter ?
                MovieItemList.MARGIN_COUNTER:0);
        }
    }

    update(dt:number):void
    {
        for(let i = 0; i < this.movieLists.length; i++)
        {
            this.movieLists[i].update(dt);
        }

        this.movement.update(dt);
        this.containerLists.y = -this.movement.value;
    }

    addList(x:number, y:number, dataList:DataList):void
    {
        let list = new MovieItemList(x, y, dataList);
        this.containerLists.addChild(list.container);
        this.movieLists.push(list);
    }
}