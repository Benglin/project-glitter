import { Object3D } from "./Object3D";
import { BufferGeometry } from "./BufferGeometry";
import { ShaderMaterial } from "./ShaderMaterial";
import { WebGLRenderingContext } from "../externals/WebGL";

export class Mesh extends Object3D {
    private readonly _geometry: BufferGeometry;
    private readonly _material: ShaderMaterial;

    constructor(gl: WebGLRenderingContext, geometry: BufferGeometry, material: ShaderMaterial) {
        super(gl);

        this._geometry = geometry;
        this._material = material;
    }

    render(): void {
        const gl = this.gl;
        const geometry = this._geometry;
        const material = this._material;
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
            const loc = material.getAttribLocation(attribName);

            gl.vertexAttribPointer(loc, itemSize, gl.FLOAT, +normalized, stride, offset);
            gl.enableVertexAttribArray(loc);
        }

        this._material.activate();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    }
}
