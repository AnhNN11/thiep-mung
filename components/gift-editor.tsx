"use client";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ArrowUpRight,
  Copy,
  Download,
  Eye,
  Heart,
  ImagePlus,
  LoaderCircle,
  Music2,
  Pause,
  Play,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import QRCode from "qrcode";
import { Artwork } from "./artwork";
import { GiftExperience } from "./gift-experience";
import { Modal } from "./modal";
import {
  createGift,
  templates,
  tracks,
  photoLimit,
  type Gift,
  type Theme,
} from "@/lib/templates";
export type SavedGift = {
  id: string;
  recipient: string;
  theme: Theme;
  created: string;
};
const readData = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
async function compressPhoto(file: File) {
  const data = await readData(file);
  const image = new Image();
  image.src = data;
  await image.decode();
  const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);
  return file.type === "image/png" || file.type === "image/webp"
    ? canvas.toDataURL("image/webp", 0.86)
    : canvas.toDataURL("image/jpeg", 0.82);
}
export function GiftEditor({
  theme,
  onClose,
  onSaved,
}: {
  theme: Theme;
  onClose: () => void;
  onSaved: (gift: SavedGift) => void;
}) {
  const [gift, setGift] = useState<Gift>(createGift(theme));
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState("");
  const [customName, setCustomName] = useState("");
  const [ready, setReady] = useState(false);
  const sound = useRef<HTMLAudioElement | null>(null);
  const successView = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (result) successView.current?.closest("dialog")?.scrollTo({ top: 0 });
  }, [result]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`thuong-draft-source-v3-${theme}`);
      if (raw) {
        const draft = JSON.parse(raw);
        if (
          draft.theme === theme &&
          typeof draft.message === "string" &&
          Array.isArray(draft.photos)
        )
          setGift(draft);
      }
    } catch {}
    setReady(true);
    return () => {
      sound.current?.pause();
    };
  }, [theme]);
  useEffect(() => {
    if (!ready) return;
    try {
      const { music, ...rest } = gift;
      localStorage.setItem(
        `thuong-draft-source-v3-${theme}`,
        JSON.stringify({
          ...rest,
          music: music.startsWith("data:") ? "piano" : music,
        }),
      );
    } catch {}
  }, [gift, theme, ready]);
  function update<K extends keyof Gift>(key: K, value: Gift[K]) {
    setGift((g) => ({ ...g, [key]: value }));
    setError("");
  }
  function stop() {
    sound.current?.pause();
    setPlaying("");
  }
  async function listen(id: string, src: string) {
    if (playing === id) {
      stop();
      return;
    }
    stop();
    const el = new Audio(src);
    sound.current = el;
    el.onended = () => setPlaying("");
    el.onerror = () => {
      setError("Chưa phát được bản nhạc. Bạn thử lại nhé.");
      setPlaying("");
    };
    try {
      await el.play();
      setPlaying(id);
    } catch {
      setError("Trình duyệt chưa phát được âm thanh. Bạn thử lại nhé.");
    }
  }
  async function photos(files: FileList | null) {
    if (!files?.length) return;
    if (files.length + gift.photos.length > photoLimit(theme)) {
      setError(
        `Mẫu này có tối đa ${photoLimit(theme)} ảnh. Bạn có thể xóa ảnh mẫu trước nhé.`,
      );
      return;
    }
    setProcessing(true);
    try {
      const items = await Promise.all(
        Array.from(files).map((file) => {
          if (
            !/^image\/(jpeg|png|webp)$/.test(file.type) ||
            file.size > 15 * 1024 * 1024
          )
            throw new Error(
              "Hãy chọn ảnh JPG, PNG hoặc WebP, tối đa 15 MB mỗi ảnh.",
            );
          return compressPhoto(file);
        }),
      );
      update("photos", [...gift.photos, ...items]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không đọc được ảnh này.");
    }
    setProcessing(false);
  }
  async function uploadMusic(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("audio/") || file.size > 5 * 1024 * 1024) {
      setError("Hãy chọn một file âm thanh tối đa 5 MB.");
      return;
    }
    try {
      const data = await readData(file);
      update("music", data);
      setCustomName(file.name);
      stop();
    } catch {
      setError("Chưa đọc được file nhạc.");
    }
  }
  async function save() {
    if (
      ![gift.recipient, gift.sender, gift.title, gift.message].every((x) =>
        x.trim(),
      )
    ) {
      setStep(0);
      setError(
        "Bạn hãy điền đầy đủ người nhận, người gửi, tiêu đề và lời chúc nhé.",
      );
      return;
    }
    setSaving(true);
    stop();
    setError("");
    try {
      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gift),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const url = `${window.location.origin}${data.path}`;
      setResult(url);
      const saved = {
        id: data.id,
        recipient: gift.recipient,
        theme,
        created: new Date().toISOString(),
      };
      onSaved(saved);
      try {
        setQr(
          await QRCode.toDataURL(url, {
            margin: 2,
            width: 400,
            color: { dark: "#603b46", light: "#fffdf9" },
          }),
        );
      } catch {}
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Chưa kết nối được máy chủ. Bạn thử lại nhé.",
      );
    }
    setSaving(false);
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    } catch {
      setError("Bạn có thể chọn và sao chép đường dẫn bên dưới.");
    }
  }
  return (
    <Modal
      title="Tạo món quà của bạn"
      onClose={onClose}
      className="editor-modal"
    >
      {result ? (
        <div className="gift-success" ref={successView}>
          <span className="success-check">
            <Check size={29} />
          </span>
          <span className="eyebrow">MỘT CHÚT THƯƠNG ĐÃ SẴN SÀNG</span>
          <h2>
            Đem yêu thương
            <br />
            gửi đến {gift.recipient}.
          </h2>
          <p>
            Món quà đã được lưu. Gửi đường dẫn hoặc mã QR
            <br />
            để người thương chạm vào bất ngờ của bạn.
          </p>
          {qr && <img className="qr-code" src={qr} alt="Mã QR mở món quà" />}
          <label className="share-link-label">
            Đường dẫn món quà
            <input
              readOnly
              value={result}
              onFocus={(e) => e.currentTarget.select()}
            />
          </label>
          <div className="success-actions">
            <button className="button primary" onClick={copyLink}>
              {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
              {copied ? "Đã sao chép" : "Sao chép link"}
            </button>
            {qr && (
              <a
                className="button secondary"
                href={qr}
                download="mot-chut-thuong-qr.png"
              >
                <Download size={17} /> Lưu QR
              </a>
            )}
          </div>
          <a
            className="text-link"
            href={result}
            target="_blank"
            rel="noreferrer"
          >
            Mở món quà <ArrowUpRight size={16} />
          </a>
          <small className="local-sharing-note">
            Link dùng địa chỉ máy chủ hiện tại. Khi chạy localhost, chỉ mở được
            trên máy này.
          </small>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="editor-header">
            <span className="eyebrow">XƯỞNG GÓI GHÉM YÊU THƯƠNG</span>
            <h2>Một món quà, mang dấu ấn bạn.</h2>
            <p>
              Chọn từng chi tiết nhỏ. Để người nhận thấy mình thật đặc biệt.
            </p>
          </div>
          <div className="editor-layout">
            <div className="editor-form">
              <div className="editor-steps">
                {["Lời thương", "Kỷ niệm", "Âm nhạc"].map((name, i) => (
                  <button
                    key={name}
                    className={step === i ? "active" : ""}
                    onClick={() => {
                      setStep(i);
                      stop();
                    }}
                  >
                    <span>{i + 1}</span>
                    {name}
                  </button>
                ))}
              </div>
              {step === 0 && (
                <div className="form-fields">
                  <div className="field-row">
                    <label>
                      Gửi đến{" "}
                      <input
                        maxLength={80}
                        value={gift.recipient}
                        onChange={(e) => update("recipient", e.target.value)}
                        placeholder="Tên người thương"
                      />
                    </label>
                    <label>
                      Từ{" "}
                      <input
                        maxLength={80}
                        value={gift.sender}
                        onChange={(e) => update("sender", e.target.value)}
                        placeholder="Tên của bạn"
                      />
                    </label>
                  </div>
                  <label>
                    Nhân một ngày đặc biệt
                    <select
                      value={gift.occasion}
                      onChange={(e) => update("occasion", e.target.value)}
                    >
                      <option>Ngày Phụ nữ Việt Nam · 20/10</option>
                      <option>Một ngày bình thường, có thương</option>
                      <option>Chúc mừng sinh nhật</option>
                      <option>Kỷ niệm của chúng mình</option>
                      <option>Happy Valentine · 14/02</option>
                    </select>
                  </label>
                  <label>
                    Lời mở đầu
                    <input
                      maxLength={140}
                      value={gift.title}
                      onChange={(e) => update("title", e.target.value)}
                    />
                  </label>
                  <label>
                    Những điều muốn nói
                    <textarea
                      rows={8}
                      maxLength={4000}
                      value={gift.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                    <small className="field-count">
                      {gift.message.length}/4000 · Viết từ trái tim là đủ đẹp
                      rồi.
                    </small>
                  </label>
                </div>
              )}
              {step === 1 && (
                <div className="photo-form">
                  <h3>Những khoảnh khắc muốn giữ</h3>
                  <p>
                    Thêm tối đa {photoLimit(theme)} ảnh. Ảnh sẽ xuất hiện trong
                    album và vũ trụ kỷ niệm.
                  </p>
                  <div className="photo-grid">
                    {gift.photos.map((photo, i) => (
                      <div key={i}>
                        <img src={photo} alt={`Ảnh ${i + 1}`} />
                        <button
                          aria-label={`Xóa ảnh ${i + 1}`}
                          onClick={() =>
                            update(
                              "photos",
                              gift.photos.filter((_, index) => index !== i),
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    {gift.photos.length < photoLimit(theme) && (
                      <label className="upload-photo">
                        {processing ? (
                          <LoaderCircle className="spin" />
                        ) : (
                          <ImagePlus />
                        )}
                        <span>Thêm ảnh</span>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          disabled={processing}
                          onChange={(e) => {
                            void photos(e.target.files);
                            e.currentTarget.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <small>JPG, PNG, WebP · Ảnh được tối ưu tự động</small>
                  <div className="gentle-tip">
                    <Heart size={17} />
                    <span>
                      Dùng ảnh PNG hoặc WebP cắt nền cho bó hoa và khu vườn để
                      giữ nguyên dáng người.
                    </span>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="music-form">
                  <h3>Để âm nhạc nói cùng bạn</h3>
                  <p>Nghe thử và chọn giai điệu cho khoảnh khắc mở quà.</p>
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className={`editor-track ${gift.music === track.id ? "selected" : ""}`}
                    >
                      <button
                        className="track-play"
                        aria-label={`Nghe thử ${track.title}`}
                        onClick={() => listen(track.id, track.src)}
                      >
                        {playing === track.id ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} />
                        )}
                      </button>
                      <button
                        className="track-select"
                        onClick={() => update("music", track.id)}
                      >
                        <strong>{track.title}</strong>
                        <small>{track.genre}</small>
                      </button>
                      <button
                        className="radio-check"
                        aria-label={`Chọn ${track.title}`}
                        onClick={() => update("music", track.id)}
                      >
                        {gift.music === track.id && <Check size={15} />}
                      </button>
                    </div>
                  ))}
                  <label className="upload-music">
                    <Upload size={18} />
                    <span>
                      {gift.music.startsWith("data:")
                        ? customName || "Nhạc đã tải lên"
                        : "Hoặc tải bản nhạc của bạn"}
                      <small>File âm thanh · Tối đa 5 MB</small>
                    </span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        void uploadMusic(e.target.files?.[0]);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {gift.music.startsWith("data:") && (
                    <button
                      className="text-link"
                      onClick={() => listen("custom", gift.music)}
                    >
                      {playing === "custom" ? (
                        <Pause size={15} />
                      ) : (
                        <Play size={15} />
                      )}{" "}
                      Nghe nhạc đã chọn
                    </button>
                  )}
                  <small>Nhạc bắt đầu khi người nhận chạm mở quà.</small>
                </div>
              )}
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="editor-actions">
                {step > 0 ? (
                  <button
                    className="button secondary"
                    onClick={() => {
                      setStep(step - 1);
                      stop();
                    }}
                  >
                    <ChevronLeft size={17} /> Quay lại
                  </button>
                ) : (
                  <button
                    className="button secondary"
                    onClick={() => {
                      stop();
                      setPreview(true);
                    }}
                  >
                    <Eye size={17} /> Xem trước
                  </button>
                )}
                {step < 2 ? (
                  <button
                    className="button primary"
                    onClick={() => {
                      setStep(step + 1);
                      stop();
                    }}
                  >
                    Tiếp tục <ArrowUpRight size={17} />
                  </button>
                ) : (
                  <button
                    className="button primary"
                    disabled={saving || processing}
                    onClick={save}
                  >
                    {saving ? (
                      <LoaderCircle className="spin" size={17} />
                    ) : (
                      <Send size={17} />
                    )}{" "}
                    {saving ? "Đang gói quà…" : "Tạo link quà tặng"}
                  </button>
                )}
              </div>
              <span className="draft-note">
                <Check size={12} /> Lời chúc và ảnh được lưu nháp trên trình
                duyệt này
              </span>
            </div>
            <aside className="editor-summary">
              <div className="summary-preview">
                <Artwork theme={theme} />
                <span className="summary-overlay">
                  Gửi {gift.recipient || "người thương"}
                  <Heart size={17} />
                </span>
              </div>
              <span className="eyebrow">MẪU BẠN ĐANG CHỌN</span>
              <h3>{templates.find((t) => t.id === theme)!.title}</h3>
              <p>{gift.title}</p>
              <div className="summary-detail">
                <Music2 size={16} />
                {tracks.find((t) => t.id === gift.music)?.title ||
                  "Bản nhạc của bạn"}
              </div>
              <button
                className="text-link"
                onClick={() => {
                  stop();
                  setPreview(true);
                }}
              >
                <Eye size={16} /> Trải nghiệm món quà
              </button>
            </aside>
          </div>
        </>
      )}
      {preview && (
        <Modal
          title="Xem trước món quà"
          onClose={() => setPreview(false)}
          className="preview-modal"
        >
          <GiftExperience gift={gift} embedded />
        </Modal>
      )}
    </Modal>
  );
}
