import { OphInterpolate } from "../Core/OphInterpolate.js";
import { OphUtils } from "../Core/OphUtils.js";
import { OphWidget } from "../Core/OphWidget.js";
import { MovieItem } from "./MovieItem.js";
import { StreamingApp } from "./StreamingApp.js";
export class MovieItemList extends OphWidget {
    constructor(x, y, data) {
        super(x, y);
        this.SEPARATION = 242;
        this.ITEMS_OFFSET_Y = 52;
        this.movieItems = [];
        this.index = 0;
        this.data = data;
        // Agregando el título
        this.title = new PIXI.Text(this.data.title, { fill: 0xFFFFFF, fontSize: 32, fontWeight: 600 });
        this.movement = new OphInterpolate();
        this.containerItems = new PIXI.Container();
        this.showCounter = parseInt(this.data.showCounter, 0) == 1;
        this.separation = this.SEPARATION + (this.showCounter ? MovieItemList.MARGIN_COUNTER : 0);
        // Creando la lista de películas
        for (let i = 0; i < this.data.movies.length; i++) {
            this.addItem(this.separation * i, this.ITEMS_OFFSET_Y, StreamingApp.getDataMovie(this.data.movies[i]), i);
        }
        this.goTo(0);
        this.container.addChild(this.title);
        this.container.addChild(this.containerItems);
    }
    update(dt) {
        this.movement.update(dt);
        this.containerItems.x = -this.movement.value;
    }
    goTo(amount, exit, change) {
        if (!this.movement.isBusy) {
            let oldIndex = this.index;
            this.index += amount;
            if (this.index == -1 && exit) {
                exit();
            }
            this.index = OphUtils.clamp(this.index, 0, this.movieItems.length - 1);
            this.movement.start(this.movement.value, this.index * this.separation, 300);
            if (oldIndex != this.index && change) {
                change(this.movieItems[this.index].data);
            }
        }
    }
    getCurrenMovieItem() {
        return this.movieItems[this.index];
    }
    addItem(x, y, dataMovie, index) {
        if (dataMovie != null) {
            let item = new MovieItem(x, y, dataMovie, index, this.showCounter);
            this.containerItems.addChild(item.container);
            this.movieItems.push(item);
        }
    }
}
MovieItemList.MARGIN_COUNTER = 158;
//# sourceMappingURL=MovieItemList.js.map