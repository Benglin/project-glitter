import { WebGLRenderingContext } from "../externals/WebGL";
import { BufferAttribute, BufferGeometry } from "./BufferGeometry";
import { ShaderMaterial } from "./ShaderMaterial";
import { float32ArrayFromArray } from "./Utilities";

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
    private readonly _geometry: BufferGeometry;
    private readonly _shaderMaterial: ShaderMaterial;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;

        this._shaderMaterial = new ShaderMaterial(gl);
        this._shaderMaterial.compile(vertexShaderCode, fragmentShaderCode);

        const source = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
        const positions = float32ArrayFromArray(source);

        this._geometry = new BufferGeometry(this._gl);
        this._geometry.setAttribute("position", new BufferAttribute(positions, 2, false));
    }

    public update(deltaMs: f32): void {}

    public render(): void {
        this._todo_TurnThisIntoMeshRender();
    }

    private _todo_TurnThisIntoMeshRender(): void {
        const gl = this._gl;
        const geometry = this._geometry;
        const material = this._shaderMaterial;
        const attributes = geometry.attributes;

        for (let i = 0; i < attributes.length; i++) {
            const attribName = attributes[i];
            const attribute = geometry.getAttribute(attribName);
            if (!attribute) return;

            const buffer = geometry.getBuffer(attribName);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            const itemSize = attribute.itemSize;
            const normalized = attribute.normalized;
            const stride = 0;
            const offset = 0;
            const loc = material.getAttributeLocation(attribName);

            gl.vertexAttribPointer(loc, itemSize, gl.FLOAT, +normalized, stride, offset);
            gl.enableVertexAttribArray(loc);
        }

        this._shaderMaterial.activate();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    }
}
