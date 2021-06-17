import { WebGLRenderingContext } from "../externals/WebGL";
import { BufferAttribute, BufferGeometry } from "./BufferGeometry";
import { Mesh } from "./Mesh";
import { ShaderMaterial } from "./ShaderMaterial";
import { Texture } from "./Texture";

const vertexShaderCode: string = `
    precision highp float;

    uniform vec2 screenSize;

    attribute float angle;
    attribute vec2 offset;
    attribute vec2 texCoord;

    varying highp vec2 vTexCoord;

    void main() {
        float particleSize = 32.0; // Particle size in pixels.
        float radius = 0.5; // In NDC dimension

        vec2 position = vec2(radius * cos(angle), radius * sin(angle));
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

    varying highp vec2 vTexCoord;

    void main() {
        vec4 color = texture2D(uSampler, vTexCoord);
        gl_FragColor = color;
    }
`;

class ParticleAttributes {
    private readonly _particleCount: i32;
    private readonly _angle: StaticArray<f32>; // attribute float angle
    private readonly _offset: StaticArray<f32>; // attribute vec2 offset
    private readonly _texCoord: StaticArray<f32>; // attribute vec2
    private readonly _indices: StaticArray<u16>; // For index buffer.

    constructor(particleCount: i32) {
        this._particleCount = particleCount;

        const vertexCount = particleCount * 4; // 4 vertex per particle.
        this._angle = new StaticArray<f32>(vertexCount);
        this._offset = new StaticArray<f32>(vertexCount * 2);
        this._texCoord = new StaticArray<f32>(vertexCount * 2);
        this._indices = new StaticArray<u16>(particleCount * 6);

        for (let p = 0; p < particleCount; ++p) {
            this._generateParticle(p);
        }
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
    private readonly _geometry: BufferGeometry;
    private readonly _shaderMaterial: ShaderMaterial;
    private readonly _texture: Texture;
    private readonly _triangleMesh: Mesh;
    private readonly _attributes: ParticleAttributes;

    constructor(gl: WebGLRenderingContext) {
        this._shaderMaterial = new ShaderMaterial(gl);
        this._shaderMaterial.compile(vertexShaderCode, fragmentShaderCode);

        const screenWidth = <f32>gl.getDrawingBufferWidth();
        const screenHeight = <f32>gl.getDrawingBufferHeight();

        this._shaderMaterial.activate();
        this._shaderMaterial.setUniform1i("uSampler", 0);
        this._shaderMaterial.setUniform2f("screenSize", screenWidth, screenHeight);

        this._texture = new Texture(gl);
        this._texture.load("test.png");

        this._attributes = new ParticleAttributes(10);

        const angle: StaticArray<f32> = this._attributes.angle;
        const offset = this._attributes.offset;
        const texCoord = this._attributes.texCoord;

        this._geometry = new BufferGeometry(gl);
        this._geometry.setAttribute("angle", new BufferAttribute(angle, 1, false));
        this._geometry.setAttribute("offset", new BufferAttribute(offset, 2, false));
        this._geometry.setAttribute("texCoord", new BufferAttribute(texCoord, 2, false));

        this._geometry.setIndexBuffer(this._attributes.indices);

        this._triangleMesh = new Mesh(gl, this._geometry, this._shaderMaterial);
    }

    public update(deltaMs: f32): void {}

    public render(): void {
        if (this._triangleMesh) {
            this._shaderMaterial.bindTexture(0, "uSampler", this._texture);
            this._triangleMesh.render();
        }
    }
}
