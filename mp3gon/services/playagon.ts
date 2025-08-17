import { bufferToWav } from './audioProcessor';

/**
 * A Playagon is a time-deformed version of an audio object. The time axis
 * is warped by a mapping function T(t) that maps normalized output time t ∈ [0,1]
 * to a new position along the original signal. This produces a new buffer that
 * plays according to the deformation.
 */
export function timeWarpBuffer(
    buffer: AudioBuffer,
    warp: (t: number) => number
): AudioBuffer {
    const { length, numberOfChannels, sampleRate } = buffer;
    const ctx = new AudioContext();
    const output = ctx.createBuffer(numberOfChannels, length, sampleRate);
    ctx.close();

    for (let ch = 0; ch < numberOfChannels; ch++) {
        const input = buffer.getChannelData(ch);
        const out = output.getChannelData(ch);
        for (let i = 0; i < length; i++) {
            const t = i / (length - 1);
            const srcT = warp(t);
            const srcIndex = Math.min(length - 1, Math.max(0, Math.floor(srcT * (length - 1))));
            out[i] = input[srcIndex];
        }
    }

    return output;
}

/**
 * Play a buffer with a time-warping function.
 */
export async function playWarpedBuffer(
    buffer: AudioBuffer,
    warp: (t: number) => number
): Promise<void> {
    const ctx = new AudioContext();
    const warped = timeWarpBuffer(buffer, warp);
    const src = ctx.createBufferSource();
    src.buffer = warped;
    src.connect(ctx.destination);
    await ctx.resume();
    src.start();
}

/**
 * Utility to create a playable URL for a time-warped buffer.
 */
export function warpedBufferToUrl(
    buffer: AudioBuffer,
    warp: (t: number) => number
): string {
    const warped = timeWarpBuffer(buffer, warp);
    const blob = bufferToWav(warped);
    return URL.createObjectURL(blob);
}
