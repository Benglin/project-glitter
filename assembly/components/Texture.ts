import { WebGLRenderingContext, WebGLTexture } from "../externals/WebGL";
import { Object3D } from "./Object3D";
import { getImageDataUtil } from "./Utilities";

export class Texture extends Object3D {
    private readonly _texture: WebGLTexture;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this._texture = gl.createTexture();
    }

    public load(imageName: string): void {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this._texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;

        const imageData = getImageDataUtil(imageName);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, imageData);
    }

    public activate(texUnitIndex: u32): void {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + texUnitIndex);
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
    }
}
