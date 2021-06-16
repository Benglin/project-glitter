import { WebGLBuffer, WebGLRenderingContext } from "../externals/WebGL";
import { Object3D } from "./Object3D";

export class BufferAttribute {
    protected readonly _itemSize: i32;
    protected readonly _normalized: boolean;
    protected readonly _staticArray: StaticArray<f32>;

    /**
     * This class stores data for an attribute (such as vertex positions, face indices,
     * normals, colors, UVs, and any custom attributes ) associated with a BufferGeometry,
     * which allows for more efficient passing of data to the GPU.
     *
     * @param {StaticArray<f32>} array Used to instantiate the buffer. This array should
     * have `itemSize * numVertices` elements, where numVertices is the number of vertices
     * in the associated BufferGeometry.
     * @param {i32} itemSize The number of values of the array that should be associated
     * with a particular vertex. For instance, if this attribute is storing a 3-component
     * vector (such as a position, normal, or color), then itemSize should be 3.
     * @param {boolean} normalized Indicates how the underlying data in the buffer maps
     * to the values in the GLSL shader code.
     */
    constructor(array: StaticArray<f32>, itemSize: i32, normalized: boolean) {
        this._staticArray = array;
        this._itemSize = itemSize;
        this._normalized = normalized;
    }

    get data(): StaticArray<f32> {
        return this._staticArray;
    }

    get itemSize(): i32 {
        return this._itemSize;
    }

    get normalized(): boolean {
        return this._normalized;
    }
}

export class BufferGeometry extends Object3D {
    private _indexBuffer: WebGLBuffer = -1;
    private readonly _buffers: Map<string, WebGLBuffer> = new Map();
    private readonly _attributes: Map<string, BufferAttribute> = new Map();

    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    public get attributes(): string[] {
        return this._attributes.keys();
    }

    public getAttribute(name: string): BufferAttribute | null {
        return this._attributes.has(name) ? this._attributes.get(name) : null;
    }

    public setAttribute(name: string, attribute: BufferAttribute): void {
        this._attributes.set(name, attribute);
    }

    public getBuffer(name: string): WebGLBuffer {
        if (!this._attributes.has(name)) {
            return 0;
        }

        if (!this._buffers.has(name)) {
            const gl = this.gl;

            // TODO: Update 'bufferData' to use Float32Array?
            const staticArray = this._attributes.get(name).data;

            const newBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
            gl.bufferData<f32>(gl.ARRAY_BUFFER, staticArray, gl.STATIC_DRAW);

            this._buffers.set(name, newBuffer);
        }

        return this._buffers.get(name);
    }

    public setIndexBuffer(array: StaticArray<u16>): void {
        const gl = this.gl;
        this._indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
    }

    public getIndexBuffer(): WebGLBuffer {
        return this._indexBuffer;
    }
}
