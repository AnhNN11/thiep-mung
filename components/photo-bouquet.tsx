"use client";
import dynamic from "next/dynamic";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import { BouquetArt } from "./bouquet-art";
import { FacultyButterflies } from "./faculty-butterflies";
import { FacultyWishes } from "./faculty-wishes";
import { BouquetLetter, EnvelopeFace } from "./bouquet-letter";
import {
  bouquetParts,
  flowerCovers,
  sampleBouquetPhotos,
  sampleRainPhotos,
  rainMessages,
} from "@/lib/bouquet";
import { tracks, type Gift } from "@/lib/templates";
const LoveRain = dynamic(
  () => import("./love-rain").then((module) => module.LoveRain),
  { ssr: false },
);
type Phase = "loading" | "flowers" | "revealing" | "ready" | "opening" | "rain";
export type BouquetPresentation = {
  variant?: "faculty" | "romantic";
  eyebrow: string;
  title: string;
  subtitle: string;
  signature: string;
  messages: string[];
  rainPhotos?: string[];
  rainPhotoInsets?: Record<string, { top: number; bottom: number }>;
  envelopeTo?: string;
  letterPhoto?: string;
  letterAutoScroll?: boolean;
  letterCompactPhoto?: boolean;
  portraitKinds?: ("photo" | "cutout" | "flag")[];
  butterflies?: boolean;
  featuredWishes?: string[];
  featuredEyebrow?: string;
  featuredDedication?: string;
  revealHint?: string;
};
export function PhotoBouquet({
  gift,
  embedded = false,
  presentation,
}: {
  gift: Gift;
  embedded?: boolean;
  presentation?: BouquetPresentation;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const holdFrame = useRef(0),
    fadeFrame = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduced = useRef(false);
  const livePhase = useRef<Phase>(phase);
  livePhase.current = phase;
  const photos = gift.photos.length
    ? gift.photos.slice(0, 6)
    : sampleBouquetPhotos;
  const usingSample = photos.every((photo) =>
    photo.startsWith("/dlove/photos/"),
  );
  const flyingPhotos =
    presentation?.rainPhotos || (usingSample ? sampleRainPhotos : photos);
  const source =
    tracks.find((track) => track.id === gift.music)?.src ||
    (gift.music.startsWith("data:audio/")
      ? gift.music
      : "/music/dlove-sample.mp3");
  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let alive = true;
    const sources = [
      ...new Set(
        [...bouquetParts, ...flowerCovers].map(
          (part) => `/dlove/bouquet/${part.asset}.webp`,
        ),
      ),
      "/dlove/bouquet/bow.webp",
      ...photos,
    ];
    Promise.all(
      sources.map(
        (src) =>
          new Promise<boolean>((resolve) => {
            const image = new Image();
            image.onload = () => resolve(true);
            image.onerror = () => resolve(false);
            image.src = src;
          }),
      ),
    ).then((results) => {
      if (alive) {
        setLoadError(results.some((ok) => !ok));
        setPhase("flowers");
      }
    });
    return () => {
      alive = false;
      timers.current.forEach(clearTimeout);
      cancelAnimationFrame(holdFrame.current);
      cancelAnimationFrame(fadeFrame.current);
    };
    // A gift is mounted once; these assets remain stable for its lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function later(callback: () => void, delay: number) {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  }
  async function playMusic() {
    const el = audio.current;
    if (!el || !el.paused) return;
    try {
      el.volume = 0;
      await el.play();
      setAudioError(false);
      const since = performance.now();
      const fade = (now: number) => {
        if (el.paused) return;
        el.volume = Math.max(0, Math.min(0.55, ((now - since) / 3000) * 0.55));
        if (el.volume < 0.55) fadeFrame.current = requestAnimationFrame(fade);
      };
      fadeFrame.current = requestAnimationFrame(fade);
    } catch {
      setAudioError(true);
    }
  }
  function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      cancelAnimationFrame(fadeFrame.current);
    } else void playMusic();
  }
  function reveal() {
    if (phase !== "flowers") return;
    void playMusic();
    setPhase("revealing");
    later(() => setPhase("ready"), reduced.current ? 10 : 2700);
  }
  function open() {
    if (livePhase.current !== "ready") return;
    cancelAnimationFrame(holdFrame.current);
    setHolding(false);
    setProgress(1);
    void playMusic();
    setPhase("opening");
    later(() => setPhase("rain"), reduced.current ? 10 : 1850);
    later(() => setLetterVisible(true), 5000);
  }
  function hold(event: PointerEvent<HTMLButtonElement>) {
    if (phase !== "ready" || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setHolding(true);
    void playMusic();
    const start = performance.now();
    const tick = (time: number) => {
      const value = Math.min(1, (time - start) / 500);
      setProgress(value);
      if (value >= 1) open();
      else holdFrame.current = requestAnimationFrame(tick);
    };
    holdFrame.current = requestAnimationFrame(tick);
  }
  function release() {
    cancelAnimationFrame(holdFrame.current);
    if (livePhase.current === "ready") {
      setHolding(false);
      setProgress(0);
    }
  }
  function replay() {
    timers.current.forEach(clearTimeout);
    cancelAnimationFrame(holdFrame.current);
    setLetterOpen(false);
    setLetterVisible(false);
    setProgress(0);
    setPhase("flowers");
    audio.current?.pause();
    if (audio.current) audio.current.currentTime = 0;
  }
  return (
    <section
      className={`photo-bouquet ${embedded ? "pb-embedded" : ""} ${presentation ? "faculty-bouquet" : ""} ${presentation?.variant === "romantic" ? "romantic-bouquet" : ""} pb-phase-${phase}`}
      aria-label={
        presentation?.variant === "romantic"
          ? `Bó hoa và lá thư dành riêng cho ${gift.recipient}`
          : presentation
            ? "Thiệp chúc mừng 20/10 Khoa Tin học và Ngoại ngữ"
            : "Bó hoa ảnh và mưa yêu thương"
      }
    >
      <audio
        ref={audio}
        src={source}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setAudioError(true)}
      />
      {presentation?.butterflies && <FacultyButterflies />}
      <LoveRain
        appearance={presentation ? "tribute" : undefined}
        started={phase === "opening" || phase === "rain"}
        paused={letterOpen}
        photos={flyingPhotos}
        photoInsets={presentation?.rainPhotoInsets}
        messages={
          presentation?.messages ||
          (usingSample
            ? rainMessages
            : [
                gift.title,
                ...rainMessages.slice(0, 5),
                `Gửi ${gift.recipient}`,
              ])
        }
      />
      {phase === "rain" && presentation?.featuredWishes?.length && (
        <FacultyWishes
          wishes={presentation.featuredWishes}
          eyebrow={presentation.featuredEyebrow}
          dedication={presentation.featuredDedication}
        />
      )}
      {phase !== "rain" && (
        <div
          className={`pb-intro ${phase === "opening" ? "pb-leaving" : ""}`}
          style={{ "--hold-progress": progress } as CSSProperties}
        >
          {presentation && (
            <header className="faculty-heading">
              {presentation.variant === "romantic" ? (
                <span className="romantic-heading-heart" aria-hidden="true">
                  ♡
                </span>
              ) : (
                <img
                  className="faculty-flag"
                  src="/dedications/faculty-20-10/co-viet-nam.svg"
                  alt="Quốc kỳ Việt Nam"
                />
              )}
              <p>{presentation.eyebrow}</p>
              <h1>{presentation.title}</h1>
              <h2>{presentation.subtitle}</h2>
              <span>{presentation.signature}</span>
            </header>
          )}
          <div className="pb-stage">
            <BouquetArt
              photos={photos}
              state={phase}
              portraitKinds={presentation?.portraitKinds}
            />
            <button
              className={`pb-hit ${holding ? "pb-holding" : ""}`}
              disabled={
                phase === "loading" ||
                phase === "revealing" ||
                phase === "opening"
              }
              aria-label={
                phase === "ready"
                  ? "Ấn giữ bó hoa để mở thiệp"
                  : "Chạm vào bó hoa"
              }
              onClick={(event) => {
                if (phase === "flowers") reveal();
                else if (phase === "ready" && event.detail === 0) open();
              }}
              onPointerDown={hold}
              onPointerUp={release}
              onPointerCancel={release}
              onLostPointerCapture={release}
            >
              <svg
                className="pb-progress"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="44" />
                <circle
                  className="pb-progress-fill"
                  cx="50"
                  cy="50"
                  r="44"
                  pathLength="1"
                />
              </svg>
            </button>
          </div>
          <p className="pb-hint" role="status">
            {phase === "loading"
              ? "Đang chuẩn bị bó hoa…"
              : phase === "flowers"
                ? presentation
                  ? presentation.revealHint ||
                    "Chạm để hé lộ những gương mặt thân thương"
                  : "Chạm vào bó hoa"
                : phase === "ready"
                  ? presentation
                    ? "Ấn giữ bó hoa để mở lời chúc"
                    : "Ấn giữ bó hoa"
                  : ""}
          </p>
          {loadError && (
            <span className="pb-load-note">
              Một số ảnh chưa tải được. Bạn có thể tải lại trang để thử lại.
            </span>
          )}
        </div>
      )}
      {phase === "rain" && (
        <div className="pb-toolbar">
          {letterVisible && (
            <button
              className="pb-letter-button"
              aria-label="Mở lá thư"
              onClick={() => setLetterOpen(true)}
            >
              <EnvelopeFace
                occasion={gift.occasion}
                salutation={presentation?.envelopeTo}
              />
            </button>
          )}
          <button
            className="pb-sound-button"
            onClick={toggleMusic}
            aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
          >
            {playing ? <Volume2 size={26} /> : <VolumeX size={26} />}
          </button>
          <button
            className="pb-replay-button"
            onClick={replay}
            aria-label="Xem lại bó hoa"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      )}
      {audioError && (
        <button className="pb-audio-retry" onClick={() => void playMusic()}>
          Chạm để phát nhạc
        </button>
      )}
      {letterOpen && (
        <BouquetLetter
          autoScroll={presentation?.letterAutoScroll}
          compactPhoto={presentation?.letterCompactPhoto}
          gift={gift}
          photo={
            presentation?.letterPhoto ||
            (usingSample ? sampleBouquetPhotos[3] : photos[0])
          }
          salutation={presentation?.envelopeTo}
          onClose={() => setLetterOpen(false)}
        />
      )}
    </section>
  );
}
