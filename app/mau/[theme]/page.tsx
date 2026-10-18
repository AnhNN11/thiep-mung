import { notFound } from "next/navigation";
import { GiftExperience } from "@/components/gift-experience";
import { createGift, templates } from "@/lib/templates";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const t = templates.find((t) => t.id === theme);
  return { title: t ? `${t.title} · Thương Studio` : "Không tìm thấy mẫu" };
}
export default async function TemplateDemo({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const template = templates.find((t) => t.id === theme);
  if (!template) notFound();
  return <GiftExperience gift={createGift(template.id)} />;
}
