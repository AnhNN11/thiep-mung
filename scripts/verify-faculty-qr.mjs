import sharp from "sharp";
import jsQR from "jsqr";
import fs from "node:fs/promises";
const folder = "public/dedications/faculty-20-10";
const expected = "https://thiep-mung-ebon.vercel.app/20-10";
for (const file of [
  "ma-qr-thiep-20-10.png",
  "bang-qr-20-10.png",
  "bang-qr-20-10-chibi.png",
]) {
  const { data, info } = await sharp(`${folder}/${file}`)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  if (decoded?.data !== expected)
    throw Error(`QR did not decode to expected URL: ${file}`);
  console.log(`${file}: decoded ${decoded.data}`);
  if (file.includes("chibi")) {
    for (const width of [800, 400]) {
      const resized = await sharp(`${folder}/${file}`)
        .resize({ width })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const result = jsQR(
        new Uint8ClampedArray(resized.data),
        resized.info.width,
        resized.info.height,
      );
      if (result?.data !== expected)
        throw Error(`Chibi QR failed at width ${width}`);
      console.log(`Chibi poster at ${width}px: decoded correctly`);
    }
  }
}
for (const file of [
  "teacher-1-portrait.webp",
  "photo-2.webp",
  "photo-3.webp",
  "photo-4.webp",
  "photo-5.webp",
  "photo-6.webp",
]) {
  const meta = await sharp(`${folder}/${file}`).metadata();
  if (meta.exif) throw Error(`EXIF was retained: ${file}`);
  console.log(`${file}: ${meta.width}x${meta.height}, EXIF removed`);
}
const assets = await fs.readdir(folder);
console.log(`${assets.length} faculty assets ready`);
