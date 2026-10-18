"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Flower2,
  Gift as GiftIcon,
  Heart,
  Headphones,
  Menu,
  Music2,
  Pause,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { Artwork } from "./artwork";
import { GiftEditor, type SavedGift } from "./gift-editor";
import { GiftExperience } from "./gift-experience";
import { Modal } from "./modal";
import { createGift, templates, tracks, type Theme } from "@/lib/templates";
export function Studio() {
  const [category, setCategory] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("curated");
  const [editor, setEditor] = useState<Theme | null>(null);
  const [preview, setPreview] = useState<Theme | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [saved, setSaved] = useState<SavedGift[]>([]);
  const [playing, setPlaying] = useState("");
  const [audioError, setAudioError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("thuong-gifts") || "[]");
      if (Array.isArray(data))
        setSaved(
          data.filter(
            (item) =>
              typeof item.id === "string" &&
              typeof item.recipient === "string" &&
              templates.some((t) => t.id === item.theme),
          ),
        );
    } catch {}
    return () => {
      audio.current?.pause();
    };
  }, []);
  function stopMusic() {
    audio.current?.pause();
    setPlaying("");
  }
  function openEditor(theme: Theme) {
    stopMusic();
    setEditor(theme);
  }
  function openPreview(theme: Theme) {
    stopMusic();
    setPreview(theme);
  }
  async function listen(id: string) {
    if (playing === id) {
      stopMusic();
      return;
    }
    stopMusic();
    const track = tracks.find((t) => t.id === id)!;
    const el = new Audio(track.src);
    audio.current = el;
    el.onended = () => setPlaying("");
    el.onerror = () => {
      setPlaying("");
      setAudioError("Chưa tải được nhạc. Bạn thử lại nhé.");
    };
    try {
      await el.play();
      setPlaying(id);
      setAudioError("");
    } catch {
      setAudioError("Bạn chạm nút phát một lần nữa nhé.");
    }
  }
  function saveGift(item: SavedGift) {
    const items = [item, ...saved];
    setSaved(items);
    try {
      localStorage.setItem("thuong-gifts", JSON.stringify(items));
    } catch {}
  }
  const shown = templates
    .filter(
      (t) =>
        (category === "Tất cả" || t.category === category) &&
        `${t.title} ${t.description} ${t.category}`
          .toLocaleLowerCase("vi")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .includes(
            query
              .toLocaleLowerCase("vi")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d"),
          ),
    )
    .sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title, "vi") : 0));
  const faqs = [
    {
      q: "Mình có cần biết thiết kế hay lập trình không?",
      a: "Không cần đâu. Bạn chỉ việc chọn một mẫu, viết lời chúc, thêm ảnh và chọn nhạc. Thương sẽ gói những điều ấy thành một món quà có đường dẫn và mã QR riêng.",
    },
    {
      q: "Người nhận mở quà trên điện thoại được chứ?",
      a: "Có. Các mẫu được thiết kế cho cả điện thoại và máy tính. Người nhận mở đường dẫn, chạm vào món quà để bắt đầu trải nghiệm cùng âm nhạc.",
    },
    {
      q: "Nhạc có tự phát khi mở đường dẫn không?",
      a: "Nhạc bắt đầu sau khi người nhận chạm “Mở quà”, theo cách trình duyệt cho phép phát âm thanh. Luôn có nút tạm dừng và phát lại ở góc màn hình.",
    },
    {
      q: "Món quà được lưu ở đâu?",
      a: "Nội dung được lưu trên máy chủ đang chạy website; danh sách quà và bản nháp lưu trong trình duyệt của bạn. Khi chạy localhost, link dùng trên máy này. Để gửi qua Internet, cần đưa ứng dụng lên máy chủ có ổ lưu trữ bền vững.",
    },
  ];
  return (
    <>
      <div className="announcement">
        <Flower2 size={14} />
        <span>Một món quà cho mọi dịp yêu thương</span>
        <span className="announcement-dot">·</span>
        <a href="#collection">
          Sinh nhật · Kỷ niệm · Ngày lễ <ArrowUpRight size={12} />
        </a>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#" className="brand" aria-label="Thương — trang chủ">
            thương<span>✳</span>
            <small>GIFT STUDIO</small>
          </a>
          <nav
            className={menuOpen ? "nav-links mobile-open" : "nav-links"}
            aria-label="Điều hướng chính"
          >
            <a
              href="#collection"
              className="active"
              onClick={() => setMenuOpen(false)}
            >
              Bộ sưu tập
            </a>
            <a href="#music" onClick={() => setMenuOpen(false)}>
              Góc âm nhạc
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              Cách tạo quà
            </a>
          </nav>
          <div className="header-actions">
            <button className="saved-button" onClick={() => setSavedOpen(true)}>
              <Heart size={17} />
              <span>Quà của bạn</span>
              {saved.length > 0 && <b>{saved.length}</b>}
            </button>
            <button
              className="button primary header-cta"
              onClick={() => openEditor("bloom")}
            >
              Tạo món quà <ArrowUpRight size={16} />
            </button>
            <button
              className="mobile-menu icon-button"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="tiny-flower">✳</span> DÀNH CHO NHỮNG ĐIỀU KHÓ
              NÓI THÀNH LỜI
            </div>
            <h1>
              Gói một chút quà.
              <br />
              Gửi cả <em>yêu thương.</em>
              <span className="heading-heart">♡</span>
            </h1>
            <p>
              Một bông hoa, một lá thư, một bản nhạc.
              <br />
              Biến những điều giản dị thành món quà
              <br className="desktop-break" /> chỉ thuộc về người bạn thương.
            </p>
            <div className="hero-actions">
              <a href="#collection" className="button primary">
                Tìm món quà của bạn <ArrowUpRight size={18} />
              </a>
              <button
                className="hero-preview"
                onClick={() => openPreview("bloom")}
              >
                <span>
                  <Play size={13} fill="currentColor" />
                </span>{" "}
                Xem một chút thương
              </button>
            </div>
            <div className="hero-note">
              <span className="note-drawn-arrow">⤴</span> Không cần khéo tay.
              Chỉ cần thật lòng.
            </div>
            <div className="hero-benefits">
              <span>
                <Check size={13} /> Cá nhân hoá theo bạn
              </span>
              <span>
                <Check size={13} /> Mở đẹp trên mọi màn hình
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-arch">
              <img
                className="hero-bouquet"
                src="/images/bouquet.png"
                alt="Bó mẫu đơn và hoa hồng hồng phấn, gói cùng một lá thư và phong bì"
                fetchPriority="high"
              />
              <div className="hero-image-wash" />
              <span className="hero-image-script">
                a little gift,
                <br />a lot of love.
              </span>
            </div>
            <div className="hero-date">
              <span>20</span>
              <i>tháng mười</i>
              <small>FOR THE WOMEN WE LOVE</small>
            </div>
            <span className="hero-star star-a">✧</span>
            <span className="hero-star star-b">✳</span>
            <div className="floating-note">
              <span className="note-pin" />
              <Heart size={19} />
              <span>Gửi em,</span>
              <p>
                Cảm ơn vì đã làm
                <br />
                thế giới này dịu dàng hơn.
              </p>
              <small>with all my love ♡</small>
            </div>
            <button
              className={`hero-music ${playing === "piano" ? "active" : ""}`}
              onClick={() => listen("piano")}
              aria-label={
                playing === "piano"
                  ? "Tạm dừng nhạc Một chiều dịu dàng"
                  : "Nghe Một chiều dịu dàng"
              }
            >
              <span className="hero-music-icon">
                {playing === "piano" ? (
                  <Pause size={16} />
                ) : (
                  <Music2 size={18} />
                )}
              </span>
              <span>
                Một chút nhạc, một chút thương
                <small>Một chiều dịu dàng · Piano</small>
              </span>
              <span
                className={`sound-bars ${playing === "piano" ? "animate" : ""}`}
              >
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </section>
        <div className="sentiment-strip">
          <span>CHO MẸ, CHO EM, CHO MỘT NGƯỜI ĐẶC BIỆT</span>
          <Flower2 size={18} />
          <span>NHỮNG MÓN QUÀ CÓ THỂ CHẠM ĐẾN TRÁI TIM</span>
          <Flower2 size={18} />
          <span>MỘT ĐƯỜNG DẪN, THẬT NHIỀU YÊU THƯƠNG</span>
        </div>
        <section id="collection" className="collection container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span /> ĐƯỢC GÓI GHÉM BẰNG CẢ TRÁI TIM
              </span>
              <h2>
                Mỗi món quà, <em>một cách thương.</em>
              </h2>
              <p>
                Chọn một chiếc mẫu hợp lòng. Phần còn lại, để cảm xúc của bạn
                kể.
              </p>
            </div>
            <div className="collection-side-note">
              a little something
              <br />
              <span>for your someone ♡</span>
            </div>
          </div>
          <div className="collection-toolbar">
            <div className="category-tabs" aria-label="Lọc theo dịp">
              {[
                "Tất cả",
                "20/10",
                "Tình yêu",
                "Sinh nhật",
                "Kỷ niệm",
                "Trung Thu",
              ].map((c, i) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  className={category === c ? "active" : ""}
                  onClick={() => setCategory(c)}
                >
                  {i === 0 ? (
                    <Sparkles size={15} />
                  ) : i === 1 ? (
                    <Flower2 size={15} />
                  ) : i === 2 ? (
                    <Heart size={15} />
                  ) : i === 3 ? (
                    <GiftIcon size={15} />
                  ) : (
                    <span className="tab-star">✧</span>
                  )}
                  {c}
                  {c === "20/10" && <span className="tab-dot" />}
                </button>
              ))}
            </div>
            <label className="search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm một chút thương…"
                aria-label="Tìm mẫu quà"
              />
              {query && (
                <button aria-label="Xóa tìm kiếm" onClick={() => setQuery("")}>
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
          <div className="collection-meta">
            <span>
              {shown.length} mẫu quà tặng <i>·</i> Tự tay làm, theo cách của bạn
            </span>
            <label>
              <SlidersHorizontal size={13} />
              <select
                aria-label="Sắp xếp mẫu"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="curated">Thương tuyển chọn</option>
                <option value="az">Tên mẫu A–Z</option>
              </select>
              <ChevronDown size={13} />
            </label>
          </div>
          <div className="template-grid">
            {shown.map((t) => (
              <article className="template-card" key={t.id}>
                <div className="template-art">
                  <button
                    className="art-open"
                    aria-label={`Xem mẫu ${t.title}`}
                    onClick={() => openPreview(t.id)}
                  >
                    <Artwork theme={t.id} />
                  </button>
                  <span className={`template-badge badge-${t.id}`}>
                    {t.id === "bloom" && (
                      <Heart size={10} fill="currentColor" />
                    )}
                    {t.tag}
                  </span>
                  <button
                    className="template-audio"
                    aria-label={`Nghe nhạc mẫu ${t.title}`}
                    onClick={() => listen(t.music)}
                  >
                    {playing === t.music ? (
                      <Pause size={14} />
                    ) : (
                      <Headphones size={14} />
                    )}
                  </button>
                  <button
                    className="art-preview-button"
                    onClick={() => openPreview(t.id)}
                  >
                    <Play size={13} /> Trải nghiệm mẫu
                  </button>
                </div>
                <div className="template-info">
                  <div className="template-title-row">
                    <h3>{t.title}</h3>
                    <span>{t.number}</span>
                  </div>
                  <p>{t.description}</p>
                  {t.status && (
                    <small className="source-status">{t.status}</small>
                  )}
                  <div className="template-footer">
                    <span>
                      <Music2 size={13} /> Có nhạc & hiệu ứng
                    </span>
                    <button onClick={() => openEditor(t.id)}>
                      Chọn mẫu <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {shown.length === 0 && (
            <div className="empty-state">
              <Flower2 size={36} />
              <h3>Chưa tìm thấy món quà này</h3>
              <p>Thử một từ khóa khác, hoặc khám phá tất cả mẫu nhé.</p>
              <button
                className="button secondary"
                onClick={() => {
                  setCategory("Tất cả");
                  setQuery("");
                }}
              >
                Xem tất cả mẫu
              </button>
            </div>
          )}
          <div className="collection-bottom">
            <Heart size={14} />
            <span>
              Mẫu nào cũng có thể trở thành một câu chuyện rất riêng của bạn.
            </span>
          </div>
        </section>
        <section id="music" className="music-section">
          <div className="container music-layout">
            <div className="music-copy">
              <span className="eyebrow">
                <Headphones size={15} /> MỘT GIAI ĐIỆU, NGÀN CẢM XÚC
              </span>
              <h2>
                Có những điều,
                <br />
                <em>để âm nhạc nói.</em>
              </h2>
              <p>
                Thêm một giai điệu vào món quà.
                <br />
                Để khoảnh khắc mở ra, cũng là lúc cảm xúc chạm đến.
              </p>
              <span className="music-handwritten">
                press play, feel a little more ♡
              </span>
            </div>
            <div className="music-player">
              <div className="music-player-heading">
                <span>GÓC NHẠC CỦA THƯƠNG</span>
                <Music2 size={17} />
              </div>
              {tracks.map((t, i) => (
                <div
                  key={t.id}
                  className={`music-row ${playing === t.id ? "playing" : ""}`}
                >
                  <span className="track-number">0{i + 1}</span>
                  <div
                    className={`track-cover cover-${t.id}`}
                    style={{ background: t.color }}
                  >
                    {i === 0 ? (
                      <Flower2 size={24} />
                    ) : i === 1 ? (
                      <Sparkles size={24} />
                    ) : (
                      <Music2 size={24} />
                    )}
                  </div>
                  <div className="track-name">
                    <strong>{t.title}</strong>
                    <small>{t.genre}</small>
                  </div>
                  <span className="track-duration">{t.duration}</span>
                  <button
                    className="track-play"
                    aria-label={`${playing === t.id ? "Tạm dừng" : "Nghe"} ${t.title}`}
                    onClick={() => listen(t.id)}
                  >
                    {playing === t.id ? (
                      <Pause size={17} />
                    ) : (
                      <Play size={17} />
                    )}
                  </button>
                </div>
              ))}
              <p className="music-player-note">
                <Check size={12} /> Nhạc từ mẫu DLove và ba bản không lời · Bạn
                cũng có thể thêm nhạc riêng
              </p>
              {audioError && (
                <p role="alert" className="form-error">
                  {audioError}
                </p>
              )}
            </div>
          </div>
        </section>
        <section id="how-it-works" className="how-section container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TỪ BẠN, ĐẾN NGƯỜI THƯƠNG</span>
              <h2>
                Ba bước nhỏ. <em>Một niềm vui lớn.</em>
              </h2>
            </div>
            <a href="#collection" className="text-link">
              Bắt đầu gói quà <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="steps-grid">
            {[
              {
                icon: <Flower2 />,
                title: "Chọn một chiếc mẫu",
                text: "Lãng mạn, dịu dàng hay một chút bất ngờ. Chọn cách thương giống bạn nhất.",
              },
              {
                icon: <WandSparkles />,
                title: "Thêm một chút riêng",
                text: "Một lời nhắn thật lòng, những tấm ảnh kỷ niệm và bản nhạc hai người cùng thích.",
              },
              {
                icon: <SendIcon />,
                title: "Gửi cả một tấm lòng",
                text: "Nhận đường dẫn và mã QR riêng. Gửi đi, rồi chờ một nụ cười thật xinh.",
              },
            ].map((s, i) => (
              <div className="step" key={s.title}>
                <div className="step-top">
                  <span className="step-icon">{s.icon}</span>
                  <span className="step-number">0{i + 1}</span>
                  {i < 2 && <span className="step-line" />}
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="closing-section container">
          <div className="closing-art">
            <Flower2 strokeWidth={0.8} />
            <span>♡</span>
          </div>
          <span className="eyebrow">VÌ YÊU THƯƠNG XỨNG ĐÁNG ĐƯỢC NÓI RA</span>
          <h2>
            Có một người đang chờ
            <br />
            <em>một chút thương từ bạn.</em>
          </h2>
          <p>Không cần một dịp thật lớn. Chỉ cần một người thật quan trọng.</p>
          <button
            className="button primary"
            onClick={() => openEditor("bloom")}
          >
            Gói món quà đầu tiên <ArrowUpRight size={17} />
          </button>
          <span className="closing-script">
            made with love, sent with thương.
          </span>
        </section>
        <section className="faq-section container">
          <div>
            <span className="eyebrow">BẠN CÓ THỂ ĐANG TÒ MÒ</span>
            <h2>
              Một vài điều <em>nho nhỏ.</em>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((item, i) => (
              <div
                key={item.q}
                className={`faq-item ${faq === i ? "open" : ""}`}
              >
                <button
                  aria-expanded={faq === i}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {item.q}
                  <span>{faq === i ? "−" : "+"}</span>
                </button>
                {faq === i && <p>{item.a}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer container">
        <div>
          <a className="brand" href="#">
            thương<span>✳</span>
          </a>
          <p>Gói ghém những điều thương.</p>
        </div>
        <span>Được tạo bằng sự dịu dàng và một chút phép màu.</span>
        <a href="#collection">
          Gửi một chút thương <ArrowUpRight size={15} />
        </a>
        <small>© {new Date().getFullYear()} Thương Studio</small>
      </footer>
      {editor && (
        <GiftEditor
          theme={editor}
          onClose={() => setEditor(null)}
          onSaved={saveGift}
        />
      )}
      {preview && (
        <Modal
          title={`Trải nghiệm ${templates.find((t) => t.id === preview)!.title}`}
          onClose={() => setPreview(null)}
          className="preview-modal"
        >
          <GiftExperience gift={createGift(preview)} embedded />
          <div className="preview-action-bar">
            <span>
              <a href={`/mau/${preview}`} target="_blank" rel="noreferrer">
                Mở toàn màn hình ↗
              </a>{" "}
              ·{" "}
              <a
                href={templates.find((t) => t.id === preview)?.reference}
                target="_blank"
                rel="noreferrer"
              >
                Đối chiếu demo DLove ↗
              </a>
            </span>
            <button
              className="button primary"
              onClick={() => {
                const t = preview;
                setPreview(null);
                openEditor(t);
              }}
            >
              Tạo quà với mẫu này <ArrowUpRight size={16} />
            </button>
          </div>
        </Modal>
      )}
      {savedOpen && (
        <Modal
          title="Quà của bạn"
          onClose={() => setSavedOpen(false)}
          className="saved-modal"
        >
          <span className="eyebrow">NHỮNG ĐIỀU THƯƠNG ĐÃ GỬI</span>
          <h2>Chiếc hộp kỷ niệm.</h2>
          {saved.length === 0 ? (
            <div className="empty-state">
              <GiftIcon size={42} />
              <p>
                Chưa có món quà nào trong chiếc hộp này.
                <br />
                Mình cùng tạo một điều dịu dàng nhé?
              </p>
              <button
                className="button primary"
                onClick={() => {
                  setSavedOpen(false);
                  openEditor("bloom");
                }}
              >
                Tạo món quà đầu tiên <ArrowUpRight size={16} />
              </button>
            </div>
          ) : (
            <div className="saved-list">
              {saved.map((item) => (
                <a
                  key={item.id}
                  href={`/gift/${item.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="saved-gift-icon">
                    <Heart size={20} />
                  </span>
                  <span>
                    <strong>Gửi {item.recipient}</strong>
                    <small>
                      {templates.find((t) => t.id === item.theme)?.title} ·{" "}
                      {new Date(item.created).toLocaleDateString("vi-VN")}
                    </small>
                  </span>
                  <ArrowUpRight size={20} />
                </a>
              ))}
            </div>
          )}
          <p className="saved-note">Danh sách được lưu trên trình duyệt này.</p>
        </Modal>
      )}
    </>
  );
}
function SendIcon() {
  return <ArrowUpRight />;
}
