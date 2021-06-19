import { WebGLRenderingContext } from "../externals/WebGL";
import { BufferAttribute, BufferGeometry } from "./BufferGeometry";
import { Mesh } from "./Mesh";
import { ShaderMaterial } from "./ShaderMaterial";
import { Texture } from "./Texture";

const vertexShaderCode: string = `
    precision highp float;

    uniform vec2 screenSize;
    uniform float normalizedSecond;
    uniform float frequencies[128];

    attribute float serialNumber;
    attribute float angle;
    attribute vec2 offset;
    attribute vec2 texCoord;

    varying vec3 vColor;
    varying highp vec2 vTexCoord;

    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main()
    {
        float fullCircle = 2.0 * 3.14159265;

        vec3 hsv = vec3((serialNumber / 128.0) * fullCircle, 1.0, 1.0);
        vColor = hsv2rgb(hsv);

        float index = mod(serialNumber, 128.0);
        float frequency = frequencies[int(index)];
        float particleSize = 16.0 + (24.0 * frequency); // Particle size in pixels.

        float minSize = (screenSize.x < screenSize.y ? screenSize.x : screenSize.y) * 0.95;
        float currSize = minSize * (0.5 + (frequency * 0.5));

        float xRadius = currSize / screenSize.x;
        float yRadius = currSize / screenSize.y;

        float globalOffset = -1.0 * normalizedSecond * fullCircle * (22.5 / 360.0);
        float angleOffset = frequency * (fullCircle / 360.0) * 90.0;
        float angle2 = angle + angleOffset + globalOffset;

        vec2 position = vec2(xRadius * cos(angle2), yRadius * sin(angle2));
        float xOffset = (particleSize * 0.5) / screenSize.x;
        float yOffset = (particleSize * 0.5) / screenSize.y;
        vec2 delta = vec2(offset.x * xOffset, offset.y * yOffset);

        vTexCoord = texCoord;
        gl_Position = vec4(position + delta, 0.0, 1.0);
    }
`;

const fragmentShaderCode: string = `
    precision highp float;

    uniform sampler2D uSampler;

    varying vec3 vColor;
    varying highp vec2 vTexCoord;

    void main() {
        vec4 color = texture2D(uSampler, vTexCoord);
        gl_FragColor = color * vec4(vColor, 1.0);
    }
`;

class ParticleAttributes {
    private readonly _particleCount: i32;
    private readonly _serialNumber: StaticArray<f32>; // attribute float serialNumber
    private readonly _angle: StaticArray<f32>; // attribute float angle
    private readonly _offset: StaticArray<f32>; // attribute vec2 offset
    private readonly _texCoord: StaticArray<f32>; // attribute vec2
    private readonly _indices: StaticArray<u16>; // For index buffer.

    constructor(particleCount: i32) {
        this._particleCount = particleCount;

        const vertexCount = particleCount * 4; // 4 vertex per particle.
        this._serialNumber = new StaticArray<f32>(vertexCount);
        this._angle = new StaticArray<f32>(vertexCount);
        this._offset = new StaticArray<f32>(vertexCount * 2);
        this._texCoord = new StaticArray<f32>(vertexCount * 2);
        this._indices = new StaticArray<u16>(particleCount * 6);

        for (let p = 0; p < particleCount; ++p) {
            this._generateParticle(p);
        }
    }

    public get serialNumber(): StaticArray<f32> {
        return this._serialNumber;
    }

    public get angle(): StaticArray<f32> {
        return this._angle;
    }

    public get offset(): StaticArray<f32> {
        return this._offset;
    }

    public get texCoord(): StaticArray<f32> {
        return this._texCoord;
    }

    public get indices(): StaticArray<u16> {
        return this._indices;
    }

    private _generateParticle(particleIndex: i32): void {
        const baseIndex = particleIndex * 4;

        // Things that are common to all four corners of a particle.
        const f = particleIndex * Math.PI * 2.0;
        const angle = <f32>(f / this._particleCount);
        for (let i = 0; i < 4; ++i) {
            this._angle[baseIndex + i] = angle;
            this._serialNumber[baseIndex + i] = <f32>particleIndex;
        }

        // 6 indices per particle (2 triangles per quad).
        this._indices[particleIndex * 6 + 0] = <u16>(baseIndex + 0);
        this._indices[particleIndex * 6 + 1] = <u16>(baseIndex + 1);
        this._indices[particleIndex * 6 + 2] = <u16>(baseIndex + 2);
        this._indices[particleIndex * 6 + 3] = <u16>(baseIndex + 2);
        this._indices[particleIndex * 6 + 4] = <u16>(baseIndex + 1);
        this._indices[particleIndex * 6 + 5] = <u16>(baseIndex + 3);

        this._generateQuad(particleIndex);
    }

