import { WebGLProgram, WebGLRenderingContext } from "../externals/WebGL";

export class ShaderMaterial {
    private _program: WebGLProgram = -1;
    private readonly _gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    public compile(vertexShaderCode: string, fragmentShaderCode: string): boolean {
        if (this._program >= 0) {
            throw new Error(`Material has been compiled before`);
        }

        const vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
        this._gl.shaderSource(vertexShader, vertexShaderCode);
        this._gl.compileShader(vertexShader);

        const fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
        this._gl.shaderSource(fragmentShader, fragmentShaderCode);
        this._gl.compileShader(fragmentShader);

        this._program = this._gl.createProgram();

        this._gl.attachShader(this._program, vertexShader);
        this._gl.attachShader(this._program, fragmentShader);
        this._gl.linkProgram(this._program);

        return true; // TODO: Check compilation status.
    }

    public getAttributeLocation(attribName: string): i32 {
        if (this._program < 0) return -1;
        return this._gl.getAttribLocation(this._program, attribName);
    }

    activate(): void {
        this._gl.useProgram(this._program);
    }
}
