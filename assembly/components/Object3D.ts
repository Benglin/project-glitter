import { WebGLRenderingContext } from "../externals/WebGL";

export class Object3D {
    private readonly _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    get gl(): WebGLRenderingContext {
        return this._gl;
    }
}
