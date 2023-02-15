export var Keys;
(function (Keys) {
    Keys["ArrowRight"] = "ArrowRight";
    Keys["ArrowLeft"] = "ArrowLeft";
    Keys["ArrowDown"] = "ArrowDown";
    Keys["ArrowUp"] = "ArrowUp";
    Keys["Enter"] = "Enter";
})(Keys || (Keys = {}));
export class OphUtils {
    static CreateRectangle(x = 0, y = 0, width = 100, height = 100, color = 0xFFFFFF, gradient = false) {
        let sprite = PIXI.Sprite.from(`./assets/images/controls/${gradient ? "square-gradient" : "square"}.png`);
        sprite.x = x;
        sprite.y = y;
        sprite.width = width;
        sprite.height = height;
        sprite.tint = color;
        return sprite;
    }
    static clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
}
//# sourceMappingURL=OphUtils.js.map