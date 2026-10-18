import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./photo-bouquet.css";
import "./source-experiences.css";
const bodyFont = localFont({
  src: [
    { path: "../public/fonts/font-1.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/font-2.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/font-3.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});
const displayFont = localFont({
  src: [
    { path: "../public/fonts/font-4.ttf", weight: "400", style: "italic" },
    { path: "../public/fonts/font-5.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/font-6.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-serif",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Thương — Gói ghém những điều thương",
  description:
    "Một bông hoa, một lá thư, một bản nhạc. Tự tay tạo món quà số dành riêng cho người bạn thương.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
