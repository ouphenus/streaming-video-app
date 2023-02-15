import { OphInterpolate } from "../Core/OphInterpolate.js";
import { Keys, OphUtils } from "../Core/OphUtils.js";
import { OphWidget } from "../Core/OphWidget.js";
import { ContentMovieLists } from "./ContentMovieLists.js";
import { ContentMoviePreview } from "./ContentMoviePreview.js";
import { MenuLeftBar } from "./MenuLeftBar.js";
export class StreamingApp {
    constructor() {
        var _a, _b, _c, _d;
        this.MARGIN_CONTENT = 177;
        this.container = null;
        this.container = new PIXI.Container();
        this.popupInfo = new PopupInfo();
        this.contentMovies = new ContentMovieLists(this.MARGIN_CONTENT, 512);
        this.contentPreview = new ContentMoviePreview(this.MARGIN_CONTENT, 0);
        this.menuLeftBar = new MenuLeftBar(0, 0);
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.addChild(this.contentMovies.container);
        (_b = this.container) === null || _b === void 0 ? void 0 : _b.addChild(this.contentPreview.container);
        (_c = this.container) === null || _c === void 0 ? void 0 : _c.addChild(this.menuLeftBar.container);
        this.contentMovies.onExitLeft = () => { this.menuLeftBar.show(true); };
        this.contentMovies.onChangeMovie = (data) => { this.onChangeMovie(data); };
        this.getData();
        (_d = this.container) === null || _d === void 0 ? void 0 : _d.addChild(this.popupInfo.container);
    }
    getData() {
        return fetch('./assets/data/data.json').then(res => res.json())
            .then(res => {
            // The response has an "any" type, so we need to cast to "Data"
            this.onLoadData(res);
            return res;
        });
    }
    onLoadData(data) {
        console.log("onLoadData :: data", data);
        StreamingApp.data = data;
        this.menuLeftBar.onLoadData(data);
        this.contentMovies.onLoadData(data);
        // Set Firts data
        this.contentPreview.setMovieData(StreamingApp.getDataMovie("001"));
    }
    onKeyDown(evt) {
        if (this.popupInfo) {
            return;
        }
        if (this.menuLeftBar.isShow) {
            if (evt.code == Keys.ArrowUp) {
                this.menuLeftBar.goto(-1);
            }
            else if (evt.code == Keys.ArrowDown) {
                this.menuLeftBar.goto(1);
            }
            else if (evt.code == Keys.ArrowLeft ||
                evt.code == Keys.ArrowRight ||
                evt.code == Keys.Enter) {
                this.menuLeftBar.show(false);
            }
        }
        else {
            this.contentMovies.onKeyDown(evt);
        }
    }
    onChangeMovie(data) {
        this.contentPreview.setMovieData(data);
    }
    update(dt) {
        var _a;
        this.contentMovies.update(dt);
        this.menuLeftBar.update(dt);
        this.contentPreview.update(dt);
        if (this.popupInfo) {
            this.popupInfo.update(dt);
            if (this.popupInfo.timeShowInfo <= 0) {
                (_a = this.container) === null || _a === void 0 ? void 0 : _a.removeChild(this.popupInfo.container);
                this.popupInfo = null;
            }
        }
    }
    static getDataMovie(idMovie) {
        for (let i = 0; i < StreamingApp.data.movies.length; i++) {
            if (StreamingApp.data.movies[i].id == idMovie) {
                return StreamingApp.data.movies[i];
            }
        }
        return null;
    }
}
export class PopupInfo extends OphWidget {
    constructor() {
        super(0, 0);
        this.timeShowInfo = 3500;
        this.bg = OphUtils.CreateRectangle(0, 0, 1920, 2400, 0x000000);
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
    update(dt) {
        this.move.update(dt);
        this.imageInfo.scale.x = this.move.value;
        this.imageInfo.scale.y = this.move.value;
        this.timeShowInfo -= dt;
    }
}
//# sourceMappingURL=StreamingApp.js.map