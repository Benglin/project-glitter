import loader from "@assemblyscript/loader";

export class Application {
    private _exports: any = null;

    public async initialize(): Promise<boolean> {
        if (this._exports) {
            throw new Error("Application.initialize is called twice");
        }

        const imports = {
            env: {},
        };

        const response = await fetch("/renderer.wasm");
        const { exports } = await loader.instantiateStreaming(response, imports);
        this._exports = exports;

        return true;
    }

    public concat(a: string, b: string): string {
        const { joinTwoStrings, __newString, __getString } = this._exports;

        const ptr_a = __newString(a);
        const ptr_b = __newString(b);
        const ptr_result = joinTwoStrings(ptr_a, ptr_b);
        return __getString(ptr_result);
    }
}
