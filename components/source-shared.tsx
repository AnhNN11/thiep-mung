"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Heart, Mail, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { tracks, type Gift } from "@/lib/templates";
export function useGiftAudio(gift: Gift, volume = 0.55) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false),
    [error, setError] = useState(false);
  useEffect(() => {
    const src =
      tracks.find((t) => t.id === gift.music)?.src ||
      (gift.music.startsWith("data:audio/") ? gift.music : tracks[0].src);
    const a = new Audio(src);
    a.loop = true;
    a.volume = volume;
    audio.current = a;
    a.onplay = () => setPlaying(true);
    a.onpause = () => setPlaying(false);
    a.onerror = () => {
      setError(true);
      setPlaying(false);
    };
    return () => {
      a.pause();
      a.removeAttribute("src");
      a.load();
    };
  }, [gift.music, volume]);
  const play = () => {
    audio.current
      ?.play()
      .then(() => setError(false))
      .catch(() => setError(true));
  };
  return {
    playing,
    error,
    play,
    toggle: () => {
      if (audio.current?.paused) play();
      else audio.current?.pause();
    },
  };
}
export function HoldButton({
  children,
  onComplete,
  onStart,
  duration = 1500,
  className = "",
  label,
}: {
  children: React.ReactNode;
  onComplete: () => void;
  onStart?: () => void;
  duration?: number;
  className?: string;
  label: string;
}) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function stop() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }
  function start() {
    if (timer.current) return;
    setHolding(true);
    onStart?.();
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onComplete();
    }, duration);
  }
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <button
      className={`sd-hold ${className} ${holding ? "holding" : ""}`}
      aria-label={label}
      style={{ "--hold-time": `${duration}ms` } as CSSProperties}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        start();
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={stop}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      <span className="sd-hold-progress" />
    </button>
  );
}
export function SceneControls({
  sound,
  onReplay,
  onLetter,
  onHeart,
}: {
  sound: ReturnType<typeof useGiftAudio>;
  onReplay: () => void;
  onLetter?: () => void;
  onHeart?: () => void;
}) {
  return (
    <div className="sd-controls">
      {onLetter && (
        <button aria-label="Mở lá thư" onClick={onLetter}>
          <Mail size={19} />
        </button>
      )}
      {onHeart && (
        <button aria-label="Trái tim hạt" onClick={onHeart}>
          <Heart size={19} />
        </button>
      )}
      <button
        aria-label={sound.playing ? "Tắt nhạc" : "Bật nhạc"}
        onClick={sound.toggle}
      >
        {sound.playing ? <Volume2 size={19} /> : <VolumeX size={19} />}
      </button>
      <button aria-label="Xem lại từ đầu" onClick={onReplay}>
        <RotateCcw size={18} />
      </button>
      {sound.error && (
        <span className="sd-audio-error" role="status">
          Chạm nút nhạc để thử phát lại
        </span>
      )}
    </div>
  );
}
export function SourceLetter({
  gift,
  onClose,
  moon = false,
}: {
  gift: Gift;
  onClose: () => void;
  moon?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false),
    [chars, setChars] = useState(0);
  useEffect(() => {
    dialog.current?.showModal();
    const t = setTimeout(() => setOpened(true), 620);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!opened || chars >= gift.message.length) return;
    const t = setTimeout(
      () => setChars((v) => v + 1),
      Math.max(28, Math.min(42, 22000 / gift.message.length)),
    );
    return () => clearTimeout(t);
  }, [opened, chars, gift.message.length]);
  return (
    <dialog
      ref={dialog}
      className={`sd-letter-dialog ${moon ? "moon-letter" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="sd-close" aria-label="Đóng thư" onClick={onClose}>
        <X />
      </button>
      <article
        className={`sd-letter-sheet ${opened ? "is-open" : ""}`}
        onClick={() => setChars(gift.message.length)}
      >
        {moon && (
          <img
            className="sd-moon-paper"
            src="/dlove/moon-vip/nguyet-thu/paper-straight.webp"
            alt=""
          />
        )}
        <div>
          <small>Một lá thư dành riêng cho {gift.recipient}</small>
          <h2>{gift.title}</h2>
          <p>
            {gift.message.slice(0, chars)}
            {chars < gift.message.length && "▏"}
          </p>
          <em>
            {chars >= gift.message.length
              ? gift.sender
              : "Chạm để hiện hết lời nhắn"}
          </em>
        </div>
      </article>
    </dialog>
  );
}
