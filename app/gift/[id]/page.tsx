import { notFound } from "next/navigation";
import { getGift } from "@/lib/gift-store";
import { GiftExperience } from "@/components/gift-experience";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Có một món quà dành riêng cho bạn — Thương",
  robots: { index: false, follow: false },
};
export default async function GiftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gift = await getGift(id);
  if (!gift) notFound();
  return <GiftExperience gift={gift} />;
}
