import { Application } from "../Application";

interface ImportObject {
    WebGL: {
        contextArray: WebGLRenderingContext[];
        textureArray: any[];
        imageArray: any[];
        programArray: WebGLProgram[];
        shaderArray: WebGLShader[];
        bufferArray: WebGLBuffer[];
        frameBufferArray: any[];
        renderBufferArray: any[];
        uniformLocationArray: WebGLUniformLocation[];
        vaoArray: any[];

        createContextFromCanvas: (canvasId: number, contextType: number) => number;
        createShader: (ctx: number, type: number) => number;
        shaderSource: (ctx: number, shader: number, source: number) => void;
        compileShader: (ctx: number, shader: number) => void;
        createProgram: (ctx: number) => number;
        attachShader: (ctx: number, program: number, shader: number) => void;
        linkProgram: (ctx: number, program: number) => void;
        getProgramParameter: (ctx: number, program: number, paramName: number) => number;
        getProgramInfoLog: (ctx: number, program: number) => number;
        useProgram: (ctx: number, program: number) => void;
        createBuffer: (ctx: number) => number;
        bindBuffer: (ctx: number, target: number, buffer: number) => void;
        getAttribLocation: (ctx: number, program: number, name: number) => number;
        enableVertexAttribArray: (ctx: number, index: number) => void;
        clear: (ctx: number, mask: number) => void;
        clearColor: (ctx: number, r: number, g: number, b: number, a: number) => void;

        viewport: (
            ctx: number,
            indx: number,
            x: number,
            y: number,
            width: number,
            height: number
        ) => void;

        vertexAttribPointer: (
            ctx: number,
            indx: number,
            size: number,
            typ: number,
            normalized: number,
            stride: number,
            offset: number
        ) => void;

        drawArrays: (ctx: number, mode: number, first: number, count: number) => void;

        // To be patched in from loader after module's instantiated.
        __getString: (ptr: number) => string;
        __getArrayView: (ptr: number) => any; // Any 'TypedArray'

        // Templated function definitions.
        [key: string]: any;
    };

    Utilities: {
        getImageDescriptor: (imageId: number) => number;
    };

    app: Application;
    [key: string]: any;
}

interface ExportObject {
    [key: string]: any;
}

