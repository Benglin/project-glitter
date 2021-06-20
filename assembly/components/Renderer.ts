import { WebGLRenderingContext } from "../externals/WebGL";
import { Particles } from "./Particles";

export class Renderer {
    private _prevFrameMs: i64 = Date.now();
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
        const currFrameMs = Date.now();
        const elapsedMs = currFrameMs - this._prevFrameMs;

        this._prevFrameMs = currFrameMs;
        this._particles.update(<f32>elapsedMs);
    }

    public renderFrame(): void {
        const gl = this._gl;
        // gl.clearColor(0.392, 0.584, 0.929, 1.0);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this._particles.render();
    }
}
