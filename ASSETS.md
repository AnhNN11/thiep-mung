# Tài nguyên hình ảnh và âm thanh

## Thiệp Khoa Tin học và Ngoại ngữ

`public/dedications/faculty-20-10/`: ảnh cá nhân do người dùng cung cấp ngày 19/10/2026. Năm ảnh `photo-2.webp` đến `photo-6.webp` giữ nguyên nội dung, xoay theo EXIF và tối ưu WebP; không nhúng lại EXIF. Ảnh thứ sáu bổ sung từ ảnh cô cầm bó hoa được gửi trong lượt review local. `teacher-1-portrait.webp` là bản ImageGen tích hợp chỉnh sửa ảnh DSCF7656.JPG: bỏ người đứng cạnh, khôi phục nền sân trường và giữ ảnh cô Hà Thi có nền trong khung đồng bộ. Bản cutout trước đó được giữ làm nguồn lưu trữ, không dùng trong thiệp. Prompt đầy đủ ở README trong thư mục tài nguyên; ảnh xử lý AI có thể có khác biệt nhỏ.

Bướm bay dùng lại `public/dlove/bouquet/butterfly.webp`, hoạt ảnh đường bay và vỗ cánh bằng CSS; không ghép thêm hoặc chỉnh sửa nội dung ảnh gốc các cô. Có 18 bướm trên máy tính, 12 trên điện thoại, giảm chuyển động theo tùy chọn hệ thống.

`chibi-cac-co.png` (nền trong suốt) và bản WebP được tạo bằng ImageGen tích hợp theo sáu ảnh các cô, minh họa chibi với quân phục xanh, hoa hồng và bướm. Đây là tranh cách điệu từ ảnh tham chiếu. Prompt đầy đủ ở `public/dedications/faculty-20-10/chibi-prompt.txt`. `bang-qr-20-10-chibi.png` và SVG là bố cục in 1600 × 2264 px do `scripts/create-faculty-chibi-qr.mjs` tạo; dùng nguyên mã QR SVG tạo cục bộ, không nhờ AI vẽ mã. `verify:faculty` kiểm tra bảng chibi cả kích thước gốc, 800px và 400px.

Cờ Việt Nam vẽ SVG bằng mã: nền đỏ, một sao vàng năm cánh và ánh vải lụa; chỉ giữ ở đầu bó hoa, lá thư và bảng QR, không xuất hiện trong mưa ảnh. Thiệp có 33 câu chúc bay và 8 lời chúc lớn luân phiên. QR tạo cục bộ bằng `qrcode`, mức sửa lỗi H; các bản PNG mã riêng và bảng để in đều được giải mã lại bằng `jsqr` để xác nhận URL. `scripts/prepare-faculty-gift.mjs` là công cụ chuẩn bị asset trên máy nguồn; không cần chạy lại khi clone hoặc deploy vì các asset đã được commit.

## Ảnh hoa

File: `public/images/bouquet.png`. Tạo bằng công cụ ImageGen tích hợp, dùng cho hero trang chủ.

Prompt:

> Use case: product-mockup. Asset type: premium digital gift studio website floral hero photograph, square crop. Create a fine art editorial still life: a lush airy bouquet of soft blush pink garden roses, pale pink peonies, small white cosmos, baby's breath and delicate green foliage, wrapped in beautiful ivory paper with a dusty rose silk ribbon. A cream handwritten letter and a small pale rose envelope in the foreground. Scene on soft warm pale blush pink studio background with subtle natural sunlit shadows, romantic and refined, muted pastel tones, real exquisite petal detail, analog film grain, tactile materials, botanical luxury art direction, elegantly irregular silhouette. Composition bouquet centered with generous negative space around edges, flowers in upper two thirds, paper base in lower third. No text, no typography, no logo, no watermark. This is one photographic image, not a website mockup.

## Ảnh phong cảnh minh họa

- `public/images/memory-1.jpg`: https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1
- `public/images/memory-2.jpg`: https://images.unsplash.com/photo-1500534623283-312aade485b7

Ảnh mô tả kỷ niệm mẫu, không phải ảnh của người dùng hoặc lời chứng thực.

## Fonts

