import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import QRCode from "qrcode";

const output = path.resolve("public/dedications/faculty-20-10");
await fs.mkdir(output, { recursive: true });
const files = [
  "DSCF7656.JPG",
  "DSCF7785.JPG",
  "DSCF7716.JPG",
  "DSCF7666.JPG",
  "DSCF7657.JPG",
];
for (let i = 1; i < files.length; i++) {
  await sharp(path.join("C:/Users/admin/Downloads", files[i]))
    .rotate()
    .resize({ height: 1600, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(path.join(output, `photo-${i + 1}.webp`));
}
await sharp(
  "C:/Users/admin/.codex/generated_images/01a14cc3-1508-7913-88b4-424f95b13173/exec-5f807f68-e59d-4005-a60c-55ad7862bb35.png",
)
  .resize({ height: 1400 })
  .webp({ quality: 92 })
  .toFile(path.join(output, "teacher-1-portrait.webp"));
const flag = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><defs><linearGradient id="red" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ef2639"/><stop offset=".5" stop-color="#c8102e"/><stop offset="1" stop-color="#8c0922"/></linearGradient><linearGradient id="silk"><stop stop-color="#fff" stop-opacity=".28"/><stop offset=".27" stop-color="#fff" stop-opacity="0"/><stop offset=".52" stop-color="#21000b" stop-opacity=".18"/><stop offset=".78" stop-color="#fff" stop-opacity=".17"/><stop offset="1" stop-color="#000" stop-opacity=".04"/></linearGradient><linearGradient id="gold" x2="1" y2="1"><stop stop-color="#fff3a6"/><stop offset=".55" stop-color="#ffde28"/><stop offset="1" stop-color="#f3b70e"/></linearGradient><clipPath id="cloth"><path d="M24 48 Q230 0 450 43 T876 35 L876 548 Q667 599 450 557 T24 563Z"/></clipPath></defs><g clip-path="url(#cloth)"><rect width="900" height="600" fill="url(#red)"/><path d="M450 125 491 251 624 251 517 329 558 455 450 377 342 455 383 329 276 251 409 251Z" fill="url(#gold)"/><rect width="900" height="600" fill="url(#silk)"/></g><path d="M24 48 Q230 0 450 43 T876 35" fill="none" stroke="#ffbdbe" stroke-opacity=".45" stroke-width="3"/></svg>`;
await fs.writeFile(path.join(output, "co-viet-nam.svg"), flag);
const url = "https://thiep-mung-ebon.vercel.app/20-10";
await QRCode.toFile(path.join(output, "ma-qr-thiep-20-10.png"), url, {
  width: 1600,
  margin: 4,
  errorCorrectionLevel: "H",
  color: { dark: "#173e32", light: "#ffffff" },
});
const qr = await QRCode.toString(url, {
  type: "svg",
  margin: 4,
  errorCorrectionLevel: "H",
  color: { dark: "#173e32", light: "#ffffff" },
});
await fs.writeFile(path.join(output, "ma-qr-thiep-20-10.svg"), qr);
const qrData = `data:image/svg+xml;base64,${Buffer.from(qr).toString("base64")}`;
const flagData = `data:image/svg+xml;base64,${Buffer.from(flag).toString("base64")}`;
const poster = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2000" viewBox="0 0 1600 2000"><defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fffaf0"/><stop offset="1" stop-color="#f6ebe0"/></linearGradient><linearGradient id="ink"><stop stop-color="#214b3c"/><stop offset="1" stop-color="#17392f"/></linearGradient></defs><rect width="1600" height="2000" fill="url(#paper)"/><rect x="48" y="48" width="1504" height="1904" rx="32" fill="none" stroke="#bd965c" stroke-width="2"/><rect x="68" y="68" width="1464" height="1864" rx="25" fill="none" stroke="#d9c5a2"/><circle cx="800" cy="270" r="160" fill="#f2e5d1"/><image href="${flagData}" x="640" y="168" width="320" height="214"/><text x="800" y="475" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="27" letter-spacing="6" fill="#9f794a">NGÀY PHỤ NỮ VIỆT NAM</text><text x="800" y="625" text-anchor="middle" font-family="Georgia,serif" font-size="144" fill="url(#ink)">20 · 10</text><text x="800" y="710" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="40" fill="#234636">KÍNH TẶNG CÁC CÔ</text><text x="800" y="775" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="36" fill="#234636">KHOA TIN HỌC VÀ NGOẠI NGỮ</text><path d="M650 827H950" stroke="#bc965d" stroke-width="2"/><rect x="350" y="880" width="900" height="900" rx="30" fill="white" stroke="#e4d5ba" stroke-width="2"/><image href="${qrData}" x="375" y="905" width="850" height="850"/><text x="800" y="1835" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="33" fill="#234636">Quét mã để mở bó hoa và lời chúc</text><text x="800" y="1890" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="24" fill="#957958">Trân trọng · Biết ơn · Yêu thương</text></svg>`;
await fs.writeFile(path.join(output, "bang-qr-20-10.svg"), poster);
await sharp(Buffer.from(poster))
  .png()
  .withMetadata({ density: 300 })
  .toFile(path.join(output, "bang-qr-20-10.png"));
// Keep the reviewed provenance notes and final ImageGen prompt in README.md.
console.log(`Assets and QR ready: ${output}`);
