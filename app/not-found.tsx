import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <span className="brand">thương✳</span>
      <h1>Món quà đang ở đâu đó…</h1>
      <p>Đường dẫn này chưa đúng hoặc món quà không còn trên máy chủ.</p>
      <Link className="button primary" href="/">
        Về nhà Thương ↗
      </Link>
    </main>
  );
}