    private _generateQuad(particleIndex: i32): void {
        const baseIndex = particleIndex * 4 * 2;

        this._offset[baseIndex + 0] = -1.0; // Top left corner.
        this._offset[baseIndex + 1] = 1.0;
        this._texCoord[baseIndex + 0] = 0.0;
        this._texCoord[baseIndex + 1] = 0.0;

        this._offset[baseIndex + 2] = -1.0; // Bottom left corner.
        this._offset[baseIndex + 3] = -1.0;
        this._texCoord[baseIndex + 2] = 0.0;
        this._texCoord[baseIndex + 3] = 1.0;

        this._offset[baseIndex + 4] = 1.0; // Top right corner.
        this._offset[baseIndex + 5] = 1.0;
        this._texCoord[baseIndex + 4] = 1.0;
        this._texCoord[baseIndex + 5] = 0.0;

        this._offset[baseIndex + 6] = 1.0; // Bottom right corner.
        this._offset[baseIndex + 7] = -1.0;
        this._texCoord[baseIndex + 6] = 1.0;
        this._texCoord[baseIndex + 7] = 1.0;
    }
}

export class Particles {
    private _elapsedMs: f32 = 0.0;
    private readonly _geometry: BufferGeometry;
    private readonly _shaderMaterial: ShaderMaterial;
    private readonly _texture: Texture;
    private readonly _triangleMesh: Mesh;
    private readonly _attributes: ParticleAttributes;

    // Input frequency data.
    private readonly _frequencyUint8: Uint8Array = new Uint8Array(128);
    private readonly _frequencyFloat32: StaticArray<f32> = new StaticArray<f32>(128);

    constructor(gl: WebGLRenderingContext) {
        this._shaderMaterial = new ShaderMaterial(gl);
        this._shaderMaterial.compile(vertexShaderCode, fragmentShaderCode);

        const screenWidth = <f32>gl.getDrawingBufferWidth();
        const screenHeight = <f32>gl.getDrawingBufferHeight();

        this._shaderMaterial.activate();
        this._shaderMaterial.setUniform1i("uSampler", 0);
        this._shaderMaterial.setUniform2f("screenSize", screenWidth, screenHeight);
        this._shaderMaterial.setUniform1f("normalizedSecond", 0.0);

        this._texture = new Texture(gl);
        this._texture.load("circle.png");

        this._attributes = new ParticleAttributes(2048);

        const serialNumber = this._attributes.serialNumber;
        const angle = this._attributes.angle;
        const offset = this._attributes.offset;
        const texCoord = this._attributes.texCoord;

        this._geometry = new BufferGeometry(gl);
        this._geometry.setAttribute("serialNumber", new BufferAttribute(serialNumber, 1, false));
        this._geometry.setAttribute("angle", new BufferAttribute(angle, 1, false));
        this._geometry.setAttribute("offset", new BufferAttribute(offset, 2, false));
        this._geometry.setAttribute("texCoord", new BufferAttribute(texCoord, 2, false));

        this._geometry.setIndexBuffer(this._attributes.indices);

        this._triangleMesh = new Mesh(gl, this._geometry, this._shaderMaterial);
    }

    public getFrequencyBuffer(): Uint8Array {
        return this._frequencyUint8;
    }

    public update(deltaMs: f32): void {
        for (let i = 0; i < this._frequencyUint8.length; ++i) {
            const f = <f32>this._frequencyUint8[i];
            this._frequencyFloat32[i] = <f32>(f / 255.0);
        }

        this._elapsedMs += deltaMs;
        while (this._elapsedMs > 1000.0) {
            this._elapsedMs -= 1000.0;
        }

        const normalized = this._elapsedMs / 1000.0;
        this._shaderMaterial.setUniform1f("normalizedSecond", normalized);
    }

    public render(): void {
        if (this._triangleMesh) {
            this._shaderMaterial.bindTexture(0, "uSampler", this._texture);
            this._shaderMaterial.setUniform1fv("frequencies", this._frequencyFloat32);
            this._triangleMesh.render();
        }
    }
}
