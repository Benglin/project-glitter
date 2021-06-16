import loader from "@assemblyscript/loader";
import { generateGlueCode, NamedImageData, patchFromLoaderApi } from "./externals/GlueCode";

export class Application {
    private _exports: any = null;

    public async initialize(): Promise<boolean> {
        if (this._exports) {
            throw new Error("Application.initialize is called twice");
        }

        // A little shortcut
        const namedImageData = await this._preloadResources("test.png");

        const canvas = document.getElementById("canvas-3d") as HTMLCanvasElement;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

        const imports: { [key: string]: any } = {
            env: {
                memory: memory,
            },
            images: namedImageData,
        };

        generateGlueCode(imports as any);

        const response = await fetch("/renderer.wasm");
        const wasmInstance = await loader.instantiateStreaming(response, imports);
        this._exports = wasmInstance.exports;

        patchFromLoaderApi(imports as any, this._exports);
        const { __newString } = this._exports;

        const canvasId = __newString("canvas-3d");
        const contextType = __newString("webgl2");
        this._exports.initialize(canvasId, contextType);
        return true;
    }

    public startRenderLoop(): void {
        const thisObject = this;
        function renderFrame(): void {
            thisObject._exports.updateFrame();
            thisObject._exports.renderFrame();
            requestAnimationFrame(renderFrame);
        }

        requestAnimationFrame(renderFrame);
    }

    private async _preloadResources(resourceName: string): Promise<NamedImageData> {
        return new Promise<NamedImageData>((resolve, reject) => {
            const image = new Image();

            image.onload = function (event: Event) {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d") as CanvasRenderingContext2D;
                context.drawImage(image, 0, 0);

                const data = context.getImageData(0, 0, image.width, image.height);

                const resources: NamedImageData = {};
                resources[resourceName] = data;
                resolve(resources);
            };

            image.onerror = function (event: Event | string) {
                reject(event ? event.toString() : "");
            };

            image.src = `/${resourceName}`;
        });
    }
}
