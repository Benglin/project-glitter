import { WebGLRenderingContext } from "../externals/WebGL";
import { Particles } from "./Particles";
import { TestTriangle } from "./TestTriangle";

export class Renderer {
    private _particles: Particles;
    private _triangle: TestTriangle;
    private _gl: WebGLRenderingContext;

    constructor(canvasId: string, contextType: string) {
        this._gl = new WebGLRenderingContext(canvasId, contextType);
        this._particles = new Particles(this._gl);
        this._triangle = new TestTriangle(this._gl);
    }

    updateFrame(): void {
        this._particles.update(0);
    }

    renderFrame(): void {
        this._gl.clearColor(0.392, 0.584, 0.929, 1.0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        this._particles.render();
        //this._triangle.render();
    }
}
