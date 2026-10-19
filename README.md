# Thương — Gift Studio

Website quà tặng nhiều dịp bằng **Next.js 16 App Router, React 19, TypeScript và Three.js**.

## Chạy cục bộ

Node.js 20.9 trở lên:

```sh
npm install
npm run dev
```

Mở http://localhost:3000. Production: `npm run build` rồi `npm start`.

## Bộ sưu tập

9 mẫu theo các link **Xem mẫu** trên trang chủ [DLove](https://dlove.vn/). Ảnh bìa thật; mỗi mẫu có renderer riêng. Link đối chiếu trong `lib/templates.ts` và cửa sổ preview.

| Mẫu | Route | Trải nghiệm |
|---|---|---|
| Bó hoa kỷ niệm | `/mau/bo-hoa-anh` | Hoa hé lộ 6 ảnh, giữ 500 ms, mưa chữ/ảnh/tim 3D, phong bì và thư viết dần |
| Vườn hoa | `/mau/garden` | Cổng hoa, vườn 360° máy tính hoặc đường đi chiều sâu điện thoại, chọn người, bó hoa, thư, phim ảnh |
| Ngày đặc biệt | `/mau/wishes` | Giữ vân tay, lời chúc biến hình bằng hạt, ảnh kết hạt, quả cầu ảnh |
| Thiên Hà Tình Yêu | `/mau/galaxy` | Giữ 1,5 giây, chữ/ảnh rơi CSS 3D, kéo/xoay/zoom, chạm đôi thành tim hạt |
| Đếm ngày yêu | `/mau/valentine` | Màn hình điện thoại, tin nhắn lần lượt, giữ vân tay, đếm ngày, tim và cầu ảnh |
| Sinh nhật | `/mau/birthday` | Matrix chữ hồng, đếm ngược/chữ bằng hạt, GIF mèo và tim bay |
| Trung Thu | `/mau/moon` | Trăng, núi, thỏ, đèn lồng, chữ/ảnh bay lên |
| Trung Thu VIP | `/mau/moon-vip` | Poster nhiều lớp theo layout gốc, giữ trăng, cảnh 3D, nguyệt thư, tim hạt vàng |
| Tinh Cầu Tình Yêu | `/mau/planet` | Quả cầu/vành đai hạt, ảnh trên quỹ đạo, orbit/zoom, chuyến bay camera |

Đây là **bản dựng lại trong Next.js**, không nhúng iframe hoặc thực thi bundle DLove. Chưa xác nhận khớp 100% từng khung hình. Mật độ hạt, shader, bố trí và một số chuyển cảnh được triển khai lại; luồng khóa bằng mật mã của nguồn chưa được dựng. Thư mặc định dùng lời chúc mới, có thể chỉnh sửa.

Ba link **Sinh nhật, Trung Thu cũ, Tinh cầu** trả lỗi không tìm thấy cấu hình khi kiểm tra 18/10/2026. Những mẫu này dùng nội dung/tài nguyên mặc định template; không coi nhạc mặc định là bài tùy chỉnh của link đã mất. Thẻ mẫu ghi rõ tình trạng.

## Nhạc và tài nguyên

Các demo còn dữ liệu dùng đúng file MP3 được cấu hình, lưu cục bộ: bó hoa, vườn hoa, thiên hà, ngày đặc biệt, đếm ngày yêu, Trung Thu VIP. Không suy đoán ca sĩ khi file thiếu ID3. Nguồn trong `ASSETS.md`, `public/dlove/source-manifest.json`, `public/dlove/catalog-provenance.json`.

Nguồn đọc đối chiếu tại `output/` đã loại khỏi Git; ứng dụng không thực thi chúng. Ảnh bìa tối ưu WebP. Cảnh nặng dùng dynamic imports; tài nguyên Three được giải phóng khi đóng preview.

## Tạo và lưu quà

Thiệp riêng 20/10 của **Khoa Tin học và Ngoại ngữ** nằm tại `/20-10`; trang tải/in QR tại `/20-10/qr`. Nội dung và ảnh được đóng gói sẵn cùng source, không dùng API ghi file nên đường dẫn này hoạt động trên Vercel. QR trỏ tới `https://thiep-mung-ebon.vercel.app/20-10`. Tài nguyên ở `public/dedications/faculty-20-10/`; có PNG/SVG QR riêng và bảng QR để in. Kiểm tra mã bằng `npm run verify:faculty`. Thiệp có sáu ảnh các cô và bướm bay quanh bó hoa, tiếp tục bay khi vào mưa ảnh. Ảnh cô Hà Thi được ImageGen tích hợp bỏ người đứng cạnh và khôi phục nền sân trường, hiển thị trong cùng kiểu khung với các cô khác; năm ảnh còn lại chỉ xoay EXIF và tối ưu dung lượng. Mưa ảnh không chứa cờ, có 33 câu chúc và 8 lời chúc lớn luân phiên, tông hồng kem và chuyển động nhẹ.

Có thể thay lời chúc, người gửi/nhận, ảnh và nhạc. Bó hoa tối đa 6 ảnh; mẫu khác tối đa 12. PNG/WebP giữ nền trong suốt; ảnh được giảm kích thước tại trình duyệt. Nhạc riêng tối đa 5 MB, phát sau tương tác, có nút bật/tắt.

Quà lưu JSON tại `.data/gifts/`, link `/gift/<uuid>` và QR. Nháp/danh sách quà lưu localStorage. Link localhost mở trên máy chạy ứng dụng. Để gửi qua Internet cần Node.js, HTTPS và ổ lưu trữ bền vững; dùng database/object storage nếu serverless. Ai có link đều mở được. Chưa có đăng nhập hoặc thanh toán.

## Kiểm tra

```sh
npm run typecheck
npm run build
node scripts/check-catalog.mjs
```

Smoke check cần server localhost:3000: kiểm tra 9 route demo, API tạo quà, dữ liệu đã lưu và trang quà. Tự xóa các file thử vừa tạo, giữ nguyên quà có sẵn. Browser QA đã mở được bó hoa, vườn hoa và poster Trung Thu VIP. Kiểm tra toàn bộ tương tác/viewport các mẫu mới chưa hoàn tất do kết nối trình duyệt gián đoạn.

