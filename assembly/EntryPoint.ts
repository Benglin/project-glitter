import { Renderer } from "./components/Renderer";
import { createImageDescriptor, ImageDescriptor } from "./components/Utilities";

export const Uint8ClampedArray_ID = idof<Uint8ClampedArray>();

let renderer: Renderer;

export function initialize(canvasId: string, contextType: string): boolean {
    renderer = new Renderer(canvasId, contextType);
    return true;
}

export function updateFrame(): void {
    renderer.updateFrame();
}

export function renderFrame(): void {
    renderer.renderFrame();
}

export { ImageDescriptor, createImageDescriptor };