Be Vietnam Pro và Lora, tải từ Google Fonts. Các file được đóng gói tại `public/fonts/` và sử dụng qua `next/font/local`.

## Nhạc

### Mẫu bó hoa ảnh được yêu cầu đối chiếu

Nguồn cụ thể: https://i.dlove.vn/index.html?fc8e1763db7249b6

- `public/music/dlove-sample.mp3`: đúng tệp MP3 công khai được cấu hình cho thiệp trên; thời lượng đọc từ audio element là 47.066848 giây. Không suy đoán tên bài hát khi file không có ID3 title.
- `public/dlove/photos/`: sáu ảnh cắt nền trong bó hoa và mười ảnh bay của mẫu.
- `public/dlove/bouquet/`: giấy gói, cành lá, hoa, nơ và bướm từ các asset public của mẫu.
- `public/dlove/letter/`: các lớp phong bì, dấu sáp, texture giấy, hoa và nền watercolor của mẫu.
- `public/dlove/fonts/`: font Mali, Dancing Script và Allura được mẫu sử dụng.
- `public/dlove/heart.obj`: mô hình trái tim của mẫu; header gốc ghi tác giả Gustavo Belemmi.

Các tài nguyên này có nguồn DLove; khác với ảnh hero ImageGen và các bản nhạc tổng hợp bên dưới. Hồ sơ đường dẫn nguồn và SHA-256 của MP3 nằm trong `public/dlove/source-manifest.json`.

### Nhạc tổng hợp của bản đầu

`piano.wav`, `dream.wav`, `waltz.wav`: mỗi bản dài 48 giây, stereo PCM 22050 Hz. Tạo bằng tổng hợp âm, giai điệu và đệm hợp âm trong `scripts/create-music.mjs`. Không sao chép file âm thanh hoặc bản nhạc từ DLove.

## Các demo trên trang chủ DLove

- `public/dlove/thumbnails/*.webp`: ảnh bìa thật trong danh mục DLove, tối ưu WebP. Tệp tải ban đầu trong cùng thư mục giữ nội dung gốc, đuôi local `.jpg` không nhất thiết là định dạng gốc.
- `public/dlove/garden/`: 12 cutout/12 ảnh gốc, 5 kỷ niệm, panorama, hoa/nơ/thỏ, cổng chào, giấy thư/phong bì, font. `background-music.mp3` là đúng upload được demo cấu hình (960515 bytes).
- `public/dlove/galaxy/`: đúng `eyenoselip.mp3`, ảnh và vân tay demo.
- `public/dlove/wishes/`: 10 ảnh cầu, ảnh hạt/thư; `music.mp3` từ `https://womens-day-deargift.vercel.app/musics/noinaycoanh.mp3`.
- `public/dlove/valentine/`: 7 ảnh cầu, nền/đại diện; `music.mp3` từ `https://valentine-deargift.vercel.app/musics/tinhyeugiuamuadong.mp3` (2863157 bytes, SHA256 `df9056e9c04fd40569510b91c91ed3c83d29bd0f54a11b46c59ecc5f4637d9d5`). File fallback chỉ tải đối chiếu, không phải track đang dùng.
- `public/dlove/birthday/`: GIF KIKI và `happy-birthday.mp3` mặc định; cấu hình link demo cũ không còn.
- `public/dlove/moon/`: trăng/thỏ/núi/đèn và nhạc mặc định `anhnangcuaanh.mp3`; không xác minh được bài riêng của link đã mất cấu hình.
- `public/dlove/moon-vip/`: layout mobile/desktop, ảnh lớp intro, giấy thư, 6 ảnh/cặp đôi, font và đúng nhạc `vuonhoaconca.mp3` demo.
- `public/dlove/planet/`: ảnh/nhạc/font/GLB mặc định Tinh cầu; nhạc `hukhong.mp3`. Cấu hình link cụ thể không còn.

Nhóm `public/dlove/` có nguồn từ các demo DLove/Deargift công khai được người dùng yêu cầu đối chiếu. URL chi tiết trong manifest JSON. Không coi các tài nguyên này là tài nguyên tự sáng tác. Bundle nguồn chỉ đọc đối chiếu, không được nhập vào ứng dụng.
