import { WebGLRenderingContext } from "../externals/WebGL";
import { BufferAttribute, BufferGeometry } from "./BufferGeometry";
import { Object3D } from "./Object3D";
import { Mesh } from "./Mesh";
import { ShaderMaterial } from "./ShaderMaterial";
import { float32ArrayFromArray } from "./Utilities";

const vertexShaderCode: string = `
    precision highp float;
    attribute vec2 position;
    attribute vec3 color;
    varying vec3 vColor;

    void  main() {
        vColor = color;
        gl_Position = vec4( position, 0.0, 1.0 );
    }
`;

const fragmentShaderCode: string = `
    precision highp float;
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;

export class TestTriangle {
    private readonly _geometry: BufferGeometry;
    private readonly _shaderMaterial: ShaderMaterial;
    private readonly _triangleMesh: Mesh;

    constructor(gl: WebGLRenderingContext) {
        this._shaderMaterial = new ShaderMaterial(gl);
        this._shaderMaterial.compile(vertexShaderCode, fragmentShaderCode);

        const pos = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
        const positions = float32ArrayFromArray(pos);

        const clrs = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
        const colors = float32ArrayFromArray(clrs);

        this._geometry = new BufferGeometry(gl);
        this._geometry.setAttribute("position", new BufferAttribute(positions, 2, false));
        this._geometry.setAttribute("color", new BufferAttribute(colors, 3, false));

        this._triangleMesh = new Mesh(gl, this._geometry, this._shaderMaterial);
    }

    public update(deltaMs: f32): void {}

    public render(): void {
        if (this._triangleMesh) {
            this._triangleMesh.render();
        }
    }
}
