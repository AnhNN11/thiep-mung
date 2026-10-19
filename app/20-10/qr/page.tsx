import type { Metadata } from "next";
import { facultyAssetBase, facultyGiftUrl } from "@/lib/faculty-gift";
import "./qr.css";
export const metadata: Metadata = {
  title: "Mã QR thiệp 20/10 · Khoa Tin học và Ngoại ngữ",
  robots: { index: false, follow: false },
};
export default function FacultyQrPage() {
  return (
    <main className="faculty-qr-page">
      <div className="faculty-qr-card">
        <p className="faculty-qr-kicker">
          MỘT MÓN QUÀ NHỎ · NGÀN LỜI YÊU THƯƠNG
        </p>
        <h1>20 · 10</h1>
        <h2>Kính tặng các Cô</h2>
        <p className="faculty-qr-department">Khoa Tin học và Ngoại ngữ</p>
        <img
          className="faculty-qr-chibi"
          src={`${facultyAssetBase}/chibi-cac-co.webp`}
          alt="Tranh chibi sáu cô Khoa Tin học và Ngoại ngữ trong quân phục xanh, cùng hoa hồng và bướm"
          width={1400}
          height={933}
        />
        <img
          className="faculty-qr-code"
          src={`${facultyAssetBase}/ma-qr-thiep-20-10.svg`}
          alt="Mã QR mở thiệp chúc mừng 20/10"
        />
        <p>Quét mã để mở bó hoa và lời chúc</p>
        <a className="faculty-qr-open" href="/20-10">
          Mở thiệp ngay ↗
        </a>
        <div className="faculty-qr-downloads">
          <a href={`${facultyAssetBase}/bang-qr-20-10-chibi.png`} download>
            Tải bảng QR chibi để in
          </a>
          <a href={`${facultyAssetBase}/chibi-cac-co.png`} download>
            Tải tranh chibi
          </a>
          <a href={`${facultyAssetBase}/ma-qr-thiep-20-10.png`} download>
            Tải mã QR PNG
          </a>
          <a href={`${facultyAssetBase}/ma-qr-thiep-20-10.svg`} download>
            Tải mã QR SVG
          </a>
        </div>
        <small>{facultyGiftUrl.replace("https://", "")}</small>
      </div>
    </main>
  );
}
