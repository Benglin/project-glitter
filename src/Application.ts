import loader from "@assemblyscript/loader";
import { MediaController } from "./components/MediaController";
import { generateGlueCode, NamedImageData, patchFromLoaderApi } from "./externals/GlueCode";

interface OnFrameRateUpdatedFunc {
    (fps: number): void;
}

export class Application extends EventTarget {
    public static MediaReady = "media-ready";

    private _exports: any = null;
    private _eventRegistered: boolean = false;
    private _mediaController: MediaController | null = null;

    public async initialize(): Promise<boolean> {
        if (this._exports) {
            throw new Error("Application.initialize is called twice");
        }

        this._mediaController = new MediaController("audio-source");
        this._mediaController.loadMedia(this._resolveFilePath("Bajan-Canadian.mp3"));
        this._mediaController.addEventListener(MediaController.MediaReady, () => {
            if (!this._eventRegistered) {
                this._eventRegistered = true;

                document.addEventListener("click", () => {
                    if (this._mediaController) {
                        this._mediaController.connect();
                        this._mediaController.play();
                    }
                });
            }

            this.dispatchEvent(new Event(Application.MediaReady));
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

        const response = await fetch(this._resolveFilePath("renderer.wasm"));
        const wasmInstance = await loader.instantiateStreaming(response, imports);
        this._exports = wasmInstance.exports;

        patchFromLoaderApi(imports as any, this._exports);
        const { __newString } = this._exports;

        const canvasId = __newString("canvas-3d");
        const contextType = __newString("webgl2");
        this._exports.initialize(canvasId, contextType);
        return true;
    }

    public startRenderLoop(onFrameRateUpdated: OnFrameRateUpdatedFunc): void {
        const { updateFrame, renderFrame, getFrequencyBuffer, __getArrayView } = this._exports;

        let framesRendered = 0.0;
        let startMillisecond = Date.now();

        const thisObject = this;
        function renderFrameCore(): void {
            const bufferId = getFrequencyBuffer();
            const buffer = __getArrayView(bufferId) as Uint8Array;

            if (thisObject._mediaController) {
                if (thisObject._mediaController.getByteFrequencyData(buffer)) {
                    updateFrame();
                }
            }

            framesRendered++;
            const currMillisecond = Date.now();
            const elapsed = currMillisecond - startMillisecond;
            if (elapsed >= 1000) {
                startMillisecond = currMillisecond;

                onFrameRateUpdated((1000.0 * framesRendered) / elapsed);
                framesRendered = 0;
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

            image.src = this._resolveFilePath(resourceName);
        });
    }

    private _resolveFilePath(path: string): string {
        return `${window.location.pathname}/${path}`;
    }
}
