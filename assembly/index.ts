// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
    return a + b;
}

export function joinTwoStrings(a: string, b: string): string {
    return `Joined in WASM: ${a + b}`;
}
