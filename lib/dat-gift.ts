import type { Gift } from "./templates";
import type { BouquetPresentation } from "@/components/photo-bouquet";

export const datGiftUrl = "https://thiep-mung-ebon.vercel.app/dat";
const base = "/dedications/dat";
export const datPhotos = Array.from(
  { length: 6 },
  (_, i) => `${base}/photo-${i + 1}.webp`,
);

export const datGift: Gift = {
  theme: "bloom",
  recipient: "Em yêu",
  sender: "Đạt",
  title: "Gửi em một trời thương nhớ",
  occasion: "Chúc mừng em ngày 20/10",
  music: "dlove-original",
  photos: [
    datPhotos[2],
    datPhotos[0],
    datPhotos[1],
    datPhotos[3],
    datPhotos[5],
    datPhotos[4],
  ],
  message:
    "Gửi em yêu!\n\nHôm nay là 20/10, anh muốn dành cho em một bó hoa thật xinh và một lời chúc thật nhiều yêu thương. Mong khi mở món quà nhỏ này, em sẽ mỉm cười và cảm nhận được rằng em luôn là một người rất đặc biệt với anh.\n\nAnh thích những khoảnh khắc rất riêng của em: lúc dịu dàng trong chiếc váy xinh, khi đội một chiếc mũ đáng yêu, hay những lúc nhí nhảnh làm mặt ngộ nghĩnh. Chẳng cần phải thật hoàn hảo, cứ là em thôi cũng đã đủ khiến anh thương rồi.\n\nChúc em luôn khỏe mạnh, bình an và rạng rỡ. Chúc em có thật nhiều niềm vui, gặp những điều tử tế và đủ tự tin để theo đuổi những điều mình mong muốn. Mong mọi cố gắng của em đều được đền đáp bằng những kết quả thật đẹp.\n\nNhững ngày vui, anh muốn được nghe em kể. Những hôm mệt mỏi, anh mong em có thể dựa vào anh một chút. Em không cần phải giấu đi những lúc yếu lòng, cũng không cần lúc nào cũng mạnh mẽ một mình.\n\nKhông chỉ riêng ngày hôm nay, anh mong mỗi ngày của em đều có một điều nhỏ bé khiến em thấy hạnh phúc: một lời hỏi han, một cái ôm, một bông hoa, hay đơn giản là cảm giác luôn có người thương mình thật lòng.\n\nCảm ơn em vì đã xuất hiện và làm những ngày bình thường trở nên đáng yêu hơn. Mong chúng mình sẽ còn cùng nhau lưu lại thật nhiều khoảnh khắc đẹp.\n\nChúc mừng 20/10, em yêu!\n\nThương em thật nhiều,\nĐạt ♡",
};

export const datPresentation: BouquetPresentation = {
  variant: "romantic",
  eyebrow: "20 · 10 — MỘT MÓN QUÀ DÀNH RIÊNG CHO EM",
  title: "Gửi em yêu",
  subtitle: "Một trời thương nhớ, từ Đạt",
  signature: "Một bó hoa nhỏ · Thật nhiều yêu thương",
  revealHint: "Chạm để hé lộ những khoảnh khắc đáng yêu",
  envelopeTo: "Gửi em yêu",
  letterPhoto: datPhotos[2],
  letterAutoScroll: true,
  portraitKinds: ["photo", "photo", "photo", "photo", "photo", "photo"],
  butterflies: true,
  rainPhotos: datPhotos,
  rainPhotoInsets: { [datPhotos[4]]: { top: 0.12, bottom: 0.13 } },
  featuredEyebrow: "THẬT NHIỀU YÊU THƯƠNG, GỬI ĐẾN EM",
  featuredDedication: "Từ Đạt, với tất cả những điều dịu dàng nhất ♡",
  featuredWishes: [
    "Chúc em một ngày 20/10 thật xinh, thật vui và thật nhiều yêu thương.",
    "Dịu dàng hay nhí nhảnh, với anh em vẫn luôn thật đáng yêu.",
    "Mong mọi cố gắng của em đều đơm hoa thành những điều đẹp đẽ.",
    "Em cứ là chính em, còn những điều dịu dàng hãy để anh gửi tới.",
    "Anh thích nhất là khi thấy em mỉm cười thật vui.",
    "Mong những ngày bình thường của chúng mình cũng đầy ắp niềm vui.",
    "Một bó hoa nhỏ, thay Đạt gửi đến em thật nhiều lời thương.",
    "Không chỉ hôm nay, mong ngày nào em cũng được nâng niu.",
  ],
  messages: [
    "Chúc mừng em ngày 20/10",
    "Từ Đạt, gửi em yêu",
    "Thương em thật nhiều",
    "Mong em luôn mỉm cười",
    "Bình an và hạnh phúc nhé",
    "Em luôn thật đáng yêu",
    "Cứ là chính em nhé",
    "Anh luôn ở đây",
    "Rạng rỡ theo cách riêng của em",
    "Mỗi ngày đều được yêu thương",
    "Chúc em thật nhiều niềm vui",
    "Gửi em một cái ôm thật lâu",
    "Những điều dịu dàng nhất gửi em",
    "Mọi cố gắng đều được đền đáp",
    "Ngày mới thật nhiều may mắn",
    "Có em, ngày thường cũng đẹp",
    "Mong em luôn khỏe mạnh",
    "Tự tin theo đuổi ước mơ",
    "Cảm ơn em đã đến",
    "Em xứng đáng với những điều tốt đẹp",
    "Đạt thương em ♡",
    "Mãi giữ những khoảnh khắc đáng yêu",
    "Một bó hoa dành riêng cho em",
    "Hôm nay và nhiều ngày sau nữa",
  ],
};
