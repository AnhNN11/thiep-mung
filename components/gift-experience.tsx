"use client";
import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MailOpen,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { Artwork } from "./artwork";
import { PhotoBouquet } from "./photo-bouquet";
import dynamic from "next/dynamic";
import { tracks, type Gift } from "@/lib/templates";
const GalaxyExperience = dynamic(() =>
  import("./galaxy-experience").then((m) => m.GalaxyExperience),
);
const BirthdayExperience = dynamic(() =>
  import("./birthday-experience").then((m) => m.BirthdayExperience),
);
const MoonExperience = dynamic(() =>
  import("./moon-experience").then((m) => m.MoonExperience),
);
const WishesExperience = dynamic(() =>
  import("./wishes-experience").then((m) => m.WishesExperience),
);
const ValentineExperience = dynamic(() =>
  import("./valentine-experience").then((m) => m.ValentineExperience),
);
const PlanetExperience = dynamic(() =>
  import("./planet-experience").then((m) => m.PlanetExperience),
);
const GardenExperience = dynamic(() =>
  import("./garden-experience").then((m) => m.GardenExperience),
);
export function GiftExperience(props: { gift: Gift; embedded?: boolean }) {
  if (props.gift.theme === "bloom") return <PhotoBouquet {...props} />;
  if (props.gift.theme === "galaxy") return <GalaxyExperience {...props} />;
  if (props.gift.theme === "birthday") return <BirthdayExperience {...props} />;
  if (props.gift.theme === "moon" || props.gift.theme === "moon-vip")
    return <MoonExperience {...props} />;
  if (props.gift.theme === "wishes") return <WishesExperience {...props} />;
  if (props.gift.theme === "valentine")
    return <ValentineExperience {...props} />;
  if (props.gift.theme === "planet") return <PlanetExperience {...props} />;
  if (props.gift.theme === "garden") return <GardenExperience {...props} />;
  return <ClassicGiftExperience {...props} />;
}
function ClassicGiftExperience({
  gift,
  embedded = false,
}: {
  gift: Gift;
  embedded?: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [letter, setLetter] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [slide, setSlide] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const track = tracks.find((t) => t.id === gift.music);
  const source =
    track?.src ||
    (gift.music.startsWith("data:audio/") ? gift.music : tracks[0].src);
  const photos = gift.photos.length ? gift.photos : ["/images/memory-1.jpg"];
  useEffect(() => {
    setOpened(false);
    setOpening(false);
    setLetter(false);
    setSlide(0);
    setPlaying(false);
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
    };
  }, [gift.theme]);
  async function toggleMusic() {
    if (!audio.current) return;
    if (!audio.current.paused) {
      audio.current.pause();
    } else {
      try {
        await audio.current.play();
        setAudioError(false);
      } catch {
        setAudioError(true);
      }
    }
  }
  function openGift() {
    if (opening) return;
    setOpening(true);
    if (audio.current?.paused) void toggleMusic();
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 10
      : 1450;
    openTimer.current = setTimeout(() => {
      setOpened(true);
      setOpening(false);
      if (["letter", "surprise"].includes(gift.theme)) setLetter(true);
    }, delay);
  }
  return (
    <div
      className={`gift-experience experience-${gift.theme} ${embedded ? "embedded" : ""} ${opened ? "is-opened" : ""} ${opening ? "is-opening" : ""}`}
    >
      <audio
        ref={audio}
        src={source}
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setAudioError(true);
          setPlaying(false);
        }}
      />
      <div className="experience-top">
        <a href="/" className="experience-brand">
          thương<span>✳</span>
        </a>
        <span>{gift.occasion}</span>
      </div>
      <div className="floating-petals" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${i * -0.87}s`,
              animationDuration: `${7 + (i % 5)}s`,
            }}
          >
            {gift.theme === "galaxy"
              ? "✧"
              : gift.theme === "surprise"
                ? "✦"
                : "❀"}
          </span>
        ))}
      </div>
      {(opening || opened) && gift.theme === "surprise" && (
        <div className="confetti-burst" aria-hidden="true">
          {Array.from({ length: 64 }, (_, i) => (
            <i
              key={i}
              style={
                {
                  "--x": `${((i * 37) % 100) - 50}vw`,
                  "--y": `${((i * 19) % 80) - 65}vh`,
                  "--r": `${i * 51}deg`,
                  "--delay": `${(i % 5) * 0.07}s`,
                  background: [
                    "#b8657d",
                    "#e9ba72",
                    "#9fa580",
                    "#dbb4c6",
                    "#d48a69",
                  ][i % 5],
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
      {!opened ? (
        <div className="gift-intro">
          <span className="eyebrow">CÓ MỘT CHÚT THƯƠNG GỬI ĐẾN</span>
          <h1>
            {gift.recipient}
            <Heart size={26} />
          </h1>
          <div className="intro-art">
            <Artwork theme={gift.theme} large />
          </div>
          <p>Một món quà nhỏ, dành riêng cho bạn.</p>
          <button
            className="button primary"
            disabled={opening}
            onClick={openGift}
          >
            <MailOpen size={18} />{" "}
            {opening ? "Đang mở điều bất ngờ…" : "Chạm để mở quà"}{" "}
            <span>↗</span>
          </button>
          <small>
            <Volume2 size={13} /> Mở quà cùng một chút âm nhạc nhé
          </small>
        </div>
      ) : (
        <div className="gift-open-content">
          <span className="eyebrow">
            GỬI {gift.recipient.toLocaleUpperCase("vi")}
          </span>
          <h1>{gift.title}</h1>
          {gift.theme === "memories" ? (
            <div className="memory-viewer">
              <div className="memory-photo" key={slide}>
                <img
                  src={photos[slide % photos.length]}
                  alt={`Kỷ niệm ${(slide % photos.length) + 1}`}
                />
                <span>
                  Khoảnh khắc {(slide % photos.length) + 1} · Những ngày có nhau
                  ♡
                </span>
              </div>
              <div className="slide-controls">
                <button
                  className="icon-button"
                  aria-label="Ảnh trước"
                  onClick={() =>
                    setSlide((slide - 1 + photos.length) % photos.length)
                  }
                >
                  <ChevronLeft />
                </button>
                <span>
                  {(slide % photos.length) + 1} / {photos.length}
                </span>
                <button
                  className="icon-button"
                  aria-label="Ảnh tiếp"
                  onClick={() => setSlide((slide + 1) % photos.length)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          ) : gift.theme === "galaxy" ? (
            <div className="live-galaxy">
              <div className="starfield" />
              <div className="live-heart">
                <Heart fill="currentColor" />
              </div>
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="live-orbit"
                  style={
                    {
                      "--angle": `${(i * 360) / photos.length}deg`,
                      "--delay": `${(i * -24) / photos.length}s`,
                    } as React.CSSProperties
                  }
                >
                  <img src={photo} alt={`Kỷ niệm ${i + 1}`} />
                </div>
              ))}
              <span className="galaxy-script">my whole universe, is you.</span>
            </div>
          ) : gift.theme === "vinyl" ? (
            <div className={`vinyl-viewer ${playing ? "playing-art" : ""}`}>
              <Artwork theme="vinyl" large />
            </div>
          ) : (
            !letter && (
              <div className="opened-art">
                <Artwork theme={gift.theme} large />
              </div>
            )
          )}
          {letter ? (
            <div className="revealed-letter">
              <Heart size={21} />
              <TypedMessage message={gift.message} />
              <span className="letter-signature">{gift.sender}</span>
              <span className="letter-end">with all my love ♡</span>
            </div>
          ) : (
            <button
              className="button letter-open-button"
              onClick={() => setLetter(true)}
            >
              <MailOpen size={18} /> Có một lá thư cho bạn <span>↗</span>
            </button>
          )}
          <div className="gift-signoff">
            Được gói ghém bằng tất cả yêu thương <Heart size={12} />
          </div>
        </div>
      )}
      <div className="experience-bottom">
        <button
          className={`music-control ${playing ? "is-playing" : ""}`}
          onClick={toggleMusic}
          aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
        >
          <span className="music-mini-icon">
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </span>
          <span>
            {audioError
              ? "Chạm để thử phát lại"
              : track?.title || "Bản nhạc của bạn"}
            <small>
              {playing ? "Đang phát · Chạm để tạm dừng" : "Chạm để nghe nhạc"}
            </small>
          </span>
          <Music2 size={17} />
        </button>
        {opened && (
          <button
            className="experience-replay icon-button"
            aria-label="Mở lại từ đầu"
            onClick={() => {
              setOpened(false);
              setLetter(false);
              audio.current?.pause();
            }}
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
function TypedMessage({ message }: { message: string }) {
  const [count, setCount] = useState(0);
  const finished = useRef(false);
  useEffect(() => {
    finished.current = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(message.length);
      return;
    }
    let shown = 0;
    const timer = setInterval(() => {
      if (finished.current) {
        clearInterval(timer);
        return;
      }
      shown = Math.min(message.length, shown + 3);
      setCount(shown);
      if (shown === message.length) clearInterval(timer);
    }, 22);
    return () => clearInterval(timer);
  }, [message]);
  return (
    <>
      <div className="letter-message" aria-label={message}>
        <span aria-hidden="true">
          {message.slice(0, count)}
          {count < message.length && <span className="typing-cursor">|</span>}
        </span>
      </div>
      {count < message.length && (
        <button
          className="skip-typing"
          onClick={() => {
            finished.current = true;
            setCount(message.length);
          }}
        >
          Đọc trọn lá thư <ChevronRight size={12} />
        </button>
      )}
    </>
  );
}