export function generateGlueCode(importObject: ImportObject): void {
    importObject.WebGL = importObject.WebGL || {};
    importObject.Utilities = importObject.Utilities || {};

    const WebGL = importObject.WebGL;
    const Utilities = importObject.Utilities;

    WebGL.contextArray = [];
    WebGL.textureArray = [];
    WebGL.imageArray = [];
    WebGL.programArray = [];
    WebGL.shaderArray = [];
    WebGL.bufferArray = [];
    WebGL.frameBufferArray = [];
    WebGL.renderBufferArray = [];
    WebGL.uniformLocationArray = [];
    WebGL.vaoArray = [];

    WebGL.createContextFromCanvas = function (canvasId: number, contextType: number): number {
        const canvasName = WebGL.__getString(canvasId);
        const element = document.getElementById(canvasName);
        if (!element) throw new Error(`Invalid canvas id: ${canvasName}`);

        const canvas = element as HTMLCanvasElement;

        const gl = canvas.getContext(WebGL.__getString(contextType));
        let id = WebGL.contextArray.findIndex((element) => element == null);

        if (id === -1) {
            id = WebGL.contextArray.length;
            WebGL.contextArray.push(gl as WebGLRenderingContext);
        } else {
            WebGL.contextArray[id] = gl as WebGLRenderingContext;
        }

        return id;
    };

    WebGL.createShader = function (ctx: number, type: number): number {
        let id = WebGL.shaderArray.findIndex((element) => element == null);
        let shader = WebGL.contextArray[ctx].createShader(type);

        if (id === -1) {
            id = WebGL.shaderArray.length;
            WebGL.shaderArray.push(shader as WebGLShader);
        } else {
            WebGL.shaderArray[id] = shader as WebGLShader;
        }
        return id;
    };

    WebGL.shaderSource = function (ctx: number, shader: number, source: number): void {
        WebGL.contextArray[ctx].shaderSource(WebGL.shaderArray[shader], WebGL.__getString(source));
    };

    WebGL.compileShader = function (ctx: number, shader: number): void {
        WebGL.contextArray[ctx].compileShader(WebGL.shaderArray[shader]);
        const compilationLog = WebGL.contextArray[ctx].getShaderInfoLog(WebGL.shaderArray[shader]);
        console.log(`compileShader: ${compilationLog}`);
    };

    WebGL.createProgram = function (ctx: number): number {
        let id = WebGL.programArray.findIndex((element) => element == null);
        let program = WebGL.contextArray[ctx].createProgram();

        if (id === -1) {
            id = WebGL.programArray.length;
            WebGL.programArray.push(program as WebGLProgram);
        } else {
            WebGL.programArray[id] = program as WebGLProgram;
        }

        return id;
    };

    WebGL.attachShader = function (ctx: number, program: number, shader: number): void {
        WebGL.contextArray[ctx].attachShader(
            WebGL.programArray[program],
            WebGL.shaderArray[shader]
        );
    };

    WebGL.linkProgram = function (ctx: number, program: number): void {
        const context = WebGL.contextArray[ctx];
        const prog = WebGL.programArray[program];
        context.linkProgram(prog);

        if (!context.getProgramParameter(prog, context.LINK_STATUS)) {
            console.log(context.getProgramInfoLog(prog));
        }
    };

    WebGL.getProgramParameter = function (ctx: number, program: number, paramName: number): number {
        const context = WebGL.contextArray[ctx];
        const prog = WebGL.programArray[program];
        return context.getProgramParameter(prog, paramName);
    };

    WebGL.getProgramInfoLog = function (ctx: number, program: number): number {
        const context = WebGL.contextArray[ctx];
        const prog = WebGL.programArray[program];

        const message = context.getProgramInfoLog(prog);
        return this.__newString(message);
    };

    WebGL.useProgram = function (ctx: number, program: number): void {
        WebGL.contextArray[ctx].useProgram(WebGL.programArray[program]);
    };

    WebGL.createBuffer = function (ctx: number): number {
        let id = WebGL.bufferArray.findIndex((element) => element == null);
        let buffer = WebGL.contextArray[ctx].createBuffer();

        if (id === -1) {
            id = WebGL.bufferArray.length;
            WebGL.bufferArray.push(buffer as WebGLBuffer);
        } else {
            WebGL.bufferArray[id] = buffer as WebGLBuffer;
        }

        return id;
    };

    WebGL.bindBuffer = function (ctx: number, target: number, buffer: number): void {
        WebGL.contextArray[ctx].bindBuffer(target, WebGL.bufferArray[buffer]);
    };

    WebGL.getAttribLocation = function (ctx: number, program: number, name: number): number {
        return WebGL.contextArray[ctx].getAttribLocation(
            WebGL.programArray[program],
            WebGL.__getString(name)
        );
    };

    WebGL.enableVertexAttribArray = function (ctx: number, index: number): void {
        WebGL.contextArray[ctx].enableVertexAttribArray(index);
    };

    WebGL.getUniformLocation = function (ctx: number, program: number, name: number): number {
        const context = WebGL.contextArray[ctx];
        const prog = WebGL.programArray[program];

        let id = WebGL.uniformLocationArray.findIndex((element) => element == null);
        let loc = context.getUniformLocation(prog, WebGL.__getString(name));

        if (id === -1) {
            id = WebGL.uniformLocationArray.length;
            WebGL.uniformLocationArray.push(loc as WebGLUniformLocation);
        } else {
            WebGL.uniformLocationArray[id] = loc as WebGLUniformLocation;
        }

        return id;
    };

    WebGL.uniform1f = function (ctx: number, loc: number, value: number): void {
        const location = WebGL.uniformLocationArray[loc];
        WebGL.contextArray[ctx].uniform1f(location, value);
    };

    // Clears the color, depth and stencil buffers
    WebGL.clear = function (ctx: number, mask: number): void {
        WebGL.contextArray[ctx].clear(mask);
    };

    // Specify the color fill a cleared color buffer with
    WebGL.clearColor = function (ctx: number, r: number, g: number, b: number, a: number): void {
        WebGL.contextArray[ctx].clearColor(r, g, b, a);
    };

    WebGL.viewport = function (
        ctx: number,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        WebGL.contextArray[ctx].viewport(x, y, width, height);
    };

    const bufferdata = function (ctx: number, target: number, data: number, usage: number): void {
        WebGL.contextArray[ctx].bufferData(target, WebGL.__getArrayView(data), usage);
    };

    WebGL["bufferData<f32>"] = bufferdata;
    WebGL["bufferData<f64>"] = bufferdata;
    WebGL["bufferData<i32>"] = bufferdata;

    WebGL.vertexAttribPointer = function (
        ctx: number,
        indx: number,
        size: number,
        typ: number,
        normalized: number,
        stride: number,
        offset: number
    ): void {
        WebGL.contextArray[ctx].vertexAttribPointer(indx, size, typ, !!normalized, stride, offset);
    };

    WebGL.drawArrays = function (ctx: number, mode: number, first: number, count: number): void {
        WebGL.contextArray[ctx].drawArrays(mode, first, count);
    };

    Utilities.getImageDescriptor = function (imageId: number): number {
        return importObject.app.getImageDescriptor(imageId);
    };
}

export function patchFromLoaderApi(importObject: ImportObject, exportObject: ExportObject): void {
    Object.entries(exportObject).forEach(([key, value]) => {
        if (key.startsWith("__") && typeof value === "function") {
            importObject.WebGL[key] = value;
        }
    });
}
