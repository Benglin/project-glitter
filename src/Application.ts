import loader from "@assemblyscript/loader";
import { generateGlueCode, patchFromLoaderApi } from "./externals/GlueCode";

export class Application {
    private _exports: any = null;

    public async initialize(): Promise<boolean> {
        if (this._exports) {
            throw new Error("Application.initialize is called twice");
        }

        const canvas = document.getElementById("canvas-3d") as HTMLCanvasElement;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

        const imports: { [key: string]: any } = {
            env: {
                memory: memory,
            },
        };

        generateGlueCode(imports as any);

        const response = await fetch("/renderer.wasm");
        const wasmInstance = await loader.instantiateStreaming(response, imports);
        this._exports = wasmInstance.exports;

        patchFromLoaderApi(imports as any, this._exports);

        this._exports.initializeRenderer();
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
