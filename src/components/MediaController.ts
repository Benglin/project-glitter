export class MediaController extends EventTarget {
    public static MediaReady = "media-ready";

    private _playing: boolean = false;
    private readonly _audioElementId: string;

    private _analyserNode: AnalyserNode | null = null;
    private _audioContext: AudioContext | null = null;

    constructor(audioElementId: string) {
        super();

        this._audioElementId = audioElementId;
        const e = document.getElementById(this._audioElementId);
        const audioElement = e as HTMLAudioElement;

        const thisObject = this;
        audioElement.addEventListener("canplaythrough", (event: Event) => {
            // Notify all listeners that the media is ready for playback.
            thisObject.dispatchEvent(new Event(MediaController.MediaReady));
        });
    }

    public loadMedia(mediaUrl: string): void {
        const e = document.getElementById(this._audioElementId);
        const audioElement = e as HTMLAudioElement;
        audioElement.src = mediaUrl;
        audioElement.load();
    }

    public connect(): void {
        if (this._audioContext) {
            return; // Already connected.
        }

        this._audioContext = new AudioContext();

        const e = document.getElementById(this._audioElementId);
        const audioElement = e as HTMLAudioElement;
        const track = this._audioContext.createMediaElementSource(audioElement);

        this._analyserNode = this._audioContext.createAnalyser();
        this._analyserNode.fftSize = 512;
        track.connect(this._analyserNode);
        this._analyserNode.connect(this._audioContext.destination);
    }

    public play(): void {
        const e = document.getElementById(this._audioElementId);
        const audioElement = e as HTMLAudioElement;

        if (!this._playing) {
            audioElement.play();
            this._playing = true;
        }
    }

    public getByteFrequencyData(buffer: Uint8Array): boolean {
        if (!this._analyserNode) {
            return false;
        }

        this._analyserNode.getByteFrequencyData(buffer);
        return true;
    }
}
