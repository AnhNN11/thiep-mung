import { sampleBouquetPhotos } from "./bouquet";
export type Theme =
  | "bloom"
  | "galaxy"
  | "garden"
  | "wishes"
  | "valentine"
  | "birthday"
  | "moon"
  | "moon-vip"
  | "planet"
  | "letter"
  | "memories"
  | "surprise"
  | "vinyl";
export type Gift = {
  theme: Theme;
  recipient: string;
  sender: string;
  title: string;
  message: string;
  music: string;
  photos: string[];
  occasion: string;
};
export const photoLimit = (theme: Theme) => (theme === "bloom" ? 6 : 12);
export const tracks = [
  {
    id: "garden-original",
    title: "Nhạc demo Vườn hoa",
    genre: "File nhạc từ demo DLove",
    duration: "MP3",
    src: "/dlove/garden/background-music.mp3",
    color: "#d8e6d1",
  },
  {
    id: "galaxy-original",
    title: "Nhạc demo Thiên Hà",
    genre: "eyenoselip.mp3 · File gốc",
    duration: "MP3",
    src: "/dlove/galaxy/eyenoselip.mp3",
    color: "#e8cce9",
  },
  {
    id: "birthday-original",
    title: "Happy Birthday",
    genre: "Nhạc mặc định của mẫu Sinh nhật",
    duration: "MP3",
    src: "/dlove/birthday/happy-birthday.mp3",
    color: "#f5cadc",
  },
  {
    id: "moon-original",
    title: "Nhạc demo Trung Thu VIP",
    genre: "vuonhoaconca.mp3 · File gốc",
    duration: "MP3",
    src: "/dlove/moon-vip/music/vuonhoaconca.mp3",
    color: "#efd6aa",
  },
  {
    id: "wishes-original",
    title: "Nhạc demo Ngày đặc biệt",
    genre: "noinaycoanh.mp3 · File gốc",
    duration: "MP3",
    src: "/dlove/wishes/music.mp3",
    color: "#e7cce6",
  },
  {
    id: "valentine-original",
    title: "Nhạc demo Đếm ngày yêu",
    genre: "tinhyeugiuamuadong.mp3 · File gốc",
    duration: "MP3",
    src: "/dlove/valentine/music.mp3",
    color: "#efc5d8",
  },
  {
    id: "moon-default",
    title: "Nhạc mẫu Trung Thu",
    genre: "anhnangcuaanh.mp3 · Mặc định template",
    duration: "MP3",
    src: "/dlove/moon/music/anhnangcuaanh.mp3",
    color: "#e5ca99",
  },
  {
    id: "planet-default",
    title: "Nhạc mẫu Tinh cầu",
    genre: "hukhong.mp3 · Mặc định template",
    duration: "MP3",
    src: "/dlove/planet/hukhong.mp3",
    color: "#d4cde9",
  },
  {
    id: "dlove-original",
    title: "Nhạc từ thiệp bó hoa DLove",
    genre: "Đúng file MP3 của mẫu bạn gửi",
    duration: "0:47",
    src: "/music/dlove-sample.mp3",
    color: "#eed0dc",
  },
  {
    id: "piano",
    title: "Một chiều dịu dàng",
    genre: "Piano · Nhẹ nhàng",
    duration: "0:48",
    src: "/music/piano.wav",
    color: "#eed5cd",
  },
  {
    id: "dream",
    title: "Chạm vào giấc mơ",
    genre: "Ambient · Mơ màng",
    duration: "0:48",
    src: "/music/dream.wav",
    color: "#dcd7ec",
  },
  {
    id: "waltz",
    title: "Điệu valse của nắng",
    genre: "Music box · Trong trẻo",
    duration: "0:48",
    src: "/music/waltz.wav",
    color: "#e4dfc9",
  },
];
export const templates: {
  id: Theme;
  title: string;
  description: string;
  tag: string;
  category: string;
  music: string;
  number: string;
  reference?: string;
  status?: string;
}[] = [
  {
    id: "bloom",
    title: "Bó hoa kỷ niệm",
    description: "Chạm để hé lộ ảnh, giữ bó hoa để bước vào mưa lời chúc 3D.",
    tag: "MẪU BÓ HOA ẢNH",
    category: "20/10",
    music: "dlove-original",
    number: "01",
    reference: "https://i.dlove.vn/index.html?fc8e1763db7249b6",
  },
  {
    id: "galaxy",
    title: "Thiên Hà Tình Yêu",
    description:
      "Giữ vân tay, bước vào mưa chữ và chạm hai lần để kết thành tim.",
    tag: "KHÔNG GIAN 3D",
    category: "Tình yêu",
    music: "galaxy-original",
    number: "04",
    reference: "https://deargift.online/galaxy-viewer.html?demo=1",
  },
  {
    id: "garden",
    title: "Vườn hoa DLove",
    description:
      "Dạo quanh khu vườn, gặp từng người và mở lời chúc, ảnh, bó hoa.",
    tag: "KHU VƯỜN TƯƠNG TÁC",
    category: "Kỷ niệm",
    music: "garden-original",
    number: "02",
    reference: "https://i.dlove.vn/vuon.html?ac8fb44238066def",
  },
  {
    id: "wishes",
    title: "Trung Thu · Sinh Nhật · Kỉ Niệm",
    description:
      "Lời chúc kết từ hàng nghìn hạt sáng, mở ra quả cầu ảnh kỷ niệm.",
    tag: "CHỮ HẠT & CẦU ẢNH",
    category: "20/10",
    music: "wishes-original",
    number: "03",
    reference:
      "https://womens-day-deargift.vercel.app/index.html?50bbfaeb61587746",
  },
  {
    id: "valentine",
    title: "Đếm ngày yêu",
    description:
      "Tin nhắn bất ngờ, trái tim đếm ngày bên nhau và không gian ảnh.",
    tag: "KỶ NIỆM TÌNH YÊU",
    category: "Kỷ niệm",
    music: "valentine-original",
    number: "05",
    reference:
      "https://valentine-deargift.vercel.app/index.html?6980dcf9491503a3072442d1",
  },
  {
    id: "birthday",
    title: "Chúc Mừng Sinh Nhật",
    description:
      "Mưa chữ hồng, đếm ngược bằng hạt sáng và chú mèo gửi yêu thương.",
    tag: "ĐẾM NGƯỢC SINH NHẬT",
    category: "Sinh nhật",
    music: "birthday-original",
    number: "06",
    reference:
      "https://happybirthdaydeargift.vercel.app/?websiteId=686cc6e8abdac90e614264c1",
    status: "Bản mặc định: demo gốc đã mất cấu hình",
  },
  {
    id: "moon",
    title: "Quà Trung Thu",
    description: "Trăng vàng, đèn lồng bay và lời chúc giữa bầu trời đêm.",
    tag: "ĐÊM TRĂNG",
    category: "Trung Thu",
    music: "moon-default",
    number: "07",
    reference: "https://trung-thu-two.vercel.app/?id=68e11e05879bca395de21ad6",
    status: "Bản dựng template: demo gốc đã mất cấu hình",
  },
  {
    id: "moon-vip",
    title: "Trung Thu VIP",
    description: "Giữ mặt trăng, mở thiệp nguyệt thư và trái tim hạt vàng.",
    tag: "THIỆP TRĂNG & TIM HẠT",
    category: "Trung Thu",
    music: "moon-original",
    number: "08",
    reference: "https://t.dlove.vn/minhchauiu",
  },
  {
    id: "planet",
    title: "Tinh Cầu Tình Yêu",
    description:
      "Hành tinh hồng với vành đai sao, ảnh bay và chuyến du hành vũ trụ.",
    tag: "VŨ TRỤ HẠT 3D",
    category: "Tình yêu",
    music: "planet-default",
    number: "09",
    reference: "https://loveplanetvn.vercel.app/#id=6858e9f729e21e7dd43906ae",
    status: "Bản mặc định: demo gốc đã mất cấu hình",
  },
];
templates.sort((a, b) => Number(a.number) - Number(b.number));
export const defaultGift: Gift = {
  theme: "bloom",
  recipient: "người thương",
  sender: "Một người luôn thương bạn",
  title: "Thế giới đẹp hơn, vì có em.",
  message:
    "Gửi em,\n\nCảm ơn em vì đã đến, vì những nụ cười làm ngày bình thường trở nên thật đặc biệt.\n\nMong em luôn được yêu thương, luôn có đủ bình yên để làm những điều mình thích, và đủ can đảm để theo đuổi những điều mình mơ.\n\nHôm nay và cả những ngày sau, hãy cứ rạng rỡ theo cách của riêng em nhé.\n\nThương em, thật nhiều.",
  music: "piano",
  photos: [
    "/images/memory-1.jpg",
    "/images/memory-2.jpg",
    "/images/bouquet.png",
  ],
  occasion: "Ngày Phụ nữ Việt Nam · 20/10",
};
export function createGift(theme: Theme): Gift {
  const base = {
    ...defaultGift,
    photos: [...defaultGift.photos],
    theme,
    music: templates.find((t) => t.id === theme)?.music || "piano",
  };
  if (theme === "bloom")
    return {
      ...base,
      photos: [...sampleBouquetPhotos],
      title: "Một bó hoa, thật nhiều yêu thương.",
      music: "dlove-original",
      message:
        "Gửi cô gái anh thương,\n\nChúc em một ngày 20/10 thật nhiều niềm vui. Mong em luôn tự tin, rạng rỡ và bình an trên mỗi con đường mình chọn.\n\nCảm ơn em vì những khoảnh khắc đã cùng anh sẻ chia. Mình cùng viết tiếp những ngày thật đẹp nhé.\n\nThương em thật nhiều. ♡",
    };
  if (theme === "galaxy")
    return {
      ...base,
      recipient: "Trí Toán",
      photos: ["/dlove/galaxy/demo-photo.jpg"],
      title: "I love you so much! ❤️",
    };
  if (theme === "garden")
    return {
      ...base,
      title: "Vườn hoa của chúng mình",
      occasion: "Những ngày thật đẹp",
      photos: Array.from(
        { length: 12 },
        (_, i) => `/dlove/garden/person-${String(i + 1).padStart(2, "0")}.webp`,
      ),
    };
  if (theme === "wishes")
    return {
      ...base,
      title: "Chúc Mừng · Ngày Quốc Tế Phụ Nữ · 8 Tháng 3 · Lớp 10A1",
      photos: Array.from(
        { length: 10 },
        (_, i) => `/dlove/wishes/photo-${i + 1}.jpg`,
      ),
    };
  if (theme === "valentine")
    return {
      ...base,
      recipient: "Yi",
      sender: "Sin",
      occasion: "2023-05-27",
      title: "Gửi tới Yi",
      photos: Array.from(
        { length: 7 },
        (_, i) => `/dlove/valentine/photo-${i + 1}.jpg`,
      ),
    };
  if (theme === "birthday")
    return {
      ...base,
      title: "HAPPY BIRTHDAY TO YOU",
      occasion: "Chúc mừng sinh nhật",
    };
  if (theme === "moon-vip" || theme === "moon")
    return {
      ...base,
      recipient: "Minh Châu",
      title: "Trung thu vui vẻ",
      occasion: "Tết Trung Thu",
      photos: Array.from(
        { length: 6 },
        (_, i) => `/dlove/moon-vip/photos/photo-${i + 1}.webp`,
      ),
    };
  if (theme === "planet")
    return {
      ...base,
      title: "You are my universe",
      photos: ["/dlove/planet/b1.png"],
    };
  if (theme === "surprise")
    return {
      ...base,
      occasion: "Chúc mừng sinh nhật",
      title: "Thêm một tuổi, thêm thật nhiều niềm vui.",
      message:
        "Gửi người thật đặc biệt,\n\nChúc mừng sinh nhật bạn! Mong tuổi mới mang đến những chuyến đi mới, những người bạn tốt và thật nhiều điều khiến bạn mỉm cười.\n\nMong mọi mong ước nhỏ bé của bạn đều được lắng nghe, mọi cố gắng đều được đền đáp.\n\nCảm ơn vì đã có mặt trên thế giới này. Hôm nay, tất cả những điều ngọt ngào nhất đều dành cho bạn.\n\nSinh nhật thật vui nhé! 🎂",
    };
  if (theme === "memories")
    return {
      ...base,
      occasion: "Kỷ niệm của chúng mình",
      title: "Từng khoảnh khắc, đều muốn có em.",
      message:
        "Gửi em,\n\nCó những ngày trôi qua rất nhanh, nhưng những khoảnh khắc bên em thì anh luôn muốn giữ lại.\n\nLà một buổi chiều không hẹn trước. Là một chuyến đi nhỏ. Là lúc cả hai chẳng nói gì mà vẫn thấy thật vui.\n\nCảm ơn em đã cùng anh tạo nên những kỷ niệm này. Mình sẽ còn thật nhiều ngày như thế nữa nhé.\n\nThương những ngày có em.",
    };
  if (theme === "vinyl")
    return {
      ...base,
      occasion: "Một ngày bình thường, có thương",
      title: "Bản nhạc này, chỉ dành cho em.",
    };
  return base;
}
