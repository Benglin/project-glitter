import { WebGLRenderingContext } from "../externals/WebGL";
import { Particles } from "./Particles";

export class Renderer {
    private _particles: Particles;
    private _gl: WebGLRenderingContext;

    constructor(canvasId: string, contextType: string) {
        this._gl = new WebGLRenderingContext(canvasId, contextType);
        this._particles = new Particles(this._gl);
    }

    public getFrequencyBuffer(): Uint8Array {
        return this._particles.getFrequencyBuffer();
    }

    public updateFrame(): void {
        this._particles.update(0);
    }

    public renderFrame(): void {
        this._gl.clearColor(0.392, 0.584, 0.929, 1.0);
        this._gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        this._gl.enable(this._gl.BLEND);
        this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);

        this._particles.render();
    }
}
