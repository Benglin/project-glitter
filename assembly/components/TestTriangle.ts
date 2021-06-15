import { WebGLRenderingContext } from "../externals/WebGL";
import { ShaderMaterial } from "./ShaderMaterial";

const vertexShaderCode: string = `
    precision highp float;
    attribute vec2 position;

    void  main() {
        gl_Position = vec4( position, 0.0, 1.0 );
    }
`;

const fragmentShaderCode: string = `
    precision highp float;

    void main() {
        gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
    }
`;

export class TestTriangle {
    private readonly _gl: WebGLRenderingContext;
    private readonly _shaderMaterial: ShaderMaterial;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
        this._shaderMaterial = new ShaderMaterial(gl);
        this._shaderMaterial.compile(vertexShaderCode, fragmentShaderCode);
    }

    public update(deltaMs: f32): void {}

    public render(): void {
        this._shaderMaterial.activate();

        const buffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);

        const triangle_data: StaticArray<f32> = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
        this._gl.bufferData<f32>(this._gl.ARRAY_BUFFER, triangle_data, this._gl.STATIC_DRAW);

        // attribute | dimensions | data_type | normalize | stride | offset

        //                      mode | first vertex | count
        this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 3);
    }
}
