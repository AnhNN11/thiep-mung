import type { Metadata } from "next";
import { PhotoBouquet } from "@/components/photo-bouquet";
import {
  romanticGift,
  romanticGiftUrl,
  romanticPresentation,
} from "@/lib/romantic-gift";
import "../20-10/faculty.css";
import "./romantic.css";

export const metadata: Metadata = {
  title: "Dành cho em ♡ Một món quà ngày 20/10",
  description:
    "Một bó hoa nhỏ, một bản nhạc và một lá thư. Dành riêng cho cô gái anh thương.",
  robots: { index: false, follow: false },
  alternates: { canonical: romanticGiftUrl },
};

export default function RomanticGiftPage() {
  return (
    <main>
      <PhotoBouquet gift={romanticGift} presentation={romanticPresentation} />
    </main>
  );
}
