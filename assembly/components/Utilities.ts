export class ImageDescriptor {
    private readonly _width: i32;
    private readonly _height: i32;
    private _data: Uint8ClampedArray;

    constructor(width: i32, height: i32) {
        this._width = width;
        this._height = height;
        this._data = new Uint8ClampedArray(1);
    }

    set data(data: Uint8ClampedArray) {
        this._data = data;
    }

    get data(): Uint8ClampedArray {
        return this._data;
    }
}

export function createImageDescriptor(width: i32, height: i32): ImageDescriptor {
    return new ImageDescriptor(width, height);
}

export declare function getImageDescriptor(imageName: string): ImageDescriptor;

export function float32ArrayToStatic32Array(f: Float32Array): StaticArray<f32> {
    const s = new StaticArray<f32>(f.length);
    {
        for (let i = 0; i < f.length; ++i) {
            s[i] = f[i];
        }
    }
    return s;
}

export function float32ArrayFromArray(a: f64[]): Float32Array {
    const s = new Float32Array(a.length);
    {
        for (let i = 0; i < a.length; ++i) {
            s[i] = <f32>a[i];
        }
    }
    return s;
}

export function getImageDescriptorCore(imageName: string): ImageDescriptor {
    return getImageDescriptor(imageName);
}
