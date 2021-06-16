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
