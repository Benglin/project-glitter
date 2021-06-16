import loader from "@assemblyscript/loader";
import { generateGlueCode, patchFromLoaderApi } from "./externals/GlueCode";

interface ImageDescriptor {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

export class Application {
    private _exports: any = null;
    private _resources: { [key: string]: ImageDescriptor } = {};

    public async initialize(): Promise<boolean> {
        if (this._exports) {
            throw new Error("Application.initialize is called twice");
        }

        await this._preloadResources("circle.svg"); // A little shortcut

        const canvas = document.getElementById("canvas-3d") as HTMLCanvasElement;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const memory = new WebAssembly.Memory({ initial: 100 }); // linear memory

        const imports: { [key: string]: any } = {
            app: this,
            env: {
                memory: memory,
            },
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

    public getImageDescriptor(imageId: number): number {
        const {
            __getString,
            __newArray,
            createImageDescriptor,
            ImageDescriptor,
            Uint8ClampedArray_ID,
        } = this._exports;

        const sourceUrl = __getString(imageId);
        const desc = this._resources[sourceUrl];

        if (!desc) {
            throw new Error(`Resource not found: ${sourceUrl}`);
        }

        const ptr = createImageDescriptor(desc.width, desc.height);
        const imageData = ImageDescriptor.wrap(ptr);
        imageData.data = __newArray(Uint8ClampedArray_ID, desc.data);

        return ptr;
    }

    private async _preloadResources(resourceName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const image = new Image();

            const thisObject = this;
            image.onload = function (event: Event) {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d") as CanvasRenderingContext2D;
                context.drawImage(image, 0, 0);

                const data = context.getImageData(0, 0, image.width, image.height);

                thisObject._resources[resourceName] = {
                    width: data.width,
                    height: data.height,
                    data: data.data,
                };

                resolve();
            };

            image.onerror = function (event: Event | string) {
                reject(event ? event.toString() : "");
            };

            image.src = `/${resourceName}`;
        });
    }
}
