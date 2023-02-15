export {}

declare global
{
    const PIXI = window.PIXI;

    type OnCallback = ()=>void;
    type OnChangeMovieCallback = (id:DataMovie)=>void;

    interface OphApp
    {
        container:TPIXI.Container|null;
        update:(dt:number)=>void;
        onKeyDown:(evt:KeyboardEvent)=>void;
    }

    interface Data
    {
        menuLeft:{icon:string, des:string}[];
        movieList:Array<DataList>;
        movies:Array<DataMovie>;
    }

    interface DataList
    {
        title:string;
        showCounter:string;
        movies:Array<string>;
    }

    interface DataMovie
    {
        id:string;
        des:string;
        year:string;
        age:string;
        duration:string;
        resolution:string;
    }

    export namespace TPIXI
    {
        export type Application = {
            view:HTMLCanvasElement;
            stage:Container;
            ticker:Ticker;
            renderer;
        };

        export type Point = {
            x:number;
            y:number;
        }

        export type Ticker = {
            deltaMS:number;
            add:(time:number)=>void;
        };

        export type Container = {
            x:number;
            y:number;
            alpha:number;
            scale:Point;
            addChild:(child:any)=>void;
            removeChild:(child:any)=>void;
            filters;
        };

        export type Sprite = {
            x:number;
            y:number;
            width:number;
            height:number;
            tint:number;
            alpha:number;
            scale:Point;
            pivot:Point;
            texture;
            filters;
        };

        export type Text = {
            text:string;
            x:number;
            y:number;
            scale:Point;
            alpha:number;
            style:TextStyle;
        };

        export type TextStyle = {
            align:string = "left";
            breakWords:boolean = false;
            dropShadow:boolean = false;
            dropShadowAlpha:number = 1;
            dropShadowAngle:number = Math.PI / 6;
            dropShadowBlur:number =  0;
            dropShadowColor:string = "black";
            dropShadowDistance:number =  5;
            fill:string = "black";
            // fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
            // fillGradientStops: [],
            fontFamily:string = "Arial";
            fontSize:number = 26;
            fontStyle:string = "normal";
            fontVariant:string = "normal";
            fontWeight:string = "normal";
            leading:number = 0;
            letterSpacing:number = 0;
            lineHeight:number = 0;
            lineJoin:string = "miter";
            miterLimit:number = 10;
            padding:number = 0;
            stroke:string = "black";
            strokeThickness:number = 0;
            textBaseline:string = "alphabetic";
            trim:boolean = false;
            whiteSpace:string = "pre";
            wordWrap:boolean = false;
            wordWrapWidth:number = 100;
          };
    }
}


