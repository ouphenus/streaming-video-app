// @ts-nocheck
/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/crt.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object} [options] - The optional parameters of CRT effect
 * @param {number} [options.curvature=1.0] - Bent of interlaced lines, higher value means more bend
 * @param {number} [options.lineWidth=1.0] - Width of the interlaced lines
 * @param {number} [options.lineContrast=0.25] - Contrast of interlaced lines
 * @param {number} [options.verticalLine=false] - `true` is vertical lines, `false` is horizontal
 * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
 * @param {number} [options.noiseSize=1.0] - The size of the noise particles
 * @param {number} [options.seed=0] - A seed value to apply to the random noise generation
 * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
 *        values produces a smaller vignette
 * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
 * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
 * @param {number} [options.time=0] - For animating interlaced lines
 */
export default class CRTFilter extends PIXI.Filter {
    constructor(options) {
        let vertex = `attribute vec2 aVertexPosition;
            attribute vec2 aTextureCoord;
            uniform mat3 projectionMatrix;
            varying vec2 vTextureCoord;
            void main(void)
            {
                gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                vTextureCoord = aTextureCoord;
            }`;
        let fragment = `varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform vec4 filterArea;
            uniform vec2 dimensions;
            const float SQRT_2 = 1.414213;
            const float light = 1.0;
            uniform float curvature;
            uniform float lineWidth;
            uniform float lineContrast;
            uniform bool verticalLine;
            uniform float noise;
            uniform float noiseSize;
            uniform float vignetting;
            uniform float vignettingAlpha;
            uniform float vignettingBlur;
            uniform float seed;
            uniform float time;

            float rand(vec2 co) {
                return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main(void)
            {
                vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
                vec2 coord = pixelCoord / dimensions;

                vec2 dir = vec2(coord - vec2(0.5, 0.5));

                float _c = curvature > 0. ? curvature : 1.;
                float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;
                vec2 uv = dir * k;

                gl_FragColor = texture2D(uSampler, vTextureCoord);
                vec3 rgb = gl_FragColor.rgb;


                if (noise > 0.0 && noiseSize > 0.0)
                {
                    pixelCoord.x = floor(pixelCoord.x / noiseSize);
                    pixelCoord.y = floor(pixelCoord.y / noiseSize);
                    float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;
                    rgb += _noise * noise;
                }

                if (lineWidth > 0.0) {
                    float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;
                    float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;
                    rgb *= j;
                    float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);
                    rgb *= 0.99 + ceil(segment) * 0.015;
                }

                if (vignetting > 0.0)
                {
                    float outter = SQRT_2 - vignetting * SQRT_2;
                    float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);
                    rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);
                }

                gl_FragColor.rgb = rgb;
            }`;
        super(vertex, fragment);
        this.uniforms.dimensions = new Float32Array(2);
        /**
         * For animating interlaced lines
         *
         * @member {number}
         * @default 0
         */
        this.time = 0;
        /**
         * A seed value to apply to the random noise generation
         *
         * @member {number}
         * @default 0
         */
        this.seed = 0;
        Object.assign(this, {
            curvature: 1.0,
            lineWidth: 1.0,
            lineContrast: 0.25,
            verticalLine: false,
            noise: 0.0,
            noiseSize: 1.0,
            seed: 0.0,
            vignetting: 0.3,
            vignettingAlpha: 1.0,
            vignettingBlur: 0.3,
            time: 0.0,
        }, options);
    }
    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        // if (input.sourceFrame)
        // {
        //     this.uniforms.dimensions[0] = input.sourceFrame.width;
        //     this.uniforms.dimensions[1] = input.sourceFrame.height;
        // }
        if (input._frame) {
            this.uniforms.dimensions[0] = input._frame.width;
            this.uniforms.dimensions[1] = input._frame.height;
        }
        this.uniforms.seed = this.seed;
        this.uniforms.time = this.time;
        filterManager.applyFilter(this, input, output, clear);
    }
    /**
     * Bent of interlaced lines, higher value means more bend
     *
     * @member {number}
     * @default 1
     */
    set curvature(value) {
        this.uniforms.curvature = value;
    }
    get curvature() {
        return this.uniforms.curvature;
    }
    /**
     * Width of interlaced lines
     *
     * @member {number}
     * @default 1
     */
    set lineWidth(value) {
        this.uniforms.lineWidth = value;
    }
    get lineWidth() {
        return this.uniforms.lineWidth;
    }
    /**
     * Contrast of interlaced lines
     *
     * @member {number}
     * @default 0.25
     */
    set lineContrast(value) {
        this.uniforms.lineContrast = value;
    }
    get lineContrast() {
        return this.uniforms.lineContrast;
    }
    /**
     * `true` for vertical lines, `false` for horizontal lines
     *
     * @member {boolean}
     * @default false
     */
    set verticalLine(value) {
        this.uniforms.verticalLine = value;
    }
    get verticalLine() {
        return this.uniforms.verticalLine;
    }
    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     *
     * @member {number}
     * @default 0
     */
    set noise(value) {
        this.uniforms.noise = value;
    }
    get noise() {
        return this.uniforms.noise;
    }
    /**
     * The size of the noise particles
     *
     * @member {number}
     * @default 0
     */
    set noiseSize(value) {
        this.uniforms.noiseSize = value;
    }
    get noiseSize() {
        return this.uniforms.noiseSize;
    }
    /**
     * The radius of the vignette effect, smaller
     * values produces a smaller vignette
     *
     * @member {number}
     * @default 0
     */
    set vignetting(value) {
        this.uniforms.vignetting = value;
    }
    get vignetting() {
        return this.uniforms.vignetting;
    }
    /**
     * Amount of opacity of vignette
     *
     * @member {number}
     * @default 0
     */
    set vignettingAlpha(value) {
        this.uniforms.vignettingAlpha = value;
    }
    get vignettingAlpha() {
        return this.uniforms.vignettingAlpha;
    }
    /**
     * Blur intensity of the vignette
     *
     * @member {number}
     * @default 0
     */
    set vignettingBlur(value) {
        this.uniforms.vignettingBlur = value;
    }
    get vignettingBlur() {
        return this.uniforms.vignettingBlur;
    }
}
//# sourceMappingURL=CRTFilter.js.map