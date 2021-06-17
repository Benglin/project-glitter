import { Renderer } from "./components/Renderer";

let renderer: Renderer;

export function initialize(canvasId: string, contextType: string): boolean {
    renderer = new Renderer(canvasId, contextType);
    return true;
}

export function getFrequencyBuffer(): Uint8Array {
    return renderer.getFrequencyBuffer();
}

export function updateFrame(): void {
    renderer.updateFrame();
}

export function renderFrame(): void {
    renderer.renderFrame();
}
