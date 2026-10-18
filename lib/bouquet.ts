// Measured layout and timing of the public reference supplied by the user.
// This module holds artwork positions, not the reference site's application code.
export const referenceUrl = "https://i.dlove.vn/index.html?fc8e1763db7249b6";
export const sampleBouquetPhotos = Array.from(
  { length: 6 },
  (_, i) => `/dlove/photos/bouquet-${i + 1}.webp`,
);
export const sampleRainPhotos = Array.from(
  { length: 10 },
  (_, i) => `/dlove/photos/memory-${i + 1}.webp`,
);
export const rainMessages = [
  "Chúc em luôn vui vẻ và hạnh phúc",
  "Chúc em luôn xinh đẹp",
  "Chúc em luôn yêu đời",
  "Chúc mừng ngày phụ nữ việt nam",
  "20/10",
  "yêu em",
  "chúc em thật nhiều may mắn",
  "mãi yêu em",
  "Mong mọi điều dịu dàng sẽ đến với em",
];
export type BouquetPart = {
  asset: string;
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  z: number;
  flip?: boolean;
  delay?: number;
};
export const portraitSlots = [
  { x: 374, y: 386, w: 252, h: 394, r: -1, z: 26 },
  { x: 176, y: 176, w: 240, h: 382, r: -6, z: 14 },
  { x: 584, y: 176, w: 240, h: 382, r: 6, z: 15 },
  { x: 378, y: 120, w: 244, h: 392, r: 0, z: 11 },
  { x: 139, y: 368, w: 240, h: 386, r: -8, z: 22 },
  { x: 621, y: 359, w: 240, h: 386, r: 8, z: 22 },
];
export const bouquetParts: BouquetPart[] = [
  { asset: "wrap-back-v2", x: 82, y: 125, w: 836, h: 1115, z: 5 },
  { asset: "leaf-sprig", x: 48, y: 258, w: 310, h: 490, r: -26, z: 7 },
  {
    asset: "leaf-sprig",
    x: 658,
    y: 274,
    w: 300,
    h: 470,
    r: 24,
    z: 7,
    flip: true,
  },
  { asset: "baby-breath", x: 96, y: 207, w: 246, h: 485, r: -13, z: 8 },
  {
    asset: "baby-breath",
    x: 658,
    y: 229,
    w: 246,
    h: 465,
    r: 15,
    z: 8,
    flip: true,
  },
  {
    asset: "baby-breath",
    x: 330,
    y: 250,
    w: 175,
    h: 345,
    r: -10,
    z: 9,
    delay: 750,
  },
  {
    asset: "baby-breath",
    x: 523,
    y: 246,
    w: 202,
    h: 357,
    r: 15,
    z: 9,
    delay: 950,
    flip: true,
  },
  {
    asset: "baby-breath",
    x: 435,
    y: 548,
    w: 210,
    h: 310,
    r: -5,
    z: 9,
    delay: 1350,
  },
  {
    asset: "rose-pink",
    x: 327,
    y: 429,
    w: 125,
    h: 140,
    r: -8,
    z: 10,
    delay: 900,
  },
  {
    asset: "rose-pink",
    x: 558,
    y: 463,
    w: 116,
    h: 128,
    r: 16,
    z: 10,
    delay: 1100,
    flip: true,
  },
  { asset: "rose-pink", x: 145, y: 555, w: 236, h: 247, r: -17, z: 30 },
  { asset: "rose-pink", x: 619, y: 548, w: 230, h: 241, r: 22, z: 30 },
  { asset: "baby-breath", x: 155, y: 570, w: 180, h: 260, r: -15, z: 31 },
  { asset: "rose-pink", x: 259, y: 661, w: 205, h: 220, r: -9, z: 32 },
  { asset: "rose-ivory", x: 576, y: 664, w: 196, h: 202, r: 13, z: 32 },
  { asset: "baby-breath", x: 432, y: 683, w: 136, h: 198, r: 4, z: 43 },
  { asset: "wrap-front-v2", x: 60, y: 525, w: 880, h: 550, z: 40 },
  { asset: "butterfly", x: 70, y: 150, w: 80, h: 75, r: -17, z: 48 },
  {
    asset: "butterfly",
    x: 861,
    y: 257,
    w: 77,
    h: 72,
    r: 16,
    z: 48,
    flip: true,
  },
];
export const flowerCovers: BouquetPart[] = [
  { asset: "rose-pink", x: 296, y: 357, w: 350, h: 350, r: -3, z: 27 },
  { asset: "rose-ivory", x: 144, y: 238, w: 310, h: 310, r: -14, z: 15 },
  {
    asset: "rose-pink",
    x: 574,
    y: 220,
    w: 310,
    h: 310,
    r: 12,
    z: 16,
    flip: true,
  },
  { asset: "rose-pink", x: 294, y: 132, w: 326, h: 326, r: -4, z: 12 },
  { asset: "rose-pink", x: 107, y: 397, w: 310, h: 310, r: -13, z: 23 },
  { asset: "rose-ivory", x: 591, y: 397, w: 298, h: 307, r: 13, z: 23 },
];
export const revealDelays = [1280, 240, 540, 80, 760, 960];
