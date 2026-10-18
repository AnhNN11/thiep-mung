import fs from "node:fs";
import path from "node:path";
// Original instrumental miniatures. No samples or third-party recordings.
const rate = 22050,
  seconds = 48;
fs.mkdirSync("public/music", { recursive: true });
const freq = (n) => 440 * 2 ** ((n - 69) / 12);
for (const [name, shift, tone] of [
  ["piano", 0, 0],
  ["dream", -5, 1],
  ["waltz", 7, 2],
]) {
  const pcm = new Float64Array(rate * seconds);
  function note(midi, start, duration, volume) {
    const f = freq(midi + shift);
    for (
      let j = 0;
      j < duration * rate && Math.floor(start * rate) + j < pcm.length;
      j++
    ) {
      const t = j / rate;
      const attack = 1 - Math.exp(-t * (tone === 1 ? 14 : 120));
      const env =
        attack *
        Math.exp(-t * (tone === 1 ? 1.1 : 2.1)) *
        Math.min(1, (duration - t) * 5);
      const sound =
        Math.sin(2 * Math.PI * f * t) +
        0.27 * Math.sin(2 * Math.PI * f * 2.002 * t) * Math.exp(-t * 2) +
        0.09 * Math.sin(2 * Math.PI * f * 3 * t) * Math.exp(-t * 4);
      pcm[Math.floor(start * rate) + j] += sound * env * volume;
    }
  }
  const chords = [
    [48, 55, 60, 64],
    [45, 52, 57, 60],
    [41, 48, 53, 57],
    [43, 50, 55, 59],
  ];
  const melody = [
    [76, 74, 72, 67, 69, 72, 74, 76],
    [76, 79, 76, 72, 71, 69, 67, 64],
    [69, 72, 77, 76, 74, 72, 69, 67],
    [71, 74, 79, 77, 76, 74, 72, 71],
  ];
  for (let bar = 0; bar < 16; bar++) {
    const start = bar * 3,
      chord = chords[bar % 4];
    note(chord[0] - 12, start, 2.9, 0.12);
    for (let beat = 0; beat < 8; beat++)
      note(
        chord[[0, 1, 2, 3, 2, 1, 2, 3][beat]],
        start + beat * 0.375,
        2.1,
        0.075,
      );
    for (let beat = 0; beat < 4; beat++)
      note(
        melody[bar % 4][(beat + Math.floor(bar / 4) * 2) % 8],
        start + beat * 0.75,
        2.2,
        0.12,
      );
  }
  // Soft stereo echo and fade at the loop boundary.
  const bytes = Buffer.alloc(44 + pcm.length * 4);
  bytes.write("RIFF", 0);
  bytes.writeUInt32LE(bytes.length - 8, 4);
  bytes.write("WAVEfmt ", 8);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(2, 22);
  bytes.writeUInt32LE(rate, 24);
  bytes.writeUInt32LE(rate * 4, 28);
  bytes.writeUInt16LE(4, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write("data", 36);
  bytes.writeUInt32LE(pcm.length * 4, 40);
  for (let i = 0; i < pcm.length; i++) {
    const fade = Math.min(1, i / rate / 0.4, (pcm.length - i) / rate / 1.5);
    for (let channel = 0; channel < 2; channel++) {
      const echo = Math.floor(rate * (channel ? 0.29 : 0.23));
      const v =
        (pcm[i] +
          (i > echo ? pcm[i - echo] * 0.3 : 0) +
          (i > echo * 2 ? pcm[i - echo * 2] * 0.13 : 0)) *
        fade;
      bytes.writeInt16LE(
        Math.max(-32767, Math.min(32767, Math.round(v * 27000))),
        44 + i * 4 + channel * 2,
      );
    }
  }
  fs.writeFileSync(path.join("public/music", `${name}.wav`), bytes);
}
console.log("Created 3 original 48-second stereo instrumentals.");
