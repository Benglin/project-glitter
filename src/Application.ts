import loader from "@assemblyscript/loader";
import { MediaController } from "./components/MediaController";
import { generateGlueCode, NamedImageData, patchFromLoaderApi } from "./externals/GlueCode";

export class Application {
    private _exports: any = null;
    private _mediaController: MediaController | null = null;

    public async initialize(): Promise<boolean> {
        if (this._exports) {
            throw new Error("Application.initialize is called twice");
        }

        this._mediaController = new MediaController("audio-source");

        document.addEventListener("click", () => {
            if (this._mediaController) {
                this._mediaController.connect();
                this._mediaController.play();
            }
        });

        // A little shortcut
        const namedImageData = await this._preloadResources("circle.png");

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

        const response = await fetch(this._resolvePathFromRoot("renderer.wasm"));
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
        const { updateFrame, renderFrame, getFrequencyBuffer, __getArrayView } = this._exports;

        const thisObject = this;
        function renderFrameCore(): void {
            const bufferId = getFrequencyBuffer();
            const buffer = __getArrayView(bufferId) as Uint8Array;

            if (thisObject._mediaController) {
                if (thisObject._mediaController.getByteFrequencyData(buffer)) {
                    updateFrame();
                }
            }

            renderFrame();
            requestAnimationFrame(renderFrameCore);
        }

        requestAnimationFrame(renderFrameCore);
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

            image.src = this._resolvePathFromRoot(resourceName);
        });
    }

    private _resolvePathFromRoot(path: string): string {
        return `${window.location.pathname}/${path}`;
    }
}
