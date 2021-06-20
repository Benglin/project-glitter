import { WebGLProgram, WebGLRenderingContext } from "../externals/WebGL";
import { Object3D } from "./Object3D";
import { Texture } from "./Texture";

export class ShaderMaterial extends Object3D {
    private readonly _uniformLocations: Map<string, i32> = new Map();
    private _program: WebGLProgram = -1;

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

    public getAttribLocation(attribName: string): i32 {
        if (this._program < 0) return -1;
        return this.gl.getAttribLocation(this._program, attribName);
    }

    public setUniform1f(uniformName: string, value: f32): void {
        const location = this._getUniformLocation(uniformName);
        this.gl.uniform1f(location, value);
    }

    public setUniform1fv(uniformName: string, value: StaticArray<f32>): void {
        const location = this._getUniformLocation(uniformName);
        this.gl.uniform1fv(location, value);
    }

    public setUniform1i(uniformName: string, value: i32): void {
        const location = this._getUniformLocation(uniformName);
        this.gl.uniform1i(location, value);
    }

    public setUniform2f(uniformName: string, x: f32, y: f32): void {
        const location = this._getUniformLocation(uniformName);
        this.gl.uniform2f(location, x, y);
    }

    public bindTexture(texUnitIndex: u32, uniformName: string, texture: Texture): void {
        this.activate();
        this.setUniform1i(uniformName, texUnitIndex);
        texture.activate(texUnitIndex);
    }

    public activate(): void {
        this.gl.useProgram(this._program);
    }

    private _getUniformLocation(uniformName: string): i32 {
        if (this._program < 0) {
            throw new Error(`Invalid program to set uniform: ${uniformName}`);
        }

        const uniformLocations = this._uniformLocations;

        if (!uniformLocations.has(uniformName)) {
            const loc = this.gl.getUniformLocation(this._program, uniformName);
            uniformLocations.set(uniformName, loc);
        }

        return uniformLocations.get(uniformName);
    }
}
