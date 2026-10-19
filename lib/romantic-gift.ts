import type { Gift } from "./templates";
import type { BouquetPresentation } from "@/components/photo-bouquet";

export const romanticGiftUrl = "https://thiep-mung-ebon.vercel.app/gui-em";
const base = "/dedications/gui-em";
export const romanticPhotos = Array.from(
  { length: 10 },
  (_, i) => `${base}/photo-${i + 1}.webp`,
);

export const romanticGift: Gift = {
  theme: "bloom",
  recipient: "Em yêu",
  sender: "Anh",
  title: "Dành cho cô gái anh thương",
  occasion: "Chúc mừng em ngày 20/10",
  music: "dlove-original",
  photos: [
    romanticPhotos[0],
    romanticPhotos[3],
    romanticPhotos[1],
    romanticPhotos[7],
    romanticPhotos[5],
    romanticPhotos[9],
  ],
  message:
    "Gửi em yêu của anh!\n\nCó những điều bình thường thôi, nhưng từ khi có em lại trở nên thật đặc biệt. Một ngày dài bỗng dễ chịu hơn khi được nghe em kể chuyện; một góc phố quen cũng trở nên đáng nhớ vì có em đi cùng.\n\nAnh thích em trong từng khoảnh khắc: lúc ôm một bó hoa, lúc chăm chú đọc sách, khi đội chiếc mũ đáng yêu, và cả những lúc em chỉ mỉm cười thật nhẹ. Với anh, em luôn có một cách rất riêng để làm mọi thứ xung quanh trở nên dịu dàng hơn.\n\nNhân ngày 20/10, anh chúc em luôn khỏe mạnh, bình an và rạng rỡ. Chúc những điều em mong đều dần thành hiện thực, những cố gắng của em được đền đáp, và mỗi ngày đều có một điều nhỏ xinh khiến em vui.\n\nEm cứ là chính em nhé: tự tin với điều mình yêu, kiên trì với điều mình chọn. Những hôm mệt mỏi, mong em nhớ rằng em luôn có thể kể với anh, có thể dựa vào anh một chút, và không cần phải mạnh mẽ một mình.\n\nBó hoa này là một món quà nhỏ, còn điều anh muốn gửi em thì nhiều hơn thế: sự quan tâm, những cái nắm tay, và thật nhiều ngày bình yên có nhau.\n\nCảm ơn em vì đã đến và ở bên anh. Mong nụ cười của em luôn ở đó, trong những ngày hôm nay và cả những ngày sau nữa.\n\nChúc mừng 20/10, cô gái anh thương!\n\nThương em thật nhiều,\nAnh ♡",
};

export const romanticPresentation: BouquetPresentation = {
  variant: "romantic",
  eyebrow: "20 · 10 — MỘT MÓN QUÀ DÀNH RIÊNG CHO EM",
  title: "Dành cho em",
  subtitle: "Cô gái anh thương",
  signature: "Một bó hoa nhỏ · Thật nhiều yêu thương",
  revealHint: "Chạm để mở những khoảnh khắc của em",
  envelopeTo: "Gửi em yêu của anh",
  letterPhoto: romanticPhotos[0],
  letterAutoScroll: true,
  portraitKinds: ["photo", "photo", "photo", "photo", "photo", "photo"],
  butterflies: true,
  rainPhotos: romanticPhotos,
  featuredEyebrow: "CHỈ DÀNH RIÊNG CHO EM",
  featuredDedication: "Một bó hoa nhỏ, thay anh nói lời thương ♡",
  featuredWishes: [
    "Cảm ơn em vì đã làm những ngày bình thường trở nên đặc biệt.",
    "Mong em luôn rạng rỡ, bình an và được yêu thương thật nhiều.",
    "Trong thật nhiều điều đẹp đẽ, anh vẫn thích nụ cười của em nhất.",
    "Em cứ theo đuổi những điều mình yêu, anh sẽ luôn cổ vũ em.",
    "Không chỉ hôm nay, mong ngày nào của em cũng có hoa và niềm vui.",
    "Những ngày mệt mỏi, cứ để anh thương em nhiều hơn một chút.",
    "Chúc cô gái anh thương một ngày 20/10 thật dịu dàng.",
    "Mong chúng mình còn thật nhiều mùa hoa để cùng nhau nhớ lại.",
  ],
  messages: [
    "Chúc mừng em ngày 20/10",
    "Dành cho cô gái anh thương",
    "Thương em thật nhiều",
    "Mong em luôn mỉm cười",
    "Bình an và hạnh phúc nhé",
    "Em là điều dịu dàng nhất",
    "Cảm ơn em đã ở bên anh",
    "Mỗi ngày đều được yêu thương",
    "Anh thích nụ cười của em",
    "Cứ là chính em nhé",
    "Luôn tự tin và rạng rỡ",
    "Mọi ước mơ đều thành hiện thực",
    "Ngày mới ngập tràn niềm vui",
    "Để anh cùng em đi tiếp",
    "Anh luôn ở đây",
    "Một bó hoa dành riêng cho em",
    "Những điều đẹp nhất gửi đến em",
    "Yêu cả những điều nhỏ bé ở em",
    "Hôm nay và nhiều ngày sau nữa",
    "Có em, ngày nào cũng đẹp",
    "Nắm tay nhau thêm thật lâu",
    "Mong em luôn khỏe mạnh",
    "Em xứng đáng với những điều tốt đẹp",
    "Gửi em một cái ôm thật lâu",
    "Thật nhiều bình yên bên nhau",
    "Chúc em trọn vẹn với đam mê",
    "Hoa sẽ nở, điều lành sẽ đến",
    "Mọi cố gắng đều được đền đáp",
    "Cùng nhau giữ những kỷ niệm đẹp",
    "Anh thương em ♡",
  ],
};
