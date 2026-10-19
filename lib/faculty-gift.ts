import type { Gift } from "./templates";
import type { BouquetPresentation } from "@/components/photo-bouquet";

export const facultyGiftUrl = "https://thiep-mung-ebon.vercel.app/20-10";
export const facultyAssetBase = "/dedications/faculty-20-10";
export const facultyPhotos = [
  `${facultyAssetBase}/teacher-1-cutout.webp`,
  `${facultyAssetBase}/photo-2.webp`,
  `${facultyAssetBase}/photo-3.webp`,
  `${facultyAssetBase}/photo-4.webp`,
  `${facultyAssetBase}/photo-5.webp`,
];
export const facultyGift: Gift = {
  theme: "bloom",
  recipient: "các Cô Khoa Tin học và Ngoại ngữ",
  sender: "Với tất cả sự trân trọng và lòng biết ơn",
  title: "Rạng rỡ những người gieo tri thức",
  occasion: "Chúc mừng Ngày Phụ nữ Việt Nam 20/10",
  music: "dlove-original",
  photos: [...facultyPhotos, `${facultyAssetBase}/co-viet-nam.svg`],
  message:
    "Kính gửi các Cô Khoa Tin học và Ngoại ngữ!\n\nNhân Ngày Phụ nữ Việt Nam 20/10, kính chúc các Cô luôn mạnh khỏe, hạnh phúc và rạng rỡ; vững vàng trong công tác, trọn vẹn niềm vui bên gia đình và những người thân yêu.\n\nCảm ơn các Cô đã tận tâm truyền đạt kiến thức, kiên nhẫn dìu dắt và thắp lên niềm say mê học tập. Từng bài giảng Tin học, từng giờ Ngoại ngữ đều mở thêm những cánh cửa tri thức và những cơ hội mới.\n\nTrong sắc xanh quân phục và bên bục giảng, các Cô luôn là những bông hoa đẹp: bản lĩnh, trí tuệ, nhân hậu và đầy nhiệt huyết.\n\nMong các Cô luôn giữ nụ cười tươi, sự bình an trong tâm hồn và niềm tự hào với những điều mình đang cống hiến.\n\nKính chúc các Cô một ngày 20/10 thật ý nghĩa!\n\nVới tất cả sự trân trọng và lòng biết ơn. 🇻🇳",
};
export const facultyPresentation: BouquetPresentation = {
  eyebrow: "NGÀY PHỤ NỮ VIỆT NAM · 20/10",
  title: "Kính tặng các Cô",
  subtitle: "Khoa Tin học và Ngoại ngữ",
  signature: "Một bó hoa nhỏ · Một tấm lòng tri ân",
  envelopeTo: "Kính tặng các Cô",
  letterPhoto: `${facultyAssetBase}/co-viet-nam.svg`,
  portraitKinds: ["cutout", "photo", "photo", "photo", "photo", "flag"],
  rainPhotos: [...facultyPhotos, `${facultyAssetBase}/co-viet-nam.svg`],
  messages: [
    "Chúc mừng Ngày Phụ nữ Việt Nam",
    "20/10 · Kính tặng các Cô",
    "Khoa Tin học và Ngoại ngữ",
    "Sức khỏe · Bình an · Hạnh phúc",
    "Tận tâm gieo tri thức",
    "Rạng rỡ những người truyền cảm hứng",
    "Vững vàng nơi bục giảng",
    "Tự hào Phụ nữ Việt Nam",
    "Trân trọng và biết ơn",
    "Mong các Cô luôn nở nụ cười",
  ],
};
