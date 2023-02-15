import { Keys } from "../Core/OphUtils.js";
import { ContentMovieLists } from "./ContentMovieLists.js";
import { ContentMoviePreview } from "./ContentMoviePreview.js";
import { MenuLeftBar } from "./MenuLeftBar.js";
export class StreamingApp {
    constructor() {
        var _a, _b, _c;
        this.MARGIN_CONTENT = 177;
        this.container = null;
        this.container = new PIXI.Container();
        this.contentMovies = new ContentMovieLists(this.MARGIN_CONTENT, 512);
        this.contentPreview = new ContentMoviePreview(this.MARGIN_CONTENT, 0);
        this.menuLeftBar = new MenuLeftBar(0, 0);
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.addChild(this.contentMovies.container);
        (_b = this.container) === null || _b === void 0 ? void 0 : _b.addChild(this.contentPreview.container);
        (_c = this.container) === null || _c === void 0 ? void 0 : _c.addChild(this.menuLeftBar.container);
        this.contentMovies.onExitLeft = () => { this.menuLeftBar.show(true); };
        this.contentMovies.onChangeMovie = (data) => { this.onChangeMovie(data); };
        this.getData();
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
        this.contentMovies.update(dt);
        this.menuLeftBar.update(dt);
        this.contentPreview.update(dt);
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
//# sourceMappingURL=StreamingApp.js.map