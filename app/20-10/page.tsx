import type { Metadata } from "next";
import { PhotoBouquet } from "@/components/photo-bouquet";
import {
  facultyGift,
  facultyGiftUrl,
  facultyPresentation,
} from "@/lib/faculty-gift";
import "./faculty.css";

export const metadata: Metadata = {
  title: "Kính tặng các Cô · Khoa Tin học và Ngoại ngữ · 20/10",
  description:
    "Một bó hoa nhỏ, một tấm lòng tri ân. Kính chúc các Cô một ngày 20/10 rạng rỡ và hạnh phúc.",
  robots: { index: false, follow: false },
  alternates: { canonical: facultyGiftUrl },
  openGraph: {
    title: "Kính tặng các Cô · Chúc mừng 20/10",
    description:
      "Khoa Tin học và Ngoại ngữ · Trân trọng những người gieo tri thức.",
    url: facultyGiftUrl,
    locale: "vi_VN",
    type: "website",
  },
};
export default function FacultyGiftPage() {
  return (
    <main>
      <PhotoBouquet gift={facultyGift} presentation={facultyPresentation} />
    </main>
  );
}
