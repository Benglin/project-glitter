/**
 * @author Rick Battagline / https://embed.com/wasm
 */

import {
    WebGLRenderingContext,
    WebGLShader,
    WebGLProgram,
    WebGLBuffer,
    GLint,
} from "./externals/WebGL";

const VERTEX_SHADER_CODE: string = /*glsl*/ `
   precision highp float;
 
   attribute vec2 position;
 
   void main() {
     gl_Position = vec4( position, 0.0, 1.0 );
   }
 `;

const FRAGMENT_SHADER_CODE: string = /*glsl*/ `
   precision highp float;
 
   void main() {
    gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
   }
 `;

let gl: WebGLRenderingContext;
let triangle_data: StaticArray<f32> = [];
let position_al: GLint;

export function initializeRenderer(): void {
    // initialize webgl
    gl = new WebGLRenderingContext("canvas-3d", "webgl2");

    let vertex_shader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex_shader, VERTEX_SHADER_CODE);
    gl.compileShader(vertex_shader);

    let fragment_shader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment_shader, FRAGMENT_SHADER_CODE);
    gl.compileShader(fragment_shader);

    let program: WebGLProgram = gl.createProgram();

    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);

    gl.linkProgram(program);

    gl.useProgram(program);

    let buffer: WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    let position_al: GLint = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position_al);

    triangle_data = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
}

export function displayLoop(): void {
    if (gl) {
        //             R    G    B    A
        gl.clearColor(0.392, 0.584, 0.929, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bufferData<f32>(gl.ARRAY_BUFFER, triangle_data, gl.STATIC_DRAW);

        //                      attribute | dimensions | data_type | normalize | stride | offset
        gl.vertexAttribPointer(position_al, 2, gl.FLOAT, +false, 0, 0);

        //                      mode | first vertex | count
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    }
}
