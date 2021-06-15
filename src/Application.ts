import loader from "@assemblyscript/loader";

import { initASWebGLue } from "./externals/ASWebGLue.js";

export class Application {
    private _exports: any = null;

    public async initialize(): Promise<boolean> {
        if (this._exports) {
            throw new Error("Application.initialize is called twice");
        }

        const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

        const imports: { [key: string]: any } = {
            env: {
                memory: memory,
            },
        };

        initASWebGLue(imports);

        const response = await fetch("/renderer.wasm");
        const wasmInstance = await loader.instantiateStreaming(response, imports);
        this._exports = wasmInstance.exports;

        imports.WebGL.WEBGL_READY = true;
        imports.WebGL.RTTI_BASE = wasmInstance.exports["__rtti_base"];

        this._exports.displayLoop();
        return true;
    }

    public startRenderLoop(): void {
        const thisObject = this;
        function renderFrame(): void {
            thisObject._exports.displayLoop();
            requestAnimationFrame(renderFrame);
        }

        requestAnimationFrame(renderFrame);
    }

    public concat(a: string, b: string): string {
        const { joinTwoStrings, __newString, __getString } = this._exports;

        const ptr_a = __newString(a);
        const ptr_b = __newString(b);
        const ptr_result = joinTwoStrings(ptr_a, ptr_b);
        return __getString(ptr_result);
    }
}
