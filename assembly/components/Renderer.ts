import { WebGLRenderingContext } from "../externals/WebGL";
import { TestTriangle } from "./TestTriangle";
import { Texture } from "./Texture";

export class Renderer {
    private _triangle: TestTriangle;
    private _gl: WebGLRenderingContext;

    private readonly _t: Texture;
    constructor(canvasId: string, contextType: string) {
        this._gl = new WebGLRenderingContext(canvasId, contextType);
        this._triangle = new TestTriangle(this._gl);

        this._t = new Texture(this._gl);
        this._t.load("circle.svg");
    }

    updateFrame(): void {
        this._triangle.update(0);
    }

    renderFrame(): void {
        this._gl.clearColor(0.392, 0.584, 0.929, 1.0);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);

        this._triangle.render();
    }
}
