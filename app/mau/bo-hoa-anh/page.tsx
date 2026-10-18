import { PhotoBouquet } from "@/components/photo-bouquet";
import { createGift } from "@/lib/templates";
export const metadata = {
  title: "Bó hoa ảnh · Mưa yêu thương",
  description: "Bó hoa ảnh, mưa lời chúc 3D và lá thư dành riêng cho bạn.",
};
export default function BouquetDemo() {
  return <PhotoBouquet gift={createGift("bloom")} />;
}
