import { NextResponse } from "next/server";
import { saveGift } from "@/lib/gift-store";
import { templates, tracks, photoLimit, type Gift } from "@/lib/templates";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const reader = request.body?.getReader();
    if (!reader)
      return NextResponse.json(
        { error: "Món quà chưa có nội dung." },
        { status: 400 },
      );
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 12 * 1024 * 1024) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Món quà quá lớn. Hãy chọn nhạc hoặc ảnh nhẹ hơn." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (
      !data ||
      typeof data !== "object" ||
      !templates.some((t) => t.id === data.theme) ||
      typeof data.recipient !== "string" ||
      !data.recipient.trim() ||
      typeof data.sender !== "string" ||
      !data.sender.trim() ||
      typeof data.message !== "string" ||
      !data.message.trim() ||
      typeof data.title !== "string" ||
      !data.title.trim() ||
      typeof data.occasion !== "string"
    )
      return NextResponse.json(
        { error: "Bạn hãy điền tên, tiêu đề và lời chúc nhé." },
        { status: 400 },
      );
    if (
      data.recipient.length > 80 ||
      data.sender.length > 80 ||
      data.title.length > 140 ||
      data.message.length > 4000 ||
      data.occasion.length > 80
    )
      return NextResponse.json(
        { error: "Nội dung dài hơn giới hạn cho phép." },
        { status: 400 },
      );
    const imageOk = (s: unknown) =>
      typeof s === "string" &&
      ([
        "/images/memory-1.jpg",
        "/images/memory-2.jpg",
        "/images/bouquet.png",
      ].includes(s) ||
        /^\/dlove\/(?:photos\/bouquet-[1-6]\.webp|garden\/person-(?:0[1-9]|1[0-2])\.webp|galaxy\/demo-photo\.jpg|wishes\/photo-(?:[1-9]|10)\.jpg|valentine\/photo-[1-7]\.jpg|moon-vip\/photos\/photo-[1-6]\.webp|planet\/b1\.png)$/.test(
          s,
        ) ||
        (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s) &&
          s.length < 2000000));
    if (
      !Array.isArray(data.photos) ||
      data.photos.length > photoLimit(data.theme) ||
      !data.photos.every(imageOk)
    )
      return NextResponse.json(
        { error: `Ảnh chưa hợp lệ (tối đa ${photoLimit(data.theme)} ảnh).` },
        { status: 400 },
      );
    if (
      typeof data.music !== "string" ||
      !(
        tracks.some((t) => t.id === data.music) ||
        (/^data:audio\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(
          data.music,
        ) &&
          data.music.length < 7500000)
      )
    )
      return NextResponse.json(
        { error: "Bản nhạc chưa hợp lệ." },
        { status: 400 },
      );
    const gift: Gift = {
      theme: data.theme,
      recipient: data.recipient.trim(),
      sender: data.sender.trim(),
      title: data.title.trim(),
      message: data.message.trim(),
      occasion: data.occasion,
      music: data.music,
      photos: data.photos,
    };
    const id = await saveGift(gift);
    return NextResponse.json({ id, path: `/gift/${id}` }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError)
      return NextResponse.json(
        { error: "Nội dung món quà chưa hợp lệ." },
        { status: 400 },
      );
    return NextResponse.json(
      { error: "Chưa thể lưu món quà. Bạn thử lại nhé." },
      { status: 500 },
    );
  }
}
