import { WebGLProgram, WebGLRenderingContext } from "../externals/WebGL";
import { Object3D } from "./Object3D";

export class ShaderMaterial extends Object3D {
    private _program: WebGLProgram = -1;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    public compile(vertexShaderCode: string, fragmentShaderCode: string): void {
        if (this._program >= 0) {
            throw new Error(`Material has been compiled before`);
        }

        const gl = this.gl;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderCode);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderCode);
        gl.compileShader(fragmentShader);

        this._program = gl.createProgram();

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);

        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(this._program);
            throw new Error(`WebGL program compilation failed: ${info}`);
        }
    }

    public getAttributeLocation(attribName: string): i32 {
        if (this._program < 0) return -1;
        return this.gl.getAttribLocation(this._program, attribName);
    }

    activate(): void {
        this.gl.useProgram(this._program);
    }
}
