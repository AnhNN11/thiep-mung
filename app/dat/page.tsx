import type { Metadata } from "next";
import { PhotoBouquet } from "@/components/photo-bouquet";
import { datGift, datGiftUrl, datPresentation } from "@/lib/dat-gift";
import "../20-10/faculty.css";
import "../gui-em/romantic.css";
import "./dat.css";

export const metadata: Metadata = {
  title: "Gửi em yêu ♡ Từ Đạt · 20/10",
  description:
    "Một bó hoa nhỏ, một bản nhạc và một lá thư. Từ Đạt, gửi em yêu thật nhiều thương nhớ.",
  robots: { index: false, follow: false },
  alternates: { canonical: datGiftUrl },
};

export default function DatGiftPage() {
  return (
    <main className="dat-dedication">
      <PhotoBouquet gift={datGift} presentation={datPresentation} />
    </main>
  );
}
