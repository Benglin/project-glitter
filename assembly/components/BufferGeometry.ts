import { WebGLBuffer, WebGLRenderingContext } from "../externals/WebGL";
import { float32ArrayToStatic32Array } from "./Utilities";

export class BufferAttribute {
    protected readonly _itemSize: i32;
    protected readonly _normalized: boolean;
    protected _typedArray: ArrayBufferView;

    /**
     * This class stores data for an attribute (such as vertex positions, face indices,
     * normals, colors, UVs, and any custom attributes ) associated with a BufferGeometry,
     * which allows for more efficient passing of data to the GPU.
     *
     * @param {ArrayBufferView} array Must be a TypedArray. Used to instantiate the buffer.
     * This array should have `itemSize * numVertices` elements, where numVertices is the
     * number of vertices in the associated BufferGeometry.
     * @param {i32} itemSize The number of values of the array that should be associated
     * with a particular vertex. For instance, if this attribute is storing a 3-component
     * vector (such as a position, normal, or color), then itemSize should be 3.
     * @param {boolean} normalized Indicates how the underlying data in the buffer maps
     * to the values in the GLSL shader code.
     */
    constructor(array: ArrayBufferView, itemSize: i32, normalized: boolean) {
        this._typedArray = array;
        this._itemSize = itemSize;
        this._normalized = normalized;
    }

    get data(): ArrayBufferView {
        return this._typedArray;
    }

    get itemSize(): i32 {
        return this._itemSize;
    }

    get normalized(): boolean {
        return this._normalized;
    }
}

export class Float32BufferAttribute extends BufferAttribute {
    constructor(array: Float32Array, itemSize: i32, normalized: boolean) {
        super(array, itemSize, normalized);
    }
}

export class BufferGeometry {
    private readonly _gl: WebGLRenderingContext;
    private readonly _buffers: Map<string, WebGLBuffer> = new Map();
    private readonly _attributes: Map<string, BufferAttribute> = new Map();

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
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
            const gl = this._gl;
            const data = this._attributes.get(name).data as Float32Array;

            // TODO: Update 'bufferData' to use Float32Array?
            const staticArray = float32ArrayToStatic32Array(data);

            const newBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, newBuffer);
            gl.bufferData<f32>(gl.ARRAY_BUFFER, staticArray, gl.STATIC_DRAW);

            this._buffers.set(name, newBuffer);
        }

        return this._buffers.get(name);
    }
}
